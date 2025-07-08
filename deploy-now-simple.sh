#!/bin/bash
# Deploy Claude Voices mockup

echo "🚀 Deploying Claude Voices..."

# Remove the problematic workflow
rm -rf .github/workflows

# Stage all changes
git add -A

# Commit
git commit -m "Deploy Claude Voices interview platform

- Complete mockup with Anthropic styling
- 8 sample video interviews
- Search and filter functionality
- Chat interface for discovery
- Simple HTML deployment (no build needed)

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push

echo "✅ Pushed to GitHub!"
echo ""
echo "Now enable GitHub Pages:"
echo "1. Go to: https://github.com/jschwar2552/claude-voices/settings/pages"
echo "2. Under 'Build and deployment' > Source: Deploy from a branch"
echo "3. Branch: main / (root)"
echo "4. Click Save"
echo ""
echo "Your site will be live in ~1 minute at:"
echo "https://jschwar2552.github.io/claude-voices/"