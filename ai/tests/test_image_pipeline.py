import os
import tempfile
import numpy as np
from PIL import Image
from ai.preprocessing.image_pipeline import CropImagePreprocessor


def test_image_validation_valid():
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f:
        img = Image.new("RGB", (100, 100), color="green")
        img.save(f.name, "JPEG")
        path = f.name
        
    try:
        is_valid, reason = CropImagePreprocessor.validate_image_file(path)
        assert is_valid is True
        assert reason == "Valid"
    finally:
        if os.path.exists(path):
            os.remove(path)


def test_image_validation_nonexistent():
    is_valid, reason = CropImagePreprocessor.validate_image_file("nonexistent_random_crop_99.png")
    assert is_valid is False
    assert "does not exist" in reason


def test_canopy_feature_extraction():
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
        # Create a predominantly green crop image
        arr = np.zeros((100, 100, 3), dtype=np.uint8)
        arr[:, :, 1] = 200  # High green channel
        arr[:, :, 0] = 50   # Low red
        arr[:, :, 2] = 50   # Low blue
        img = Image.fromarray(arr)
        img.save(f.name, "PNG")
        path = f.name
        
    try:
        features = CropImagePreprocessor.extract_canopy_features(path)
        assert "canopy_green_index" in features
        assert "foliage_wilting_index" in features
        assert "scorch_ratio" in features
        assert features["canopy_green_index"] > 0.60
    finally:
        if os.path.exists(path):
            os.remove(path)
