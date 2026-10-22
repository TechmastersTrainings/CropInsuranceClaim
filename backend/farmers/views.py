from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Farmer,Farm,Crop
from .serializers import FarmerSerializer,FarmSerializer,CropSerializer


class FarmerViewSet(viewsets.ModelViewSet):
    queryset=Farmer.objects.all().order_by("-id")
    serializer_class=FarmerSerializer
    permission_classes=[IsAuthenticated]


class FarmViewSet(viewsets.ModelViewSet):
    queryset=Farm.objects.all().order_by("-id")
    serializer_class=FarmSerializer
    permission_classes=[IsAuthenticated]


class CropViewSet(viewsets.ModelViewSet):
    queryset=Crop.objects.all().order_by("-id")
    serializer_class=CropSerializer
    permission_classes=[IsAuthenticated]