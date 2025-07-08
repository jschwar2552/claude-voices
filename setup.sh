#!/bin/bash
# Claude Voices Setup Script

echo "🚀 Setting up Claude Voices..."

# Check if directories need to be copied
if [ ! -d "frontend/src" ]; then
    echo "📁 Copying project files from StoryCorps Mosaic..."
    
    # Copy remaining directories
    cp -r ../storycorps-mosaic/backend .
    cp -r ../storycorps-mosaic/mcp-server .
    
    echo "✅ Files copied successfully"
fi

# Initialize git repository
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Fork from StoryCorps Mosaic to Claude Voices"
    git branch -M main
fi

echo "🔗 Next steps:"
echo "1. Create a new repository on GitHub named 'claude-voices'"
echo "2. Run: git remote add origin https://github.com/jschwar2552/claude-voices.git"
echo "3. Run: git push -u origin main"
echo "4. Deploy to Vercel: vercel"
echo "5. Add ANTHROPIC_API_KEY to Vercel environment variables"
echo "6. Update API URL in .github/workflows/deploy.yml"
echo "7. Enable GitHub Pages in repository settings"

echo ""
echo "📚 See SETUP_GUIDE.md for detailed instructions"