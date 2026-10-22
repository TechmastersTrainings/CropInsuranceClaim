from django.contrib import admin
from .models import AuditLog,Notification


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display=("id","action","module","performed_by","ip_address","created_at")
    search_fields=("action","module","performed_by")
    list_filter=("module","created_at")
    readonly_fields=("created_at",)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display=("id","recipient","title","is_read","created_at")
    search_fields=("recipient","title")
    list_filter=("is_read","created_at")
    readonly_fields=("created_at",)