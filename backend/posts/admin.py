from django.contrib import admin
from .models import SocialPost, Analytics

@admin.register(SocialPost)
class SocialPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'platform', 'status', 'likes', 'shares', 'comments', 'created_at']
    list_filter = ['platform', 'status', 'created_at']
    search_fields = ['title', 'content']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ['date', 'total_posts', 'total_likes', 'total_shares', 'avg_engagement_rate']
    list_filter = ['date']
    date_hierarchy = 'date'
    ordering = ['-date']
