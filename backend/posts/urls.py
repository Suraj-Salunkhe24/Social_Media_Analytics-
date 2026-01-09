from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    SocialPostViewSet,
    AnalyticsViewSet,
    fetch_social_trends,
    fetch_weather_data,
    health_check
)

router = DefaultRouter()
router.register(r'posts', SocialPostViewSet, basename='socialpost')
router.register(r'analytics', AnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('', include(router.urls)),
    path('social-trends/', fetch_social_trends, name='social-trends'),
    path('weather/', fetch_weather_data, name='weather'),
    path('health/', health_check, name='health'),
]
