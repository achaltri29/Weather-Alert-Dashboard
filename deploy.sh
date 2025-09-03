#!/bin/bash

# Smart Weather & Alert Dashboard Deployment Script
echo "🚀 Starting deployment process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if we have changes to commit
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Deploy: Fix CORS and API key handling for production"
else
    echo "✅ No changes to commit"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub"
    echo ""
    echo "🌍 Next Steps:"
    echo "1. Backend will auto-deploy on Render"
    echo "2. Frontend will auto-deploy on Netlify"
    echo ""
    echo "🔗 Your deployment URLs:"
    echo "Backend: https://weather-alert-backend.onrender.com"
    echo "Frontend: https://your-site-name.netlify.app"
    echo ""
    echo "🧪 Test your deployment:"
    echo "curl https://weather-alert-backend.onrender.com/api/health"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi

echo "🎉 Deployment process completed!"
