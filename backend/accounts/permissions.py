from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"

class IsFarmer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "FARMER"

class IsInsuranceProvider(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "INSURANCE"

class IsWeatherProvider(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "WEATHER"