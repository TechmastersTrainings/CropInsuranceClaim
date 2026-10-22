from rest_framework.routers import DefaultRouter
from .views import InsuranceEnrollmentViewSet,ClaimViewSet

router=DefaultRouter()

router.register(r"enrollments",InsuranceEnrollmentViewSet,basename="enrollments")
router.register(r"claims",ClaimViewSet,basename="claims")

urlpatterns=router.urls