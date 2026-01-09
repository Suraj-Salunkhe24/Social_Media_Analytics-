'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import PostList from '@/components/PostList';
import { BarChart3, FileText, Home } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Social Media Dashboard</h1>
                <p className="text-sm text-gray-600">Manage and analyze your social presence</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition ${
                activeTab === 'posts'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              Posts
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? <Dashboard /> : <PostList />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Social Media Dashboard © 2026 | Built with Next.js, Django & PostgreSQL</p>
            <p className="mt-1">
              Full-stack demo with CRUD operations, data visualization & third-party API integration
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
