#!/bin/bash
# Deploy Claude Voices

echo "🚀 Deploying Claude Voices..."

# Add all files
git add -A

# Commit with co-author
git commit -m "Complete Claude Voices setup with all components

- Frontend with Claude user stories
- API adapted for success stories  
- Visual connections between users
- Anthropic brand styling

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to trigger GitHub Actions
git push

echo "✅ Pushed to GitHub!"
echo "📊 Check build status at: https://github.com/jschwar2552/claude-voices/actions"
echo "🌐 Site will be live at: https://jschwar2552.github.io/claude-voices"
echo ""
echo "⚠️  Make sure to:"
echo "1. Add ANTHROPIC_API_KEY to Vercel environment variables"
echo "2. Enable GitHub Pages if not already enabled (Settings → Pages → gh-pages branch)"