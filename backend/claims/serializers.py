from rest_framework import serializers
from .models import InsuranceEnrollment,Claim


class InsuranceEnrollmentSerializer(serializers.ModelSerializer):
    farmer_name=serializers.CharField(source="farmer.user.username",read_only=True)
    policy_name=serializers.CharField(source="policy.policy_name",read_only=True)
    crop_name=serializers.CharField(source="crop.crop_name",read_only=True)

    class Meta:
        model=InsuranceEnrollment
        fields="__all__"
        read_only_fields=("id","created_at","updated_at")


class ClaimSerializer(serializers.ModelSerializer):
    farmer_name=serializers.CharField(source="enrollment.farmer.user.username",read_only=True)
    policy_name=serializers.CharField(source="enrollment.policy.policy_name",read_only=True)
    crop_name=serializers.CharField(source="enrollment.crop.crop_name",read_only=True)

    class Meta:
        model=Claim
        fields="__all__"
        read_only_fields=("id","created_at","updated_at")