import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Post Types
export interface SocialPost {
  id?: number;
  title: string;
  content: string;
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin';
  status: 'draft' | 'published' | 'scheduled';
  likes: number;
  shares: number;
  comments: number;
  impressions: number;
  engagement_rate?: number;
  scheduled_time?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  total_posts: number;
  total_likes: number;
  total_shares: number;
  total_comments: number;
  total_impressions: number;
  avg_engagement_rate: number;
  posts_by_platform: { [key: string]: number };
  posts_by_status: { [key: string]: number };
  recent_posts: SocialPost[];
}

// CRUD Operations
export const postAPI = {
  // GET all posts
  getAll: async (): Promise<SocialPost[]> => {
    const response = await api.get('/posts/');
    return response.data;
  },

  // GET single post
  getById: async (id: number): Promise<SocialPost> => {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  },

  // POST create new post
  create: async (post: Omit<SocialPost, 'id'>): Promise<SocialPost> => {
    const response = await api.post('/posts/', post);
    return response.data;
  },

  // PUT update post (full update)
  update: async (id: number, post: SocialPost): Promise<SocialPost> => {
    const response = await api.put(`/posts/${id}/`, post);
    return response.data;
  },

  // PATCH update post (partial update)
  partialUpdate: async (id: number, post: Partial<SocialPost>): Promise<SocialPost> => {
    const response = await api.patch(`/posts/${id}/`, post);
    return response.data;
  },

  // DELETE post
  delete: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}/`);
  },

  // GET dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/posts/dashboard_stats/');
    return response.data;
  },
};

// External API Integration
export const externalAPI = {
  // Fetch social trends
  getSocialTrends: async (): Promise<any> => {
    const response = await api.get('/social-trends/');
    return response.data;
  },

  // Fetch weather data
  getWeatherData: async (lat?: string, lon?: string): Promise<any> => {
    const params = lat && lon ? { lat, lon } : {};
    const response = await api.get('/weather/', { params });
    return response.data;
  },
};

// Health check
export const healthCheck = async (): Promise<any> => {
  const response = await api.get('/health/');
  return response.data;
};

export default api;
