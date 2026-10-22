from rest_framework import serializers
from .models import AuditLog,Notification


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model=AuditLog
        fields="__all__"
        read_only_fields=("id","created_at")


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Notification
        fields="__all__"
        read_only_fields=("id","created_at")