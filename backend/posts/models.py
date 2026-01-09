from django.db import models
from django.utils import timezone

class SocialPost(models.Model):
    """Model for storing social media posts"""
    
    PLATFORM_CHOICES = [
        ('twitter', 'Twitter/X'),
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('linkedin', 'LinkedIn'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('scheduled', 'Scheduled'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, default='twitter')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    likes = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    impressions = models.IntegerField(default=0)
    scheduled_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Social Post'
        verbose_name_plural = 'Social Posts'
    
    def __str__(self):
        return f"{self.title} - {self.platform}"
    
    @property
    def engagement_rate(self):
        """Calculate engagement rate"""
        if self.impressions == 0:
            return 0
        total_engagement = self.likes + self.shares + self.comments
        return round((total_engagement / self.impressions) * 100, 2)


class Analytics(models.Model):
    """Model for storing daily analytics"""
    
    date = models.DateField(unique=True)
    total_posts = models.IntegerField(default=0)
    total_likes = models.IntegerField(default=0)
    total_shares = models.IntegerField(default=0)
    total_comments = models.IntegerField(default=0)
    total_impressions = models.IntegerField(default=0)
    avg_engagement_rate = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date']
        verbose_name = 'Analytics'
        verbose_name_plural = 'Analytics'
    
    def __str__(self):
        return f"Analytics for {self.date}"
