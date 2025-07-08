# Commit and Deploy Commands

Run these commands to commit your changes and trigger deployment:

```bash
# 1. Add all changes
git add .

# 2. Commit changes
git commit -m "Add live demo link and complete Claude Voices setup"

# 3. Push to GitHub (this triggers GitHub Actions)
git push

# 4. Check deployment status
# Go to: https://github.com/jschwar2552/claude-voices/actions
# Wait for the green checkmark

# 5. View your live site
# Frontend: https://jschwar2552.github.io/claude-voices
# API: https://claude-voices.vercel.app
```

## Troubleshooting

If GitHub Pages doesn't work immediately:
1. Go to Settings → Pages in your GitHub repo
2. Make sure Source is set to "Deploy from a branch"
3. Select "gh-pages" branch and "/" (root)
4. Click Save

The first deployment might take 5-10 minutes to become live.