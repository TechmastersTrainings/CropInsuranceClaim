from rest_framework import serializers
from .models import Farmer, Farm, Crop


class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")


class FarmSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source="farmer.user.username", read_only=True)

    class Meta:
        model = Farm
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")


class CropSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source="farm.farm_name", read_only=True)

    class Meta:
        model = Crop
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")