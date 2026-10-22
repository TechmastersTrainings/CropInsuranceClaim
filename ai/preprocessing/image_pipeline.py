import os
from typing import Dict, Any, Tuple
from PIL import Image
import numpy as np


class CropImagePreprocessor:
    """Preprocesses field crop images and extracts agronomic canopy indicators."""

    SUPPORTED_FORMATS = {"JPEG", "JPG", "PNG", "WEBP"}
    MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
    TARGET_RESIZE = (224, 224)

    @classmethod
    def validate_image_file(cls, file_path: str) -> Tuple[bool, str]:
        """Validates file existence, size, and valid image headers."""
        if not os.path.exists(file_path):
            return False, "File does not exist"
            
        file_size = os.path.getsize(file_path)
        if file_size > cls.MAX_FILE_SIZE_BYTES:
            return False, f"File exceeds maximum allowed size ({cls.MAX_FILE_SIZE_BYTES} bytes)"
            
        try:
            with Image.open(file_path) as img:
                img.verify()
                fmt = img.format.upper()
                if fmt not in cls.SUPPORTED_FORMATS:
                    return False, f"Unsupported format: {fmt}. Must be JPEG, PNG, or WebP"
            return True, "Valid"
        except Exception as e:
            return False, f"Corrupted or invalid image header: {str(e)}"

    @classmethod
    def extract_canopy_features(cls, file_path: str) -> Dict[str, float]:
        """Loads and converts image to RGB, calculates Excess Green Index (ExG) and scorch ratio."""
        with Image.open(file_path) as img:
            rgb_img = img.convert("RGB").resize(cls.TARGET_RESIZE)
            arr = np.asarray(rgb_img, dtype=np.float32) / 255.0
            
        r = arr[:, :, 0]
        g = arr[:, :, 1]
        b = arr[:, :, 2]
        
        # Excess Green Index: 2G - R - B
        exg = 2.0 * g - r - b
        mean_exg = float(np.mean(exg))
        canopy_green_index = float(np.clip((mean_exg + 1.0) / 2.0, 0.0, 1.0))
        
        # Scorch/Desiccation Brown Ratio (R > G > B with high red content)
        brown_mask = (r > g) & (g > b) & (r > 0.35)
        scorch_ratio = float(np.mean(brown_mask))
        
        # Inferred wilting / desiccation index proxy
        foliage_wilting_index = float(np.clip(scorch_ratio * 1.5 + (1.0 - canopy_green_index) * 0.4, 0.05, 0.95))

        return {
            "canopy_green_index": round(canopy_green_index, 3),
            "foliage_wilting_index": round(foliage_wilting_index, 3),
            "scorch_ratio": round(scorch_ratio, 3)
        }
