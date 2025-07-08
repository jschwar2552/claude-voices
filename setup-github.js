#!/usr/bin/env node

const { execSync } = require('child_process');
const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_NAME = 'claude-voices';
const OWNER = 'jschwar2552';

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN environment variable not set');
  process.exit(1);
}

// Helper function to make GitHub API requests
function githubRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Claude-Voices-Setup',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body || '{}'));
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function setupGitHub() {
  console.log('🚀 Setting up Claude Voices on GitHub...\n');

  try {
    // 1. Check if repo exists
    console.log('1️⃣ Checking if repository exists...');
    try {
      await githubRequest('GET', `/repos/${OWNER}/${REPO_NAME}`);
      console.log('✅ Repository already exists');
    } catch (error) {
      if (error.message.includes('404')) {
        console.log('📝 Creating repository...');
        await githubRequest('POST', '/user/repos', {
          name: REPO_NAME,
          description: 'Showcasing the impact of Claude through user success stories',
          homepage: `https://${OWNER}.github.io/${REPO_NAME}`,
          private: false,
          has_issues: true,
          has_projects: false,
          has_wiki: false
        });
        console.log('✅ Repository created');
      } else {
        throw error;
      }
    }

    // 2. Push code to GitHub
    console.log('\n2️⃣ Pushing code to GitHub...');
    try {
      // Check if remote exists
      execSync('git remote get-url origin', { stdio: 'ignore' });
    } catch {
      // Add remote if it doesn't exist
      execSync(`git remote add origin https://github.com/${OWNER}/${REPO_NAME}.git`);
    }
    
    // Push to main branch
    console.log('Pushing to main branch...');
    execSync('git push -u origin main', { stdio: 'inherit' });
    console.log('✅ Code pushed successfully');

    // 3. Enable GitHub Pages
    console.log('\n3️⃣ Enabling GitHub Pages...');
    try {
      await githubRequest('PUT', `/repos/${OWNER}/${REPO_NAME}/pages`, {
        source: {
          branch: 'gh-pages',
          path: '/'
        }
      });
      console.log('✅ GitHub Pages enabled');
    } catch (error) {
      if (error.message.includes('404')) {
        console.log('⏳ Waiting for gh-pages branch to be created by Actions...');
        console.log('   Please enable Pages manually after the first build completes');
      }
    }

    // 4. Check Actions status
    console.log('\n4️⃣ Checking GitHub Actions...');
    const runs = await githubRequest('GET', `/repos/${OWNER}/${REPO_NAME}/actions/runs`);
    if (runs.workflow_runs && runs.workflow_runs.length > 0) {
      const latestRun = runs.workflow_runs[0];
      console.log(`✅ Latest workflow run: ${latestRun.status}`);
      console.log(`   View at: ${latestRun.html_url}`);
    } else {
      console.log('⏳ No workflow runs yet. Push to trigger deployment.');
    }

    console.log('\n✨ Setup complete!');
    console.log(`\n📍 Your sites will be available at:`);
    console.log(`   Frontend: https://${OWNER}.github.io/${REPO_NAME}`);
    console.log(`   API: https://${REPO_NAME}.vercel.app`);
    console.log(`\n📊 Monitor deployment: https://github.com/${OWNER}/${REPO_NAME}/actions`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupGitHub();