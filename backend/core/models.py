from django.db import models


class AuditLog(models.Model):
    action=models.CharField(max_length=100)
    module=models.CharField(max_length=100)
    performed_by=models.CharField(max_length=150)
    description=models.TextField()
    ip_address=models.GenericIPAddressField(blank=True,null=True)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table="audit_logs"
        ordering=["-id"]

    def __str__(self):
        return f"{self.module} - {self.action}"


class Notification(models.Model):
    recipient=models.CharField(max_length=150)
    title=models.CharField(max_length=200)
    message=models.TextField()
    is_read=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table="notifications"
        ordering=["-id"]

    def __str__(self):
        return self.title