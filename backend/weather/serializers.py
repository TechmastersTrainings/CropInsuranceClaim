from rest_framework import serializers
from .models import WeatherProvider,WeatherRecord


class WeatherProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model=WeatherProvider
        fields="__all__"
        read_only_fields=("id","created_at","updated_at")


class WeatherRecordSerializer(serializers.ModelSerializer):
    provider_name=serializers.CharField(source="weather_provider.organization_name",read_only=True)
    policy_name=serializers.CharField(source="policy.policy_name",read_only=True)

    class Meta:
        model=WeatherRecord
        fields="__all__"
        read_only_fields=("id","created_at")