from rest_framework.routers import DefaultRouter
from .views import AuditLogViewSet,NotificationViewSet

router=DefaultRouter()

router.register(r"audit-logs",AuditLogViewSet,basename="audit-logs")
router.register(r"notifications",NotificationViewSet,basename="notifications")

urlpatterns=router.urls