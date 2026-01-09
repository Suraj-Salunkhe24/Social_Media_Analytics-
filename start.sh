#!/bin/bash

echo "🚀 Social Media Dashboard - Quick Setup Script"
echo "=============================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo "✅ Node.js found: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
python3 -m venv venv
echo "✅ Virtual environment created"

# Activate virtual environment
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

# Install dependencies
pip install -r requirements.txt
echo "✅ Backend dependencies installed"

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env file created (please update with your database credentials)"
else
    echo "⚠️  .env file already exists"
fi

# Run migrations
python manage.py makemigrations
python manage.py migrate
echo "✅ Database migrations completed"

echo ""
echo "💡 To create a superuser, run: python manage.py createsuperuser"
echo ""

cd ..

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend

# Install dependencies
npm install
echo "✅ Frontend dependencies installed"

# Copy environment file
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "✅ .env.local file created"
else
    echo "⚠️  .env.local file already exists"
fi

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update backend/.env with your database credentials"
echo "2. Start backend: cd backend && python manage.py runserver"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Read README.md for detailed instructions"
