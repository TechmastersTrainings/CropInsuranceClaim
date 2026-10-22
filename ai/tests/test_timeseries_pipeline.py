from ai.preprocessing.timeseries_pipeline import SensorTimeSeriesPreprocessor


def test_sensor_timeseries_aggregation():
    readings = [
        {"temperature": 32.0, "moisture": 18.0, "humidity": 50.0, "rainfall": 0.0},
        {"temperature": 34.0, "moisture": 16.0, "humidity": 45.0, "rainfall": 0.0},
        {"temperature": 36.0, "moisture": 14.0, "humidity": 40.0, "rainfall": 0.0},
    ]
    
    features = SensorTimeSeriesPreprocessor.aggregate_window_features(readings)
    assert features["mean_temperature"] == 34.0
    assert features["min_moisture"] == 14.0
    assert features["total_rainfall"] == 0.0
    assert "dry_spell_days_proxy" in features


def test_sensor_timeseries_empty_fallback():
    features = SensorTimeSeriesPreprocessor.aggregate_window_features([])
    assert "mean_temperature" in features
    assert "mean_moisture" in features
    assert features["total_rainfall"] == 0.0
