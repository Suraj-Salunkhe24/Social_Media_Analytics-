'use client';

import { useEffect, useState } from 'react';
import { postAPI, DashboardStats, externalAPI } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MessageSquare, Share2, Eye } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchExternalData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await postAPI.getDashboardStats();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchExternalData = async () => {
    try {
      const [trendsData, weatherData] = await Promise.all([
        externalAPI.getSocialTrends(),
        externalAPI.getWeatherData()
      ]);
      setTrends(trendsData);
      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching external data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-8">No data available</div>;
  }

  const platformData = Object.entries(stats.posts_by_platform).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const statusData = Object.entries(stats.posts_by_status).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Posts"
          value={stats.total_posts}
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Likes"
          value={stats.total_likes}
          icon={<Users className="w-6 h-6" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Shares"
          value={stats.total_shares}
          icon={<Share2 className="w-6 h-6" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Comments"
          value={stats.total_comments}
          icon={<MessageSquare className="w-6 h-6" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Impressions"
          value={stats.total_impressions}
          icon={<Eye className="w-6 h-6" />}
          color="bg-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts by Platform */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Posts by Platform</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Posts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Posts by Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Posts by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* External API Data - Social Trends */}
      {trends && trends.success && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Trending Topics (External API)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trends.trends.map((trend: any) => (
              <div key={trend.id} className="border rounded p-4 hover:shadow-md transition">
                <h4 className="font-medium text-blue-600 mb-2">{trend.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{trend.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Engagement: {trend.engagement}</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{trend.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* External API Data - Weather */}
      {weather && weather.success && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">🌤️ Current Weather (External API)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-90">Temperature</p>
              <p className="text-2xl font-bold">{weather.weather.temperature}°C</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Wind Speed</p>
              <p className="text-2xl font-bold">{weather.weather.windspeed} km/h</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Location</p>
              <p className="text-sm">{weather.location.latitude}, {weather.location.longitude}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Last Updated</p>
              <p className="text-sm">{new Date(weather.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
        <div className="space-y-3">
          {stats.recent_posts.map((post) => (
            <div key={post.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{post.title}</h4>
                  <p className="text-sm text-gray-600">{post.content.substring(0, 100)}...</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  post.status === 'published' ? 'bg-green-100 text-green-800' :
                  post.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status}
                </span>
              </div>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>👍 {post.likes}</span>
                <span>🔄 {post.shares}</span>
                <span>💬 {post.comments}</span>
                <span>👁️ {post.impressions}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
