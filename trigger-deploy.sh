#!/bin/bash
# Trigger GitHub Actions deployment

echo "🚀 Triggering deployment..."

# Add the workflow changes
git add .github/workflows/deploy.yml

# Commit to trigger workflow
git commit -m "Update workflow triggers to ensure deployment runs

- Add pull_request trigger
- Ensure workflow runs on push to main
- Enable manual workflow dispatch

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push

echo "✅ Pushed! Check workflow at: https://github.com/jschwar2552/claude-voices/actions"

# List running workflows
echo ""
echo "Current workflows:"
gh run list --limit 5