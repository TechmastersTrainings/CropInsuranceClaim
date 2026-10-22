from rest_framework.routers import DefaultRouter
from .views import FarmerViewSet,FarmViewSet,CropViewSet

router=DefaultRouter()

router.register(r"farmers",FarmerViewSet,basename="farmers")
router.register(r"farms",FarmViewSet,basename="farms")
router.register(r"crops",CropViewSet,basename="crops")

urlpatterns=router.urls