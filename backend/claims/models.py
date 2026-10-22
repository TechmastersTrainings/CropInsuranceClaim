from django.db import models
from farmers.models import Farmer,Crop
from insurance.models import InsurancePolicy


class InsuranceEnrollment(models.Model):
    farmer=models.ForeignKey(Farmer,on_delete=models.CASCADE,related_name="enrollments")
    crop=models.ForeignKey(Crop,on_delete=models.CASCADE,related_name="enrollments")
    policy=models.ForeignKey(InsurancePolicy,on_delete=models.CASCADE,related_name="enrollments")
    enrollment_date=models.DateField(auto_now_add=True)
    premium_paid=models.DecimalField(max_digits=12,decimal_places=2)
    transaction_id=models.CharField(max_length=150,unique=True)
    blockchain_transaction_hash=models.CharField(max_length=255,blank=True,null=True)
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table="insurance_enrollments"
        ordering=["-id"]

    def __str__(self):
        return f"{self.farmer.user.username} - {self.policy.policy_name}"


class Claim(models.Model):
    STATUS_CHOICES=[
        ("PENDING","Pending"),
        ("UNDER_REVIEW","Under Review"),
        ("APPROVED","Approved"),
        ("REJECTED","Rejected"),
        ("PAID","Paid"),
    ]

    enrollment=models.ForeignKey(InsuranceEnrollment,on_delete=models.CASCADE,related_name="claims")
    claim_reason=models.TextField()
    claim_amount=models.DecimalField(max_digits=12,decimal_places=2)
    weather_value=models.DecimalField(max_digits=10,decimal_places=2,blank=True,null=True)
    blockchain_transaction_hash=models.CharField(max_length=255,blank=True,null=True)
    status=models.CharField(max_length=20,choices=STATUS_CHOICES,default="PENDING")
    remarks=models.TextField(blank=True,null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table="claims"
        ordering=["-id"]

    def __str__(self):
        return f"Claim #{self.id}"