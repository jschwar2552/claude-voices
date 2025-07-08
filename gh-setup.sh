#!/bin/bash
# GitHub setup using gh CLI

echo "🚀 Setting up Claude Voices with GitHub CLI..."

cd /Users/jason/claude-voices

# 1. Create repository if it doesn't exist
echo "1️⃣ Creating GitHub repository..."
gh repo create claude-voices --public --description "Showcasing the impact of Claude through user success stories" --homepage "https://jschwar2552.github.io/claude-voices" --source . --remote origin --push || echo "Repository may already exist"

# 2. Make sure we're on main branch
git branch -M main

# 3. Push all changes
echo "2️⃣ Pushing to GitHub..."
git push -u origin main || git push

# 4. Check workflow status
echo "3️⃣ Checking GitHub Actions..."
gh run list --limit 1

# 5. Try to enable Pages (might fail if gh-pages branch doesn't exist yet)
echo "4️⃣ Attempting to enable GitHub Pages..."
gh api repos/jschwar2552/claude-voices/pages \
  --method PUT \
  --field source[branch]=gh-pages \
  --field source[path]=/ \
  2>/dev/null && echo "✅ GitHub Pages enabled" || echo "⏳ Enable Pages after first build creates gh-pages branch"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Check build status: https://github.com/jschwar2552/claude-voices/actions"
echo "🌐 Site will be live at: https://jschwar2552.github.io/claude-voices"
echo ""
echo "Next steps:"
echo "1. Wait for GitHub Actions to complete the first build"
echo "2. If Pages isn't enabled, go to Settings → Pages → Deploy from gh-pages"
echo "3. Make sure ANTHROPIC_API_KEY is set in Vercel"