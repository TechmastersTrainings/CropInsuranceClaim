from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import AuditLog,Notification
from .serializers import AuditLogSerializer,NotificationSerializer


class AuditLogViewSet(viewsets.ModelViewSet):
    queryset=AuditLog.objects.all().order_by("-id")
    serializer_class=AuditLogSerializer
    permission_classes=[IsAuthenticated]


class NotificationViewSet(viewsets.ModelViewSet):
    queryset=Notification.objects.all().order_by("-id")
    serializer_class=NotificationSerializer
    permission_classes=[IsAuthenticated]