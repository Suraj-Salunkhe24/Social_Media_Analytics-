# Social Media Dashboard - Full Stack Application

A complete social media management dashboard with CRUD operations, data visualization, and third-party API integration.

## 🎯 Demo Task Features Completed

✅ **Full CRUD Operations** (UI + REST APIs)
- ✅ Create posts (POST)
- ✅ View all posts (GET)
- ✅ View single post (GET)
- ✅ Update posts (PUT/PATCH)
- ✅ Delete posts (DELETE)

✅ **Data Visualization Dashboard**
- ✅ Real-time statistics cards
- ✅ Interactive charts (Bar & Pie charts)
- ✅ Platform-wise analytics
- ✅ Status-wise distribution
- ✅ Engagement metrics

✅ **Third-Party API Integration**
- ✅ Social trends API (JSONPlaceholder for demo)
- ✅ Weather data API (Open-Meteo - real, free API)
- ✅ Both APIs working on live deployment

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.0
- **API**: Django REST Framework
- **Database**: PostgreSQL (Supabase compatible)
- **Server**: Gunicorn
- **Deployment**: Railway/Render

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📁 Project Structure

```
social-media-dashboard/
├── backend/                    # Django Backend
│   ├── social_dashboard/      # Main Django project
│   │   ├── settings.py        # Django settings
│   │   ├── urls.py           # URL routing
│   │   └── wsgi.py           # WSGI config
│   ├── posts/                 # Posts app
│   │   ├── models.py         # Database models
│   │   ├── views.py          # API views (CRUD)
│   │   ├── serializers.py    # DRF serializers
│   │   ├── urls.py           # App URLs
│   │   └── admin.py          # Admin interface
│   ├── manage.py             # Django CLI
│   ├── requirements.txt      # Python dependencies
│   ├── Procfile             # Deployment config
│   └── .env.example         # Environment variables template
│
└── frontend/                  # Next.js Frontend
    ├── app/                  # Next.js 14 app directory
    │   ├── page.tsx         # Main page with tabs
    │   ├── layout.tsx       # Root layout
    │   └── globals.css      # Global styles
    ├── components/           # React components
    │   ├── Dashboard.tsx    # Analytics dashboard
    │   ├── PostList.tsx     # Posts list with CRUD
    │   └── PostForm.tsx     # Create/Edit form
    ├── lib/
    │   └── api.ts          # API client & types
    ├── package.json        # Node dependencies
    ├── next.config.js      # Next.js config
    ├── tailwind.config.js  # Tailwind config
    └── .env.local.example  # Environment variables template
```

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL database (or Supabase account)
- Git

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Configure Database**

For **local PostgreSQL**:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/social_dashboard
```

For **Supabase**:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

6. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

7. **Create superuser (optional)**
```bash
python manage.py createsuperuser
```

8. **Run development server**
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
# Edit .env.local if needed
```

Default configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. **Run development server**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 📊 API Endpoints

### Posts CRUD
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create new post
- `GET /api/posts/{id}/` - Get single post
- `PUT /api/posts/{id}/` - Full update post
- `PATCH /api/posts/{id}/` - Partial update post
- `DELETE /api/posts/{id}/` - Delete post

### Dashboard & Analytics
- `GET /api/posts/dashboard_stats/` - Get dashboard statistics
- `GET /api/analytics/` - Get analytics data
- `GET /api/analytics/weekly_report/` - Get weekly report

### Third-Party APIs
- `GET /api/social-trends/` - Fetch trending topics (JSONPlaceholder API)
- `GET /api/weather/` - Fetch weather data (Open-Meteo API)
- `GET /api/health/` - Health check endpoint

## 🌐 Deployment Guide

### Backend Deployment (Railway/Render)

#### Option 1: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and initialize**
```bash
railway login
railway init
```

3. **Add PostgreSQL**
```bash
railway add --database postgresql
```

