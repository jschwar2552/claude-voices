# Claude Voices Setup Guide

## Prerequisites

Due to a shell environment issue, please manually copy the following directories from `/Users/jason/storycorps-mosaic/` to `/Users/jason/claude-voices/`:

1. `frontend/` - The React application
2. `api/` - Vercel serverless functions
3. `backend/` - Python analysis scripts
4. `mcp-server/` - MCP server for Claude integration

## Step 1: Update Frontend Configuration

After copying, edit `/Users/jason/claude-voices/frontend/package.json`:

```json
{
  "name": "claude-voices-frontend",
  "homepage": "https://jschwar2552.github.io/claude-voices"
}
```

## Step 2: Initialize Git Repository

```bash
cd /Users/jason/claude-voices
git init
git add .
git commit -m "Initial commit: Fork from StoryCorps Mosaic to Claude Voices"
git branch -M main
git remote add origin https://github.com/jschwar2552/claude-voices.git
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Create repository named "claude-voices"
3. Make it public
4. Don't initialize with README (we already have one)

## Step 4: Push to GitHub

```bash
git push -u origin main
```

## Step 5: Deploy Backend to Vercel

```bash
cd /Users/jason/claude-voices
vercel

# When prompted:
# - Link to existing project? No
# - What's your project's name? claude-voices
# - In which directory is your code located? ./
```

After deployment, note your API URL (e.g., `https://claude-voices.vercel.app`)

## Step 6: Configure Vercel Environment

1. Go to https://vercel.com/dashboard
2. Select the "claude-voices" project
3. Go to Settings → Environment Variables
4. Add: `ANTHROPIC_API_KEY` with your API key value

## Step 7: Update API References

Edit `.github/workflows/deploy.yml` and update:
```yaml
REACT_APP_API_URL: https://claude-voices.vercel.app  # Use your actual Vercel URL
```

## Step 8: Enable GitHub Pages

1. Push changes to trigger GitHub Actions
2. Go to repository Settings → Pages
3. Source: Deploy from a branch
4. Branch: gh-pages / (root)
5. Save

## Step 9: Update Frontend API URL

Once you have your Vercel URL, update it in the frontend code:
- Search for `storycorps-mosaic.vercel.app` and replace with your new Vercel URL

## Step 10: Content Updates

The following files need content updates from StoryCorps to Claude Voices:
- `frontend/src/App.js` - Update story content to Claude user stories
- `api/chat.js` - Update prompts to focus on Claude usage patterns
- Update UI text throughout the application

## Deployment URLs

After setup, your project will be available at:
- Frontend: https://jschwar2552.github.io/claude-voices
- API: https://claude-voices.vercel.app

## Testing

1. Test API: `curl https://claude-voices.vercel.app/api/chat -X POST -H "Content-Type: application/json" -d '{"message":"test"}'`
2. Test Frontend: Visit the GitHub Pages URL after deployment completes