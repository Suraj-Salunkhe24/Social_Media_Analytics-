'use client';

import { useEffect, useState } from 'react';
import { postAPI, SocialPost } from '@/lib/api';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import PostForm from './PostForm';

export default function PostList() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postAPI.getAll();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postAPI.delete(id);
      setPosts(posts.filter(post => post.id !== id));
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleEdit = (post: SocialPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || post.platform === filterPlatform;
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Social Posts</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Platform Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Platforms</option>
              <option value="twitter">Twitter/X</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No posts found. Create your first post!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              {/* Platform Badge */}
              <div className={`h-2 ${
                post.platform === 'twitter' ? 'bg-blue-400' :
                post.platform === 'instagram' ? 'bg-pink-500' :
                post.platform === 'facebook' ? 'bg-blue-600' :
                'bg-blue-700'
              }`}></div>
              
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{post.title}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' :
                      post.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id!)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span>👍</span>
                    <span className="text-gray-700">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🔄</span>
                    <span className="text-gray-700">{post.shares}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💬</span>
                    <span className="text-gray-700">{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👁️</span>
                    <span className="text-gray-700">{post.impressions}</span>
                  </div>
                </div>

                {/* Engagement Rate */}
                {post.engagement_rate !== undefined && (
                  <div className="text-sm">
                    <span className="text-gray-600">Engagement: </span>
                    <span className="font-semibold text-blue-600">{post.engagement_rate}%</span>
                  </div>
                )}

                {/* Platform & Date */}
                <div className="mt-3 pt-3 border-t text-xs text-gray-500 flex justify-between">
                  <span className="capitalize">{post.platform}</span>
                  <span>{new Date(post.created_at!).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Form Modal */}
      {showForm && (
        <PostForm
          post={editingPost}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
