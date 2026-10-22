from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import InsuranceEnrollment,Claim
from .serializers import InsuranceEnrollmentSerializer,ClaimSerializer


class InsuranceEnrollmentViewSet(viewsets.ModelViewSet):
    queryset=InsuranceEnrollment.objects.all().order_by("-id")
    serializer_class=InsuranceEnrollmentSerializer
    permission_classes=[IsAuthenticated]


class ClaimViewSet(viewsets.ModelViewSet):
    queryset=Claim.objects.all().order_by("-id")
    serializer_class=ClaimSerializer
    permission_classes=[IsAuthenticated]