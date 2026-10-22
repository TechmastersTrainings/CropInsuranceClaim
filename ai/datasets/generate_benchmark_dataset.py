import os
import random
import pandas as pd
import numpy as np

# Seed for absolute reproducibility
np.random.seed(42)
random.seed(42)

CROPS = ["Cotton", "Paddy (Rice)", "Maize", "Soybean", "Wheat", "Pulses", "Sugarcane", "Vegetables", "Fruits"]

def generate_sample_record(sample_id):
    crop = random.choice(CROPS)
    crop_cycle_day = random.randint(20, 140)
    scenario = random.choices(
        ["HEALTHY_CANOPY", "DROUGHT_DESICCATION", "FLOOD_WATERLOGGING", "HEAT_STRESS", "PEST_FOLIAGE_LESION"],
        weights=[0.30, 0.25, 0.20, 0.15, 0.10]
    )[0]
    
    # Generate realistic correlated features based on agronomic scenario
    if scenario == "HEALTHY_CANOPY":
        temp = np.random.normal(26.0, 3.0)
        moisture = np.random.normal(28.0, 4.0)
        humidity = np.random.normal(65.0, 8.0)
        rainfall = np.random.exponential(15.0)
        dry_days = random.randint(0, 5)
        canopy_green = np.random.normal(0.78, 0.05)
        wilting = np.random.normal(0.08, 0.03)
        loss_pct = max(0.0, np.random.normal(4.0, 2.0))
        is_inconsistent = False
        reason = "Normal healthy condition"
        
    elif scenario == "DROUGHT_DESICCATION":
        temp = np.random.normal(37.5, 2.5)
        moisture = np.random.normal(11.0, 2.0)
        humidity = np.random.normal(38.0, 5.0)
        rainfall = 0.0
        dry_days = random.randint(18, 35)
        canopy_green = np.random.normal(0.32, 0.06)
        wilting = np.random.normal(0.82, 0.06)
        loss_pct = min(100.0, max(45.0, np.random.normal(68.0, 10.0)))
        is_inconsistent = False
        reason = "Prolonged dry spell verified"
        
    elif scenario == "FLOOD_WATERLOGGING":
        temp = np.random.normal(24.0, 2.0)
        moisture = np.random.normal(48.0, 5.0)
        humidity = np.random.normal(92.0, 4.0)
        rainfall = np.random.normal(175.0, 30.0)
        dry_days = 0
        canopy_green = np.random.normal(0.42, 0.08)
        wilting = np.random.normal(0.55, 0.08)
        loss_pct = min(100.0, max(30.0, np.random.normal(54.0, 12.0)))
        is_inconsistent = False
        reason = "Precipitation flood verified"
        
    elif scenario == "HEAT_STRESS":
        temp = np.random.normal(42.5, 1.8)
        moisture = np.random.normal(16.0, 3.0)
        humidity = np.random.normal(32.0, 6.0)
        rainfall = 0.0
        dry_days = random.randint(7, 15)
        canopy_green = np.random.normal(0.40, 0.07)
        wilting = np.random.normal(0.68, 0.07)
        loss_pct = min(100.0, max(35.0, np.random.normal(58.0, 8.0)))
        is_inconsistent = False
        reason = "Extreme temperature anomaly verified"
        
    else:  # PEST_FOLIAGE_LESION
        temp = np.random.normal(29.0, 2.5)
        moisture = np.random.normal(24.0, 3.5)
        humidity = np.random.normal(78.0, 7.0)
        rainfall = np.random.exponential(10.0)
        dry_days = random.randint(2, 8)
        canopy_green = np.random.normal(0.48, 0.06)
        wilting = np.random.normal(0.60, 0.08)
        loss_pct = min(100.0, max(20.0, np.random.normal(44.0, 10.0)))
        is_inconsistent = False
        reason = "Foliage lesion symptoms"
        
    # In 8% of cases, inject a realistic claim inconsistency (fraud screening benchmark)
    if random.random() < 0.08:
        is_inconsistent = True
        claimed_cause = random.choice(["Flash Flood", "Severe Drought"])
        if claimed_cause == "Flash Flood" and rainfall < 5.0 and moisture < 18.0:
            reason = "Claim reported flash flood, but rainfall station and soil probe recorded zero moisture anomaly"
        elif claimed_cause == "Severe Drought" and rainfall > 80.0 and moisture > 35.0:
            reason = "Claim reported drought, but local AWS recorded heavy rainfall (85mm+) during event window"
        else:
            reason = "Mismatch between claimed event date and satellite NDVI vegetative baseline"

    return {
        "sample_id": f"SMP-{sample_id:04d}",
        "crop_name": crop,
        "crop_cycle_day": crop_cycle_day,
        "temperature_c": round(float(temp), 2),
        "soil_moisture_pct": round(float(max(5.0, min(60.0, moisture))), 2),
        "humidity_pct": round(float(max(15.0, min(100.0, humidity))), 2),
        "rainfall_mm": round(float(max(0.0, rainfall)), 2),
        "consecutive_dry_days": dry_days,
        "canopy_green_index": round(float(max(0.05, min(0.95, canopy_green))), 3),
        "foliage_wilting_index": round(float(max(0.05, min(0.95, wilting))), 3),
        "damage_category": scenario,
        "loss_percentage": round(float(loss_pct), 1),
        "is_inconsistent_claim": 1 if is_inconsistent else 0,
        "inconsistency_reason": reason
    }

def main():
    records = [generate_sample_record(i) for i in range(1, 1201)]
    df = pd.DataFrame(records)
    out_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(out_dir, "synthetic_features.csv")
    df.to_csv(out_path, index=False)
    print(f"Generated {len(df)} stratified agronomic records saved to {out_path}")

if __name__ == "__main__":
    main()
