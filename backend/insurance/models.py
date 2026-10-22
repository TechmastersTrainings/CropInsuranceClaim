from django.db import models
from accounts.models import User


class InsuranceProvider(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name="insurance_profile")
    company_name=models.CharField(max_length=200)
    registration_number=models.CharField(max_length=100,unique=True)
    gst_number=models.CharField(max_length=15,unique=True)
    irdai_license_number=models.CharField(max_length=100,unique=True)
    official_email=models.EmailField(unique=True)
    official_phone=models.CharField(max_length=15)
    website=models.URLField(blank=True,null=True)
    address=models.TextField()
    city=models.CharField(max_length=100)
    district=models.CharField(max_length=100)
    state=models.CharField(max_length=100)
    pincode=models.CharField(max_length=6)
    representative_name=models.CharField(max_length=150)
    representative_designation=models.CharField(max_length=100)
    wallet_address=models.CharField(max_length=255,blank=True,null=True)
    company_logo=models.ImageField(upload_to="insurance/logos/",blank=True,null=True)
    registration_certificate=models.FileField(upload_to="insurance/documents/",blank=True,null=True)
    gst_certificate=models.FileField(upload_to="insurance/documents/",blank=True,null=True)
    license_certificate=models.FileField(upload_to="insurance/documents/",blank=True,null=True)
    is_verified=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table="insurance_providers"
        ordering=["-id"]

    def __str__(self):
        return self.company_name


class InsurancePolicy(models.Model):
    insurance_provider=models.ForeignKey(InsuranceProvider,on_delete=models.CASCADE,related_name="policies")
    policy_name=models.CharField(max_length=200)
    policy_number=models.CharField(max_length=100,unique=True)
    crop_name=models.CharField(max_length=100)
    season=models.CharField(max_length=100)
    premium_amount=models.DecimalField(max_digits=12,decimal_places=2)
    coverage_amount=models.DecimalField(max_digits=12,decimal_places=2)
    weather_parameter=models.CharField(max_length=100)
    threshold_value=models.DecimalField(max_digits=10,decimal_places=2)
    policy_start_date=models.DateField()
    policy_end_date=models.DateField()
    description=models.TextField()
    terms_and_conditions=models.FileField(upload_to="insurance/policies/")
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table="insurance_policies"
        ordering=["-id"]

    def __str__(self):
        return self.policy_name