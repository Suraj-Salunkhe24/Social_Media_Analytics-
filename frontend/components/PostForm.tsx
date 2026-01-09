'use client';

import { useState, useEffect } from 'react';
import { postAPI, SocialPost } from '@/lib/api';
import { X } from 'lucide-react';

interface PostFormProps {
  post: SocialPost | null;
  onClose: () => void;
}

export default function PostForm({ post, onClose }: PostFormProps) {
  const [formData, setFormData] = useState<Omit<SocialPost, 'id'>>({
    title: '',
    content: '',
    platform: 'twitter',
    status: 'draft',
    likes: 0,
    shares: 0,
    comments: 0,
    impressions: 0,
    scheduled_time: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        platform: post.platform,
        status: post.status,
        likes: post.likes,
        shares: post.shares,
        comments: post.comments,
        impressions: post.impressions,
        scheduled_time: post.scheduled_time || null,
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (post?.id) {
        // Update existing post (PUT)
        await postAPI.update(post.id, { ...formData, id: post.id });
        alert('Post updated successfully!');
      } else {
        // Create new post (POST)
        await postAPI.create(formData);
        alert('Post created successfully!');
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error saving post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'likes' || name === 'shares' || name === 'comments' || name === 'impressions'
        ? parseInt(value) || 0
        : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {post ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter post title"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter post content"
            />
          </div>

          {/* Platform and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform *
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="twitter">Twitter/X</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Likes
              </label>
              <input
                type="number"
                name="likes"
                value={formData.likes}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shares
              </label>
              <input
                type="number"
                name="shares"
                value={formData.shares}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>
              <input
                type="number"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Impressions
              </label>
              <input
                type="number"
                name="impressions"
                value={formData.impressions}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Scheduled Time */}
          {formData.status === 'scheduled' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Time
              </label>
              <input
                type="datetime-local"
                name="scheduled_time"
                value={formData.scheduled_time || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
