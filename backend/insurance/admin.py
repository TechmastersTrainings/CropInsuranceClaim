from django.contrib import admin
from .models import InsuranceProvider,InsurancePolicy


@admin.register(InsuranceProvider)
class InsuranceProviderAdmin(admin.ModelAdmin):
    list_display=("id","company_name","official_email","official_phone","state","is_verified","created_at")
    search_fields=("company_name","registration_number","gst_number","irdai_license_number","official_email")
    list_filter=("state","is_verified")
    readonly_fields=("created_at","updated_at")


@admin.register(InsurancePolicy)
class InsurancePolicyAdmin(admin.ModelAdmin):
    list_display=("id","policy_name","policy_number","insurance_provider","crop_name","premium_amount","coverage_amount","is_active","created_at")
    search_fields=("policy_name","policy_number","crop_name")
    list_filter=("crop_name","season","is_active")
    readonly_fields=("created_at","updated_at")