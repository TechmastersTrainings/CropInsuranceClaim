from rest_framework.routers import DefaultRouter
from .views import InsuranceProviderViewSet,InsurancePolicyViewSet

router=DefaultRouter()

router.register(r"providers",InsuranceProviderViewSet,basename="providers")
router.register(r"policies",InsurancePolicyViewSet,basename="policies")

urlpatterns=router.urls