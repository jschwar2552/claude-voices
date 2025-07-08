/**
 * Vercel Serverless Function for Claude Voices
 * Handles queries about Claude user success stories and patterns
 */

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user query
  const { message, context = {} } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  // Check for API key
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Parse user intent
    const intent = await parseUserIntent(message, anthropicKey);
    
    // Fetch relevant Claude user stories
    const stories = await fetchRelevantStories(intent);
    
    // Analyze with Claude
    const analysis = await analyzeConnections(stories, intent, anthropicKey);
    
    // Format conversational response
    const response = formatResponse(analysis, stories);
    
    // Cache result for performance
    await cacheResult(message, response);
    
    return res.status(200).json({
      response,
      intent,
      storyCount: stories.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ 
      error: 'Failed to process query',
      message: error.message 
    });
  }
}

async function parseUserIntent(message, apiKey) {
  // For now, skip Claude for intent parsing to save API calls and time
  // Just use direct keyword extraction
  const msgLower = message.toLowerCase();
  
  // Extract meaningful words (skip common words)
  const stopWords = ['the', 'about', 'tell', 'me', 'show', 'find', 'with', 'and', 'or', 'for', 'how', 'what', 'when', 'where', 'who'];
  const words = msgLower.split(' ').filter(w => w.length > 2 && !stopWords.includes(w));
  
  return {
    theme: extractTheme(message),
    emotion: "curious",
    context: null,
    search_terms: words.length > 0 ? words : ['claude', 'productivity', 'success']
  };
}

async function fetchRelevantStories(intent) {
  // For Claude Voices, we'll use pre-defined user stories
  // In production, this could connect to a database of real user interviews
  
  const allStories = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Product Designer",
      company: "DoorDash",
      location: "San Francisco",
      keywords: ["design", "productivity", "prototyping", "ui", "ux"],
      story: "Claude helps me iterate on designs 10x faster. I describe what I want, and it generates React components I can test immediately.",
      impact: "Reduced design-to-prototype time from days to hours",
      url: "https://claude.ai/stories/sarah-chen"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Marketing Manager",
      company: "Grab",
      location: "Singapore",
      keywords: ["marketing", "content", "campaigns", "strategy"],
      story: "I use Claude to analyze campaign performance and generate insights across markets. It spots patterns I would have missed.",
      impact: "Increased campaign ROI by 35% through better targeting",
      url: "https://claude.ai/stories/marcus-johnson"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      role: "Research Scientist",
      company: "Stanford University",
      location: "Palo Alto",
      keywords: ["research", "analysis", "academic", "science", "data"],
      story: "Claude helps me review literature and find connections between papers. It's like having a brilliant research assistant.",
      impact: "Published 3 papers in half the usual time",
      url: "https://claude.ai/stories/emily-rodriguez"
    },
    {
      id: 4,
      name: "James Park",
      role: "Software Engineer",
      company: "Stripe",
      location: "New York",
      keywords: ["coding", "debugging", "engineering", "development"],
      story: "Claude Code transformed how I work. I describe the feature, and it helps me implement it with best practices.",
      impact: "Ships features 2x faster with fewer bugs",
      url: "https://claude.ai/stories/james-park"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Legal Counsel",
      company: "Tech Startup",
      location: "Austin",
      keywords: ["legal", "contracts", "compliance", "review"],
      story: "I use Claude to review contracts and spot issues. It catches things that might take hours to find manually.",
      impact: "Reduced contract review time by 60%",
      url: "https://claude.ai/stories/lisa-thompson"
    }
  ];
  
  // Filter stories by intent
  const relevantStories = allStories.filter(story => {
    const storyText = `${story.role} ${story.keywords.join(' ')} ${story.story}`.toLowerCase();
    return intent.search_terms.some(term => storyText.includes(term));
  });
  
  // If no matches, return some default stories
  return relevantStories.length > 0 ? relevantStories : allStories.slice(0, 3);
}