4. **Set environment variables**
```bash
railway variables set SECRET_KEY="your-secret-key"
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS="your-app.railway.app"
```

5. **Deploy**
```bash
railway up
```

#### Option 2: Render

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn social_dashboard.wsgi`
5. Add PostgreSQL database
6. Set environment variables in Render dashboard

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Set environment variables in Vercel dashboard**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

Or use the Vercel web interface:
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## 🧪 Testing the Application

### Testing CRUD Operations

1. **Create Post**
   - Click "Create Post" button
   - Fill in the form
   - Submit

2. **Read Posts**
   - View all posts in the Posts tab
   - Use filters to narrow results
   - Search by title/content

3. **Update Post**
   - Click edit icon on any post
   - Modify fields
   - Save changes

4. **Delete Post**
   - Click delete icon
   - Confirm deletion

### Testing API Directly

```bash
# Create post
curl -X POST http://localhost:8000/api/posts/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "Testing CRUD operations",
    "platform": "twitter",
    "status": "published",
    "likes": 100,
    "shares": 50,
    "comments": 25,
    "impressions": 1000
  }'

# Get all posts
curl http://localhost:8000/api/posts/

# Update post (replace {id} with actual post ID)
curl -X PUT http://localhost:8000/api/posts/{id}/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Post",
    "content": "Updated content",
    "platform": "twitter",
    "status": "published",
    "likes": 150,
    "shares": 75,
    "comments": 30,
    "impressions": 1500
  }'

# Delete post
curl -X DELETE http://localhost:8000/api/posts/{id}/

# Get dashboard stats
curl http://localhost:8000/api/posts/dashboard_stats/

# Test external APIs
curl http://localhost:8000/api/social-trends/
curl http://localhost:8000/api/weather/
```

### Testing Third-Party APIs

The application integrates two external APIs:

1. **Social Trends API** (JSONPlaceholder)
   - Fetches mock social media posts
   - Displays in dashboard

2. **Weather API** (Open-Meteo)
   - Fetches real weather data
   - No API key required
   - Works on live deployment

## 📝 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,.railway.app,.render.com
DATABASE_URL=postgresql://user:password@host:port/database
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🎥 Screen Recording Guide

Record a 3-5 minute video showing:

1. **Application Overview** (30 seconds)
   - Show dashboard with statistics
   - Show data visualization charts

2. **CRUD Operations** (2 minutes)
   - Create a new post (POST)
   - View post list (GET)
   - Edit a post (PUT/PATCH)
   - Delete a post (DELETE)
   - Show confirmation messages

3. **Data Visualization** (1 minute)
   - Show how charts update after CRUD operations
   - Demonstrate filtering and search

4. **Third-Party API Integration** (1 minute)
   - Show trending topics from external API
   - Show weather data from external API
   - Demonstrate real-time data fetching

## 🔧 Troubleshooting

### Backend Issues

**Database Connection Error**
```bash
# Check your DATABASE_URL
# For local PostgreSQL, create database first:
createdb social_dashboard
```

**Migration Errors**
```bash
python manage.py makemigrations --empty posts
python manage.py migrate --run-syncdb
```

**CORS Errors**
- Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Check `ALLOWED_HOSTS` includes your domain

### Frontend Issues

**API Connection Failed**
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check backend is running
- Check CORS settings

**Build Errors**
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)

## 🎓 What You've Built

This project demonstrates:
- ✅ Full-stack development skills
- ✅ RESTful API design
- ✅ Database modeling and relationships
- ✅ Modern React with TypeScript
- ✅ Responsive UI design
- ✅ Data visualization
- ✅ Third-party API integration
- ✅ Deployment and DevOps basics

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the error logs
3. Verify all environment variables
4. Ensure all dependencies are installed

## 📄 License

This project is created for the Social Booster Media demo task.

---

**Created by**: [Your Name]
**Date**: January 2026
**Company**: Social Booster Media
**Position**: Full Stack Developer Role
