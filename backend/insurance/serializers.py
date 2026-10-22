from rest_framework import serializers
from .models import InsuranceProvider,InsurancePolicy


class InsuranceProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model=InsuranceProvider
        fields="__all__"
        read_only_fields=("id","created_at","updated_at")


class InsurancePolicySerializer(serializers.ModelSerializer):
    insurance_provider_name=serializers.CharField(source="insurance_provider.company_name",read_only=True)

    class Meta:
        model=InsurancePolicy
        fields="__all__"
        read_only_fields=("id","created_at","updated_at")