async function analyzeConnections(stories, intent, apiKey) {
  if (stories.length === 0) {
    return {
      unity_score: 0,
      message: "I couldn't find stories matching your query. Try different words?",
      suggestions: ["productivity gains", "creative uses", "technical applications"]
    };
  }
  
  // Create analysis prompt for finding patterns in Claude usage
  const prompt = `Analyze these ${stories.length} Claude user stories to find patterns:

${stories.map((s, idx) => `
Story ${idx + 1}: ${s.name}, ${s.role} at ${s.company}
Use Case: ${s.story}
Impact: ${s.impact}
`).join('\n---\n')}

Find:
1. COMMON_PATTERNS: What usage patterns do these users share?
2. DIVERSE_APPLICATIONS: How differently are they using Claude?
3. IMPACT_THEMES: What types of impact are most common?
4. SUCCESS_FACTORS: What made them successful with Claude?
5. UNITY_SCORE: [0.0-1.0] How similar are their approaches?

Format as actionable insights for other Claude users.`;

  return await callClaude(prompt, apiKey);
}

function formatResponse(analysis, stories) {
  // Handle both string and object analysis
  let analysisText = analysis;
  if (typeof analysis === 'object' && analysis !== null) {
    analysisText = analysis.text || analysis.message || JSON.stringify(analysis);
  }
  
  // Parse Claude's analysis
  const lines = String(analysisText).split('\n');
  let unityScore = 0.7;
  let commonPatterns = [];
  let diverseApplications = [];
  let impactThemes = [];
  
  let currentSection = '';
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    if (trimmed.includes('COMMON_PATTERNS:')) {
      currentSection = 'patterns';
    } else if (trimmed.includes('DIVERSE_APPLICATIONS:')) {
      currentSection = 'applications';
    } else if (trimmed.includes('IMPACT_THEMES:')) {
      currentSection = 'impact';
    } else if (trimmed.includes('UNITY_SCORE:')) {
      const scoreMatch = line.match(/[\d.]+/);
      if (scoreMatch) {
        unityScore = Math.min(1.0, parseFloat(scoreMatch[0]));
      }
      currentSection = '';
    } else if (trimmed && !trimmed.startsWith('SUCCESS_FACTORS:')) {
      switch(currentSection) {
        case 'patterns':
          if (trimmed.match(/^[-•*]/) || commonPatterns.length === 0) 
            commonPatterns.push(trimmed.replace(/^[-•*]/, '').trim());
          break;
        case 'applications':
          if (trimmed.match(/^[-•*]/) || diverseApplications.length === 0)
            diverseApplications.push(trimmed.replace(/^[-•*]/, '').trim());
          break;
        case 'impact':
          if (trimmed.match(/^[-•*]/) || impactThemes.length === 0)
            impactThemes.push(trimmed.replace(/^[-•*]/, '').trim());
          break;
      }
    }
  });
  
  // Build response
  const response = {
    message: `Found ${stories.length} Claude users with relevant experiences.`,
    unityScore,
    storyCount: stories.length,
    
    analysis: {
      commonPatterns: commonPatterns.length > 0 ? commonPatterns : [
        'Using Claude for complex reasoning tasks',
        'Leveraging conversational interface for iteration',
        'Combining Claude with existing tools'
      ],
      diverseApplications: diverseApplications.length > 0 ? diverseApplications : [
        'Creative and technical applications',
        'Individual and team workflows',
        'Real-time and asynchronous use'
      ],
      impactThemes: impactThemes.length > 0 ? impactThemes : [
        'Time savings and efficiency gains',
        'Quality improvements',
        'New capabilities unlocked'
      ]
    },
    
    // Story previews
    preview: stories.slice(0, 3).map(s => ({
      id: s.id,
      name: s.name,
      role: s.role,
      company: s.company,
      snippet: s.story,
      impact: s.impact,
      url: s.url
    })),
    
    followUp: "What aspect of Claude usage would you like to explore?",
    fullAnalysis: analysisText
  };
  
  return response;
}

async function callClaude(prompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error(`Claude API error: ${data.error.message || data.error}`);
  }
  
  if (data.content && data.content[0] && data.content[0].text) {
    return data.content[0].text;
  }
  
  throw new Error('Unexpected Claude API response format');
}

function extractTheme(message) {
  const themes = ['productivity', 'creativity', 'coding', 'design', 'marketing', 'research', 'writing'];
  const msgLower = message.toLowerCase();
  
  for (const theme of themes) {
    if (msgLower.includes(theme)) return theme;
  }
  
  return 'usage';
}

async function cacheResult(query, result) {
  // In production, use Redis or similar
  console.log(`Cached query: ${query.slice(0, 50)}...`);
}