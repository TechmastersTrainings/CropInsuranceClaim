from rest_framework.routers import DefaultRouter
from .views import WeatherProviderViewSet,WeatherRecordViewSet

router=DefaultRouter()

router.register(r"providers",WeatherProviderViewSet,basename="weather-providers")
router.register(r"records",WeatherRecordViewSet,basename="weather-records")

urlpatterns=router.urls