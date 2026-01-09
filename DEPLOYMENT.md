# Deployment Guide

## Quick Deploy to Railway + Vercel

### 1. Database (Supabase)
1. Create account at supabase.com
2. New Project → Save password
3. Get connection string from Settings → Database

### 2. Backend (Railway)
1. Push code to GitHub
2. railway.app → New Project → Deploy from GitHub
3. Add environment variables:
   - SECRET_KEY
   - DATABASE_URL (from Supabase)
   - ALLOWED_HOSTS
   - CORS_ALLOWED_ORIGINS
4. Deploy and copy URL

### 3. Frontend (Vercel)
1. vercel.com → Import Project
2. Select GitHub repo
3. Root directory: `frontend`
4. Add environment variable:
   - NEXT_PUBLIC_API_URL (Railway backend URL)
5. Deploy

Done! Your app is live.
