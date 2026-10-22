from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import WeatherProvider,WeatherRecord
from .serializers import WeatherProviderSerializer,WeatherRecordSerializer


class WeatherProviderViewSet(viewsets.ModelViewSet):
    queryset=WeatherProvider.objects.all().order_by("-id")
    serializer_class=WeatherProviderSerializer
    permission_classes=[IsAuthenticated]


class WeatherRecordViewSet(viewsets.ModelViewSet):
    queryset=WeatherRecord.objects.all().order_by("-recorded_at")
    serializer_class=WeatherRecordSerializer
    permission_classes=[IsAuthenticated]