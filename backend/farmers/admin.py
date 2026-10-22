from django.contrib import admin
from .models import Farmer, Farm, Crop


@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "aadhaar_number",
        "village",
        "district",
        "state",
        "created_at",
    )
    search_fields = (
        "user__username",
        "user__email",
        "aadhaar_number",
        "village",
        "district",
    )
    list_filter = (
        "state",
        "district",
        "gender",
    )
    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "farm_name",
        "survey_number",
        "farmer",
        "land_area",
        "land_unit",
        "created_at",
    )
    search_fields = (
        "farm_name",
        "survey_number",
        "farmer__user__username",
        "farmer__user__email",
    )
    list_filter = (
        "land_unit",
    )
    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "crop_name",
        "farm",
        "crop_season",
        "sowing_date",
        "expected_harvest_date",
        "created_at",
    )
    search_fields = (
        "crop_name",
        "farm__farm_name",
        "farm__survey_number",
    )
    list_filter = (
        "crop_season",
    )
    readonly_fields = (
        "created_at",
        "updated_at",
    )