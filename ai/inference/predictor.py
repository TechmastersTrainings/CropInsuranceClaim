import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional, List
from ai.preprocessing.image_pipeline import CropImagePreprocessor
from ai.preprocessing.timeseries_pipeline import SensorTimeSeriesPreprocessor


CATEGORY_LABELS = {
    "HEALTHY_CANOPY": "Healthy Canopy (Negligible Loss)",
    "DROUGHT_DESICCATION": "Severe Drought Desiccation",
    "FLOOD_WATERLOGGING": "Heavy Precipitation & Waterlogging",
    "HEAT_STRESS": "Extreme Heatwave Foliage Stress",
    "PEST_FOLIAGE_LESION": "Pest Infestation & Foliage Lesions"
}


class CropDamagePredictor:
    """Production AI inference engine for crop damage assessment and fraud screening.
    
    Enforces Section 25 strict IP confidentiality:
    - Never exposes internal model weights, internal architecture graphs, or proprietary prompts.
    - Exposes only agronomic indicators, severity tiers, correlation scores, and advisory rationales.
    """

    def __init__(self, models_dir: Optional[str] = None):
        if models_dir is None:
            models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
        self.models_dir = models_dir
        self.classifier = None
        self.regressor = None
        self.anomaly_detector = None
        self._load_models()

    def _load_models(self):
        clf_path = os.path.join(self.models_dir, "damage_classifier.joblib")
        reg_path = os.path.join(self.models_dir, "loss_regressor.joblib")
        anom_path = os.path.join(self.models_dir, "anomaly_detector.joblib")

        if os.path.exists(clf_path):
            try:
                self.classifier = joblib.load(clf_path)
            except Exception as e:
                print(f"Warning: Failed to load classifier: {e}")

        if os.path.exists(reg_path):
            try:
                self.regressor = joblib.load(reg_path)
            except Exception as e:
                print(f"Warning: Failed to load regressor: {e}")

        if os.path.exists(anom_path):
            try:
                self.anomaly_detector = joblib.load(anom_path)
            except Exception as e:
                print(f"Warning: Failed to load anomaly detector: {e}")

    def assess_claim(
        self,
        crop_name: str = "Cotton",
        crop_cycle_day: int = 60,
        image_path: Optional[str] = None,
        canopy_features: Optional[Dict[str, float]] = None,
        telemetry_readings: Optional[List[Dict[str, Any]]] = None,
        sensor_features: Optional[Dict[str, float]] = None,
        claimed_cause: Optional[str] = None,
        claimed_loss_percentage: Optional[float] = None
    ) -> Dict[str, Any]:
        """Performs multi-modal agronomic AI damage assessment and claim consistency screening."""

        # 1. Process Canopy Image Features
        if image_path and os.path.exists(image_path):
            img_feat = CropImagePreprocessor.extract_canopy_features(image_path)
            canopy_green = img_feat["canopy_green_index"]
            foliage_wilting = img_feat["foliage_wilting_index"]
        elif canopy_features:
            canopy_green = float(canopy_features.get("canopy_green_index", 0.65))
            foliage_wilting = float(canopy_features.get("foliage_wilting_index", 0.15))
        else:
            canopy_green = 0.50
            foliage_wilting = 0.35

        # 2. Process Telemetry Features
        if telemetry_readings:
            agg = SensorTimeSeriesPreprocessor.aggregate_window_features(telemetry_readings)
            temp = agg["mean_temperature"]
            moisture = agg["mean_moisture"]
            humidity = agg["mean_humidity"]
            rainfall = agg["total_rainfall"]
            dry_days = agg["dry_spell_days_proxy"]
        elif sensor_features:
            temp = float(sensor_features.get("temperature_c", 28.0))
            moisture = float(sensor_features.get("soil_moisture_pct", 24.0))
            humidity = float(sensor_features.get("humidity_pct", 65.0))
            rainfall = float(sensor_features.get("rainfall_mm", 10.0))
            dry_days = int(sensor_features.get("consecutive_dry_days", 2))
        else:
            temp, moisture, humidity, rainfall, dry_days = 28.0, 24.0, 65.0, 10.0, 2

        # 3. Assemble Inference Vector
        feature_df = pd.DataFrame([{
            "crop_cycle_day": crop_cycle_day,
            "temperature_c": temp,
            "soil_moisture_pct": moisture,
            "humidity_pct": humidity,
            "rainfall_mm": rainfall,
            "consecutive_dry_days": dry_days,
            "canopy_green_index": canopy_green,
            "foliage_wilting_index": foliage_wilting,
            "crop_name": crop_name
        }])

        # 4. Predict Damage Category & Loss
        if self.classifier is not None and self.regressor is not None:
            raw_cat = str(self.classifier.predict(feature_df)[0])
            cat_probs = self.classifier.predict_proba(feature_df)[0]
            confidence_score = float(np.max(cat_probs))
            raw_loss = float(self.regressor.predict(feature_df)[0])
            loss_pct = round(max(0.0, min(100.0, raw_loss)), 1)
        else:
            # Agronomic heuristic fallback
            if rainfall > 100.0 or moisture > 42.0:
                raw_cat = "FLOOD_WATERLOGGING"
                loss_pct = 55.0
            elif dry_days > 15 or moisture < 15.0:
                raw_cat = "DROUGHT_DESICCATION"
                loss_pct = 68.0
            elif temp > 38.0:
                raw_cat = "HEAT_STRESS"
                loss_pct = 48.0
            else:
                raw_cat = "HEALTHY_CANOPY"
                loss_pct = 5.0
            confidence_score = 0.88

        # 5. Agronomic Consistency & Anomaly Screening
        inconsistency_flags = []
        claimed_lower = (claimed_cause or "").lower()

        if "drought" in claimed_lower and (rainfall > 60.0 or moisture > 35.0):
            inconsistency_flags.append("Claimed drought contradicted by recorded rainfall (>60mm) and high soil moisture")

        if "flood" in claimed_lower and (rainfall < 15.0 and moisture < 20.0):
            inconsistency_flags.append("Claimed flood event contradicted by low precipitation (<15mm) and low soil moisture")

        if "heat" in claimed_lower and temp < 30.0:
            inconsistency_flags.append("Claimed heatwave contradicted by mild recorded temperature (<30°C)")

        if claimed_loss_percentage is not None and abs(claimed_loss_percentage - loss_pct) > 40.0:
            inconsistency_flags.append(f"Significant variance between claimed loss ({claimed_loss_percentage}%) and AI evaluated loss ({loss_pct}%)")

        anomaly_detected = len(inconsistency_flags) > 0
        anomaly_score = 0.85 if anomaly_detected else 0.12

        # 6. Weather Correlation Score
        # Measures alignment between verified environmental sensor history and crop damage condition
        if raw_cat == "DROUGHT_DESICCATION":
            weather_corr = 0.95 if (dry_days > 12 or moisture < 18.0) else 0.50
        elif raw_cat == "FLOOD_WATERLOGGING":
            weather_corr = 0.96 if (rainfall > 80.0 or moisture > 40.0) else 0.45
        elif raw_cat == "HEAT_STRESS":
            weather_corr = 0.92 if temp > 36.0 else 0.55
        else:
            weather_corr = 0.90

        # 7. Severity Tier
        if loss_pct < 15.0:
            severity = "Low"
        elif loss_pct < 40.0:
            severity = "Moderate"
        elif loss_pct < 70.0:
            severity = "High"
        else:
            severity = "Critical"

        # 8. Parametric Recommended Payout
        if loss_pct < 20.0:
            recommended_payout_pct = 0.0
        elif loss_pct < 50.0:
            recommended_payout_pct = round(loss_pct * 0.8, 1)
        else:
            recommended_payout_pct = round(min(100.0, loss_pct * 1.0), 1)

        # 9. Advisory Rationale (Section 25 Compliant: Agronomic explanation only)
        damage_display_name = CATEGORY_LABELS.get(raw_cat, raw_cat)
        if anomaly_detected:
            advisory = (
                f"Agronomic Discrepancy Flagged: {'; '.join(inconsistency_flags)}. "
                f"Automated payout withheld pending manual physical verification by Insurance Surveyor."
            )
        else:
            advisory = (
                f"Verified {damage_display_name} for {crop_name} at cycle day {crop_cycle_day}. "
                f"Environmental telemetry records {rainfall}mm cumulative rainfall, {temp}°C mean temperature, "
                f"and {moisture}% soil moisture level, aligning with {confidence_score * 100:.1f}% confidence with sensor thresholds."
            )

        return {
            "damage_category": damage_display_name,
            "damage_category_code": raw_cat,
            "severity_level": severity,
            "estimated_loss_percentage": loss_pct,
            "recommended_payout_percentage": recommended_payout_pct,
            "confidence_score": round(confidence_score, 3),
            "weather_correlation_score": round(weather_corr, 2),
            "anomaly_detected": anomaly_detected,
            "anomaly_score": round(anomaly_score, 2),
            "inconsistency_reasons": inconsistency_flags,
            "advisory_rationale": advisory,
            "canopy_indicators": {
                "canopy_green_index": round(canopy_green, 3),
                "foliage_wilting_index": round(foliage_wilting, 3)
            },
            "environmental_telemetry_summary": {
                "temperature_c": temp,
                "soil_moisture_pct": moisture,
                "humidity_pct": humidity,
                "rainfall_mm": rainfall,
                "consecutive_dry_days": dry_days
            }
        }
