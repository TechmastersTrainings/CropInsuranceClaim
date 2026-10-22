from django.contrib import admin
from .models import WeatherProvider,WeatherRecord


@admin.register(WeatherProvider)
class WeatherProviderAdmin(admin.ModelAdmin):
    list_display=("id","organization_name","api_name","contact_email","is_active","created_at")
    search_fields=("organization_name","api_name","contact_email")
    list_filter=("is_active",)
    readonly_fields=("created_at","updated_at")


@admin.register(WeatherRecord)
class WeatherRecordAdmin(admin.ModelAdmin):
    list_display=("id","policy","weather_provider","temperature","humidity","rainfall","wind_speed","recorded_at")
    search_fields=("policy__policy_number","weather_provider__organization_name")
    list_filter=("recorded_at",)
    readonly_fields=("created_at",)