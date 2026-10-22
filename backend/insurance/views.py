from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import InsuranceProvider,InsurancePolicy
from .serializers import InsuranceProviderSerializer,InsurancePolicySerializer


class InsuranceProviderViewSet(viewsets.ModelViewSet):
    queryset=InsuranceProvider.objects.all().order_by("-id")
    serializer_class=InsuranceProviderSerializer
    permission_classes=[IsAuthenticated]


class InsurancePolicyViewSet(viewsets.ModelViewSet):
    queryset=InsurancePolicy.objects.all().order_by("-id")
    serializer_class=InsurancePolicySerializer
    permission_classes=[IsAuthenticated]