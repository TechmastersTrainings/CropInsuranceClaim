from typing import List, Dict, Any
import numpy as np


class SensorTimeSeriesPreprocessor:
    """Preprocesses environmental and sensor telemetry streams into ML features."""

    @classmethod
    def aggregate_window_features(cls, readings: List[Dict[str, Any]]) -> Dict[str, float]:
        """Calculates window statistics from recent sensor telemetry frames."""
        if not readings:
            return {
                "mean_temperature": 25.0,
                "min_moisture": 25.0,
                "mean_moisture": 25.0,
                "mean_humidity": 60.0,
                "total_rainfall": 0.0,
                "dry_spell_days_proxy": 0
            }
            
        temps = [r.get("temperature", 25.0) for r in readings]
        moists = [r.get("moisture", 25.0) for r in readings]
        humids = [r.get("humidity", 60.0) for r in readings]
        rains = [r.get("rainfall", 0.0) for r in readings]
        
        min_moist = float(np.min(moists))
        mean_moist = float(np.mean(moists))
        mean_temp = float(np.mean(temps))
        mean_humid = float(np.mean(humids))
        tot_rain = float(np.sum(rains))
        
        # Estimate dry spell proxy (readings where rainfall == 0 and moisture < 18)
        dry_readings = sum(1 for m, r in zip(moists, rains) if r == 0.0 and m < 18.0)
        dry_days_proxy = int(round(dry_readings * (24 / max(1, len(readings)))))

        return {
            "mean_temperature": round(mean_temp, 2),
            "min_moisture": round(min_moist, 2),
            "mean_moisture": round(mean_moist, 2),
            "mean_humidity": round(mean_humid, 2),
            "total_rainfall": round(tot_rain, 2),
            "dry_spell_days_proxy": dry_days_proxy
        }
