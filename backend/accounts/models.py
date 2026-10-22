from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager
class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        FARMER = "FARMER", "Farmer"
        INSURANCE = "INSURANCE", "Insurance Provider"
        WEATHER = "WEATHER", "Weather Provider"
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.FARMER
    )

    phone = models.CharField(
        max_length=15,
        unique=True,
        blank=True,
        null=True
    )

    profile_image = models.ImageField(
        upload_to="users/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "username"
    ]
    def __str__(self):
        return self.email