from django.db import models
from accounts.models import User
from insurance.models import InsurancePolicy


class WeatherProvider(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name="weather_profile")
    organization_name=models.CharField(max_length=200)
    api_name=models.CharField(max_length=150)
    api_key=models.CharField(max_length=255)
    contact_email=models.EmailField(unique=True)
    website=models.URLField(blank=True,null=True)
    wallet_address=models.CharField(max_length=255,blank=True,null=True)
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table="weather_providers"
        ordering=["-id"]

    def __str__(self):
        return self.organization_name


class WeatherRecord(models.Model):
    policy=models.ForeignKey(InsurancePolicy,on_delete=models.CASCADE,related_name="weather_records")
    weather_provider=models.ForeignKey(WeatherProvider,on_delete=models.CASCADE,related_name="weather_records")
    temperature=models.DecimalField(max_digits=5,decimal_places=2)
    humidity=models.DecimalField(max_digits=5,decimal_places=2)
    rainfall=models.DecimalField(max_digits=8,decimal_places=2)
    wind_speed=models.DecimalField(max_digits=6,decimal_places=2)
    recorded_at=models.DateTimeField()
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table="weather_records"
        ordering=["-recorded_at"]

    def __str__(self):
        return f"{self.policy.policy_number} - {self.recorded_at}"