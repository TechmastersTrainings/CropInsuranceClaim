from django.db import models
from accounts.models import User


class Farmer(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="farmer_profile"
    )

    aadhaar_number = models.CharField(max_length=12, unique=True)

    pan_number = models.CharField(
        max_length=10,
        blank=True,
        null=True
    )

    date_of_birth = models.DateField()

    gender = models.CharField(
        max_length=10,
        choices=[
            ("Male", "Male"),
            ("Female", "Female"),
            ("Other", "Other"),
        ]
    )

    address = models.TextField()

    village = models.CharField(max_length=100)

    taluk = models.CharField(max_length=100)

    district = models.CharField(max_length=100)

    state = models.CharField(max_length=100)

    pincode = models.CharField(max_length=6)

    bank_name = models.CharField(max_length=150)

    account_holder_name = models.CharField(max_length=150)

    account_number = models.CharField(max_length=30)

    ifsc_code = models.CharField(max_length=15)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "farmers"
        ordering = ["-id"]

    def __str__(self):
        return f"{self.user.username} ({self.aadhaar_number})"


class Farm(models.Model):
    farmer = models.ForeignKey(
        Farmer,
        on_delete=models.CASCADE,
        related_name="farms"
    )

    farm_name = models.CharField(max_length=150)

    survey_number = models.CharField(max_length=100)

    land_area = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    land_unit = models.CharField(
        max_length=20,
        default="Acres"
    )

    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        blank=True,
        null=True
    )

    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        blank=True,
        null=True
    )

    soil_type = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    irrigation_type = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    ownership_document = models.FileField(
        upload_to="documents/land/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "farms"
        ordering = ["-id"]

    def __str__(self):
        return f"{self.farm_name} ({self.survey_number})"


class Crop(models.Model):
    farm = models.ForeignKey(
        Farm,
        on_delete=models.CASCADE,
        related_name="crops"
    )

    crop_name = models.CharField(max_length=100)

    crop_season = models.CharField(max_length=100)

    sowing_date = models.DateField()

    expected_harvest_date = models.DateField()

    cultivation_area = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    estimated_yield = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "crops"
        ordering = ["-id"]

    def __str__(self):
        return f"{self.crop_name} - {self.farm.farm_name}"