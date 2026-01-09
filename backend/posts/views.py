from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count
from django.utils import timezone
from datetime import datetime, timedelta
import requests
from .models import SocialPost, Analytics
from .serializers import SocialPostSerializer, AnalyticsSerializer


class SocialPostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on Social Posts
    Provides: list, create, retrieve, update, partial_update, destroy
    """
    queryset = SocialPost.objects.all()
    serializer_class = SocialPostSerializer
    
    def list(self, request):
        """GET /api/posts/ - List all posts"""
        queryset = self.get_queryset()
        platform = request.query_params.get('platform', None)
        status_filter = request.query_params.get('status', None)
        
        if platform:
            queryset = queryset.filter(platform=platform)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """POST /api/posts/ - Create new post"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        """GET /api/posts/{id}/ - Get single post"""
        try:
            post = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer(post)
            return Response(serializer.data)
        except SocialPost.DoesNotExist:
            return Response(
                {'error': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def update(self, request, pk=None):
        """PUT /api/posts/{id}/ - Full update"""
        try:
            post = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer(post, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SocialPost.DoesNotExist:
            return Response(
                {'error': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def partial_update(self, request, pk=None):
        """PATCH /api/posts/{id}/ - Partial update"""
        try:
            post = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer(post, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SocialPost.DoesNotExist:
            return Response(
                {'error': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def destroy(self, request, pk=None):
        """DELETE /api/posts/{id}/ - Delete post"""
        try:
            post = self.get_queryset().get(pk=pk)
            post.delete()
            return Response(
                {'message': 'Post deleted successfully'},
                status=status.HTTP_204_NO_CONTENT
            )
        except SocialPost.DoesNotExist:
            return Response(
                {'error': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """GET /api/posts/dashboard_stats/ - Get dashboard statistics"""
        posts = SocialPost.objects.all()
        
        stats = {
            'total_posts': posts.count(),
            'total_likes': posts.aggregate(Sum('likes'))['likes__sum'] or 0,
            'total_shares': posts.aggregate(Sum('shares'))['shares__sum'] or 0,
            'total_comments': posts.aggregate(Sum('comments'))['comments__sum'] or 0,
            'total_impressions': posts.aggregate(Sum('impressions'))['impressions__sum'] or 0,
            'avg_engagement_rate': posts.aggregate(Avg('likes'))['likes__avg'] or 0,
            'posts_by_platform': {},
            'posts_by_status': {},
            'recent_posts': SocialPostSerializer(posts[:5], many=True).data,
        }
        
        # Count by platform
        for platform, label in SocialPost.PLATFORM_CHOICES:
            count = posts.filter(platform=platform).count()
            stats['posts_by_platform'][platform] = count
        
        # Count by status
        for status_choice, label in SocialPost.STATUS_CHOICES:
            count = posts.filter(status=status_choice).count()
            stats['posts_by_status'][status_choice] = count
        
        return Response(stats)


class AnalyticsViewSet(viewsets.ModelViewSet):
    """ViewSet for Analytics CRUD operations"""
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer
    
    @action(detail=False, methods=['get'])
    def weekly_report(self, request):
        """GET /api/analytics/weekly_report/ - Get last 7 days analytics"""
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=7)
        
        analytics = Analytics.objects.filter(
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')
        
        serializer = self.get_serializer(analytics, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def fetch_social_trends(request):
    """
    GET /api/social-trends/ - Fetch trending topics from external API
    This demonstrates third-party API integration
    """
    try:
        # Using OpenWeatherMap API as a demo (free tier available)
        # In production, you'd use Twitter API, Instagram API, etc.
        api_key = request.GET.get('api_key', 'demo')
        
        # Fallback to a public API that doesn't require auth
        # Using JSONPlaceholder for demo purposes
        response = requests.get(
            'https://jsonplaceholder.typicode.com/posts',
            params={'_limit': 10},
            timeout=10
        )
        
        if response.status_code == 200:
            posts = response.json()
            
            # Transform the data to match social media format
            trends = []
            for post in posts[:5]:
                trends.append({
                    'id': post['id'],
                    'title': post['title'][:50],
                    'content': post['body'][:100],
                    'engagement': post['id'] * 100,  # Mock engagement
                    'source': 'external_api'
                })
            
            return Response({
                'success': True,
                'trends': trends,
                'message': 'Successfully fetched trending topics',
                'timestamp': timezone.now().isoformat()
            })
        else:
            return Response({
                'success': False,
                'error': 'Failed to fetch data from external API',
                'status_code': response.status_code
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
    except requests.exceptions.RequestException as e:
        return Response({
            'success': False,
            'error': f'API request failed: {str(e)}'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['GET'])
def fetch_weather_data(request):
    """
    GET /api/weather/ - Fetch weather data as additional API integration
    This uses a real public API (Open-Meteo) that doesn't require authentication
    """
    try:
        # Default to New York coordinates
        latitude = request.GET.get('lat', '40.7128')
        longitude = request.GET.get('lon', '-74.0060')
        
        # Open-Meteo API (free, no auth required)
        response = requests.get(
            'https://api.open-meteo.com/v1/forecast',
            params={
                'latitude': latitude,
                'longitude': longitude,
                'current_weather': 'true',
                'timezone': 'auto'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            current = data.get('current_weather', {})
            
            return Response({
                'success': True,
                'weather': {
                    'temperature': current.get('temperature'),
                    'windspeed': current.get('windspeed'),
                    'time': current.get('time'),
                    'weathercode': current.get('weathercode')
                },
                'location': {
                    'latitude': latitude,
                    'longitude': longitude
                },
                'message': 'Weather data fetched successfully',
                'timestamp': timezone.now().isoformat()
            })
        else:
            return Response({
                'success': False,
                'error': 'Failed to fetch weather data'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
    except requests.exceptions.RequestException as e:
        return Response({
            'success': False,
            'error': f'Weather API request failed: {str(e)}'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['GET'])
def health_check(request):
    """GET /api/health/ - API health check"""
    return Response({
        'status': 'healthy',
        'timestamp': timezone.now().isoformat(),
        'database': 'connected',
        'total_posts': SocialPost.objects.count()
    })
