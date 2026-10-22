from django.contrib import admin
from .models import InsuranceEnrollment,Claim


@admin.register(InsuranceEnrollment)
class InsuranceEnrollmentAdmin(admin.ModelAdmin):
    list_display=("id","farmer","crop","policy","premium_paid","transaction_id","is_active","created_at")
    search_fields=("farmer__user__username","policy__policy_name","transaction_id")
    list_filter=("is_active","created_at")
    readonly_fields=("created_at","updated_at")


@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display=("id","enrollment","claim_amount","status","created_at")
    search_fields=("enrollment__farmer__user__username","enrollment__policy__policy_name")
    list_filter=("status","created_at")
    readonly_fields=("created_at","updated_at")