#!/bin/bash
# Simple deployment script

echo "🚀 Deploying simple version..."

# Remove complex files
rm -f index.html
mv index-new.html index.html

# Remove the complex workflow
rm -rf .github/workflows/deploy.yml

# Add and commit
git add -A
git commit -m "Simplify to basic HTML for deployment

- Remove complex React build process
- Use simple HTML that works immediately
- Let GitHub Pages auto-deploy from main branch

🤖 Generated with Claude Code"

# Push
git push

echo "✅ Done! Now go to:"
echo "https://github.com/jschwar2552/claude-voices/settings/pages"
echo ""
echo "Set:"
echo "- Source: Deploy from a branch"
echo "- Branch: main"
echo "- Folder: / (root)"
echo ""
echo "Your site will be live in 1-2 minutes at:"
echo "https://jschwar2552.github.io/claude-voices/"