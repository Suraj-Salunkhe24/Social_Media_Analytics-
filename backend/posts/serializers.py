from rest_framework import serializers
from .models import SocialPost, Analytics

class SocialPostSerializer(serializers.ModelSerializer):
    engagement_rate = serializers.ReadOnlyField()
    
    class Meta:
        model = SocialPost
        fields = [
            'id', 'title', 'content', 'platform', 'status',
            'likes', 'shares', 'comments', 'impressions',
            'engagement_rate', 'scheduled_time',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = [
            'id', 'date', 'total_posts', 'total_likes',
            'total_shares', 'total_comments', 'total_impressions',
            'avg_engagement_rate', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
