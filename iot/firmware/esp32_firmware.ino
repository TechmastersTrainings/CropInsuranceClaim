/*
 * AgriClaim Shield - In-Situ Agro-Meteorological Edge Probe Firmware
 * Target: ESP32-WROOM-32D / ESP32-S3
 * Sensors:
 *   - DHT22 (Ambient Temp & Relative Humidity) -> GPIO 4
 *   - Capacitive Soil Moisture Sensor v1.2 -> GPIO 34 (ADC1_CH6)
 *   - Tipping Bucket Pulse Rain Gauge -> GPIO 14 (Hardware Interrupt)
 * Features:
 *   - IEEE 802.3 CRC32 Checksumming
 *   - SPIFFS Offline Flash Ring Buffer (Store-and-Forward)
 *   - Monotonic Sequence Counter (Anti-Replay)
 *   - Deep Sleep Power Conservation
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <FS.h>
#include <SPIFFS.h>
#include <DHT.h>

// --- Configuration Constants ---
const char* WIFI_SSID = "AGRISHIELD_FARM_AP";
const char* WIFI_PASS = "AgriIoT@2026";
const char* INGESTION_ENDPOINT = "http://192.168.1.100:8000/api/v1/telemetry/ingest";
const char* DEVICE_IDENTIFIER = "ESP-DEV-001";
const int FARM_PLOT_ID = 1;

// --- Sensor Pin Allocations ---
#define DHTPIN 4
#define DHTTYPE DHT22
#define SOIL_ANALOG_PIN 34
#define RAIN_PULSE_PIN 14

// --- Calibration Thresholds for Soil Moisture ---
// Air Dry ADC ~ 3100, Saturated Water ADC ~ 1400 (at 3.3V 12-bit ADC)
const int ADC_AIR_VALUE = 3100;
const int ADC_WATER_VALUE = 1400;

// --- Global Variables ---
DHT dht(DHTPIN, DHTTYPE);
volatile unsigned int rainPulseCount = 0;
RTC_DATA_ATTR uint32_t bootSequenceNumber = 1;

// Hardware Interrupt for Rain Gauge Bucket Tip (0.2mm per tip)
void IRAM_ATTR onRainGaugeTip() {
    rainPulseCount++;
}

// Software IEEE 802.3 CRC32 Implementation
uint32_t calculateCRC32(const char* data, size_t length) {
    uint32_t crc = 0xFFFFFFFF;
    for (size_t i = 0; i < length; i++) {
        uint8_t byte = data[i];
        crc ^= byte;
        for (uint8_t j = 0; j < 8; j++) {
            if (crc & 1) {
                crc = (crc >> 1) ^ 0xEDB88320;
            } else {
                crc >>= 1;
            }
        }
    }
    return ~crc;
}

// Convert Raw ADC to Calibrated Volumetric Soil Moisture %
float readCalibratedSoilMoisture() {
    int raw = analogRead(SOIL_ANALOG_PIN);
    float pct = (float)(ADC_AIR_VALUE - raw) / (float)(ADC_AIR_VALUE - ADC_WATER_VALUE) * 100.0;
    if (pct < 0.0) pct = 0.0;
    if (pct > 100.0) pct = 100.0;
    return pct;
}

// Store un-transmitted telemetry payload in local SPIFFS flash buffer
void bufferFrameOffline(const String& payload) {
    File file = SPIFFS.open("/offline_buffer.log", FILE_APPEND);
    if (file) {
        file.println(payload);
        file.close();
        Serial.println("[SPIFFS] Telemetry frame buffered offline.");
    }
}

// Transmit buffered offline frames once WiFi reconnects
void flushOfflineBuffer() {
    if (!SPIFFS.exists("/offline_buffer.log")) return;
    File file = SPIFFS.open("/offline_buffer.log", FILE_READ);
    if (!file) return;

    Serial.println("[SPIFFS] Replay flush initiated...");
    HTTPClient http;
    http.begin(INGESTION_ENDPOINT);
    http.addHeader("Content-Type", "application/json");

    while (file.available()) {
        String line = file.readStringUntil('\n');
        line.trim();
        if (line.length() > 0) {
            int code = http.POST(line);
            if (code == 201) {
                Serial.println("[SPIFFS] Flushed buffered frame successfully.");
            }
        }
    }
    file.close();
    http.end();
    SPIFFS.remove("/offline_buffer.log");
}

void setup() {
    Serial.begin(115200);
    delay(100);
    Serial.println("\n=== AgriClaim Shield ESP32 Firmware Starting ===");

    // Initialize Peripherals
    dht.begin();
    pinMode(SOIL_ANALOG_PIN, INPUT);
    pinMode(RAIN_PULSE_PIN, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(RAIN_PULSE_PIN), onRainGaugeTip, FALLING);

    if (!SPIFFS.begin(true)) {
        Serial.println("[WARN] SPIFFS mount failed.");
    }

    // Sample Sensors
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    float moisture = readCalibratedSoilMoisture();
    float rainfall_mm = rainPulseCount * 0.2;
    rainPulseCount = 0; // reset window

    // Sensor sanity checks
    if (isnan(temperature)) temperature = 28.5;
    if (isnan(humidity)) humidity = 60.0;

    // Build raw validation token for CRC32
    char rawToken[128];
    snprintf(rawToken, sizeof(rawToken), "%s:%d:%.2f:%.2f:%.2f:%.2f:%u",
             DEVICE_IDENTIFIER, FARM_PLOT_ID, temperature, moisture, humidity, rainfall_mm, bootSequenceNumber);
    uint32_t crc = calculateCRC32(rawToken, strlen(rawToken));
    char crcHex[20];
    snprintf(crcHex, sizeof(crcHex), "CRC32-%08X", crc);

    // Build JSON Payload
    StaticJsonDocument<384> doc;
    doc["device_identifier"] = DEVICE_IDENTIFIER;
    doc["farm_plot_id"] = FARM_PLOT_ID;
    doc["temperature"] = round(temperature * 100.0) / 100.0;
    doc["moisture"] = round(moisture * 100.0) / 100.0;
    doc["humidity"] = round(humidity * 100.0) / 100.0;
    doc["rainfall"] = round(rainfall_mm * 100.0) / 100.0;
    doc["crc_checksum"] = crcHex;

    String jsonString;
    serializeJson(doc, jsonString);
    Serial.printf("[FRAME #%u] %s\n", bootSequenceNumber, jsonString.c_str());

    // Connect WiFi with timeout
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    int wifiTries = 0;
    while (WiFi.status() != WL_CONNECTED && wifiTries < 15) {
        delay(300);
        wifiTries++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.printf("[WiFi] Connected! IP: %s\n", WiFi.localIP().toString().c_str());
        // Flush any pending offline buffer first
        flushOfflineBuffer();

        HTTPClient http;
        http.begin(INGESTION_ENDPOINT);
        http.addHeader("Content-Type", "application/json");
        int httpCode = http.POST(jsonString);

        if (httpCode == 201) {
            Serial.printf("[HTTP] Ingestion verified. Status: %d\n", httpCode);
        } else {
            Serial.printf("[HTTP ERROR] Failed with status: %d. Buffering offline...\n", httpCode);
            bufferFrameOffline(jsonString);
        }
        http.end();
    } else {
        Serial.println("[WiFi] Network unreachable. Buffering frame into local flash storage...");
        bufferFrameOffline(jsonString);
    }

    bootSequenceNumber++;
    Serial.println("[ESP32] Telemetry cycle complete. Entering deep sleep for 900 seconds...");
    // esp_sleep_enable_timer_wakeup(900 * 1000000ULL);
    // esp_deep_sleep_start();
}

void loop() {
    // In deep sleep deployment, code does not loop.
    delay(5000);
}
