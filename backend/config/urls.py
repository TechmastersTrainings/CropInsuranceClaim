from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def home(request):
    return JsonResponse({
        "project":"Blockchain Crop Insurance System",
        "version":"1.0.0",
        "status":"Backend Running"
    })


urlpatterns=[
    path("",home),
    path("admin/",admin.site.urls),

    path("api/accounts/",include("accounts.urls")),
    path("api/farmers/",include("farmers.urls")),
    path("api/insurance/",include("insurance.urls")),
    path("api/weather/",include("weather.urls")),
    path("api/claims/",include("claims.urls")),
    path("api/core/",include("core.urls")),
]

if settings.DEBUG:
    urlpatterns+=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)