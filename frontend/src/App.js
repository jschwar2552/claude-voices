import React, { useState } from 'react';
import './App-new.css';
import UserConnection from './components/UserConnection';

function App() {
  const [mode, setMode] = useState('home'); // 'home', 'explore', or 'connections'
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Welcome to Claude Voices. I help you discover how different professionals use Claude to transform their work. Ask me about any industry, role, or use case.",
      suggestions: [
        "Show me how designers use Claude",
        "What do engineers build with Claude?", 
        "Marketing success stories",
        "Research and academic uses",
        "Legal and compliance applications",
        "Creative writing examples",
        "Data analysis workflows",
        "Team collaboration patterns",
        "Productivity improvements"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      // Call our API
      const apiUrl = process.env.REACT_APP_API_URL || 'https://claude-voices.vercel.app';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add bot response with analysis
      setMessages(prev => [...prev, {
        type: 'bot',
        text: data.response.message,
        unityScore: data.response.unityScore,
        stories: data.response.preview,
        analysis: data.response.analysis,
        followUp: data.response.followUp,
        suggestions: generateFollowUpSuggestions(text)
      }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: `Sorry, I encountered an error: ${error.message}`,
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (suggestion) => {
    sendMessage(suggestion);
  };

  // User connection stories for visual display
  const [currentConnection, setCurrentConnection] = useState(null);
  const [previousConnections, setPreviousConnections] = useState([]);
  
  const userConnections = [
    {
      user1: {
        name: "Sarah Chen",
        role: "Product Designer",
        company: "DoorDash",
        location: "San Francisco, CA",
        profile: ["5 years experience", "Mobile-first design", "User research"],
        details: [
          "Designs delivery experiences for millions",
          "Focuses on driver and merchant tools",
          "Previously at Airbnb",
          "Stanford HCI graduate"
        ],
        claudeStory: "I was stuck on a complex driver earnings dashboard. I described the problem to Claude, and it helped me think through the information hierarchy. Then Claude Code generated a React prototype I could test with drivers immediately. What would have taken a week of iterations happened in an afternoon.",
        claudeUrl: "https://claude.ai/stories/sarah-chen-design"
      },
      user2: {
        name: "Marcus Rodriguez",
        role: "Backend Engineer",
        company: "Stripe",
        location: "New York, NY",
        profile: ["8 years experience", "Distributed systems", "Payment infrastructure"],
        details: [
          "Builds payment processing systems",
          "Specializes in fraud detection",
          "MIT Computer Science",
          "Open source contributor"
        ],
        claudeStory: "I needed to refactor a legacy payment validation system. Claude helped me understand the existing code's intent, suggested a cleaner architecture, and even caught edge cases I hadn't considered. It's like pair programming with someone who's seen every codebase.",
        claudeUrl: "https://claude.ai/stories/marcus-rodriguez-engineering"
      },
      connection: {
        sharedExperience: "Both Use Claude to Accelerate Complex Technical Work",
        details: [
          "Sarah uses Claude to rapidly prototype UI solutions",
          "Marcus uses Claude to refactor backend systems",
          "Both reduced project timelines from weeks to days",
          "Both cite Claude as a 'thought partner' not just a tool"
        ],
        insight: "Whether designing interfaces or architecting systems, professionals use Claude to break through complexity and ship faster",
        impact: "10x faster iteration cycles across completely different disciplines"
      }
    },
    {
      user1: {
        name: "Dr. Emily Watson",
        role: "Research Scientist",
        company: "Stanford Medical",
        location: "Palo Alto, CA",
        profile: ["PhD Neuroscience", "Published researcher", "Grant writer"],
        details: [
          "Studies neurodegenerative diseases",
          "15+ peer-reviewed publications",
          "NIH grant recipient",
          "Collaborates globally"
        ],
        claudeStory: "I use Claude to analyze research papers and find connections between studies that I might have missed. Last month, it helped me identify a pattern across three unrelated papers that led to a breakthrough in my Alzheimer's research. It's like having a brilliant postdoc who's read everything.",
        claudeUrl: "https://claude.ai/stories/emily-watson-research"
      },
      user2: {
        name: "Alex Thompson",
        role: "Marketing Manager",
        company: "B2B SaaS Startup",
        location: "Austin, TX",
        profile: ["Growth marketing", "Content strategy", "Data-driven"],
        details: [
          "Manages $2M marketing budget",
          "Grew leads by 300% YoY",
          "Former journalist",
          "Self-taught marketer"
        ],
        claudeStory: "I was struggling with our positioning for enterprise clients. I fed Claude our customer interviews and competitor analysis. It helped me find a unique angle we'd overlooked - our speed of implementation. That insight became our entire Q4 campaign, our best performing ever.",
        claudeUrl: "https://claude.ai/stories/alex-thompson-marketing"
      },
      connection: {
        sharedExperience: "Both Use Claude to Find Hidden Patterns in Complex Information",
        details: [
          "Emily finds patterns across scientific literature",
          "Alex finds patterns in market research and customer data",
          "Both made discoveries that changed their approach",
          "Both describe Claude as revealing 'what they couldn't see'"
        ],
        insight: "From academic research to market analysis, Claude excels at surfacing insights hidden in information overload",
        impact: "Breakthrough discoveries by connecting dots humans miss"
      }
    },
    {
      user1: {
        name: "James Liu",
        role: "Corporate Lawyer",
        company: "Tech Industry",
        location: "Seattle, WA",
        profile: ["Contract specialist", "M&A experience", "Compliance expert"],
        details: [
          "Handles tech acquisitions",
          "10+ years experience",
          "Harvard Law graduate",
          "Startup advisor"
        ],
        claudeStory: "I use Claude to review contracts and identify potential issues. It catches nuances in language that could create problems months later. On a recent acquisition, Claude spotted a IP transfer clause issue that saved us from a major headache.",
        claudeUrl: "https://claude.ai/stories/james-liu-legal"
      },
      user2: {
        name: "Maria Santos",
        role: "Fiction Writer",
        company: "Freelance",
        location: "Portland, OR",
        profile: ["Published author", "Creative writing MFA", "Workshop leader"],
        details: [
          "Three published novels",
          "Iowa Writers' Workshop",
          "Teaches creative writing",
          "Working on screenplay"
        ],
        claudeStory: "I was stuck on my protagonist's voice for months. I described the character to Claude and we explored different perspectives together. It helped me find an authentic voice that unlocked the entire narrative. My editor said it was my best character work yet.",
        claudeUrl: "https://claude.ai/stories/maria-santos-writing"
      },
      connection: {
        sharedExperience: "Both Use Claude for Nuanced Language Work",
        details: [
          "James uses Claude to spot subtle legal language issues",
          "Maria uses Claude to develop authentic character voices",
          "Both work with the nuances of written language",
          "Both credit Claude with catching what they missed"
        ],
        insight: "From legal contracts to literary fiction, Claude understands the subtleties of language that make all the difference",
        impact: "Precision in language across vastly different fields"
      }
    }
  ];
  
  // Function to get a random connection
  const getRandomConnection = () => {
    const availableConnections = userConnections.filter(
      conn => !previousConnections.includes(conn)
    );
    
    if (availableConnections.length === 0) {
      setPreviousConnections([]);
      return userConnections[Math.floor(Math.random() * userConnections.length)];
    }
    
    const randomIndex = Math.floor(Math.random() * availableConnections.length);
    return availableConnections[randomIndex];
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Claude Voices</h1>
        <p>Real stories from Claude users transforming their work</p>
        <div className="mode-toggle">
          <button 
            className={mode === 'home' ? 'active' : ''}
            onClick={() => setMode('home')}
          >
            About
          </button>
          <button 
            className={mode === 'explore' ? 'active' : ''}
            onClick={() => setMode('explore')}
          >
            Explore
          </button>
          <button 
            className={mode === 'connections' ? 'active' : ''}
            onClick={() => setMode('connections')}
          >
            Connections
          </button>
        </div>
      </header>

      {mode === 'home' ? (
        <div className="home-container">
          <section className="hero">
            <h2>Every professional has a Claude story. Every story shows a new possibility.</h2>
            <p className="hero-subtitle">
              Discover how people across industries use Claude to amplify their capabilities 
              and achieve what wasn't possible before.
            </p>
          </section>

          <section className="about-section">
            <div className="content-block">
              <h3>What is Claude?</h3>
              <p>
                Claude is an AI assistant created by Anthropic that helps professionals 
                think more clearly, work more efficiently, and solve complex problems. 
                From writing and analysis to coding and research, Claude adapts to how you work.
              </p>
              <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" 
                className="learn-more">
                Try Claude →
              </a>
            </div>

            <div className="content-block">
              <h3>Why Claude Voices?</h3>
              <p>
                Behind every Claude interaction is a human with a goal. A designer trying 
                to solve a UX challenge. An engineer debugging complex code. A researcher 
                connecting disparate studies. Claude Voices shares these stories to inspire 
                your own journey.
              </p>
              <p>
                These aren't just testimonials—they're blueprints for transformation.
              </p>
            </div>

            <div className="content-block">
              <h3>Featured Use Cases</h3>
              <div className="features-grid">
                <div className="feature">
                  <h4>Claude Code</h4>
                  <p>Engineers ship features 2-3x faster with intelligent code assistance</p>
                </div>
                <div className="feature">
                  <h4>Research & Analysis</h4>
                  <p>Researchers find patterns across thousands of documents instantly</p>
                </div>
                <div className="feature">
                  <h4>Creative Work</h4>
                  <p>Writers and designers break through creative blocks with AI collaboration</p>
                </div>
              </div>
            </div>

            <div className="content-block future">
              <h3>Join the Community</h3>
              <p>
                Claude users are pioneering new ways of working with AI:
              </p>
              <ul>
                <li>
                  <strong>Share your story</strong> and inspire others with your Claude journey
                </li>
                <li>
                  <strong>Learn from peers</strong> who've solved similar challenges
                </li>
                <li>
                  <strong>Discover new techniques</strong> from unexpected industries
                </li>
                <li>
                  <strong>Shape the future</strong> of human-AI collaboration
                </li>
              </ul>
              <p className="vision">
                Our vision: Build a community where professionals learn from each other's 
                AI breakthroughs, accelerating innovation across all fields.
              </p>
            </div>
          </section>

          <section className="cta-section">
            <h3>Ready to explore Claude success stories?</h3>
            <div className="cta-buttons">
              <button onClick={() => setMode('explore')} className="cta-primary">
                Explore Stories
              </button>
              <button onClick={() => setMode('connections')} className="cta-secondary">
                See Connections
              </button>
            </div>
          </section>
        </div>
      ) : mode === 'explore' ? (
        <div className="chat-container">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              {msg.type === 'bot' && <span className="bot-icon">CV</span>}
              
              <div className="message-content">
                <p>{msg.text}</p>
                
                {msg.unityScore && msg.unityScore > 0 && msg.unityScore <= 1 && (
                  <div className="unity-score">
                    <span>Pattern Strength: </span>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{width: `${Math.min(100, msg.unityScore * 100)}%`}}
                      />
                    </div>
                    <span>{Math.min(100, Math.round(msg.unityScore * 100))}%</span>
                  </div>
                )}
                
                {msg.analysis && (
                  <div className="analysis-section">
                    <div className="analysis-grid">
                      <div className="analysis-item">
                        <h4>Common Patterns</h4>
                        <ul>
                          {msg.analysis.commonPatterns.map((pattern, i) => (
                            <li key={i}>{pattern}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="analysis-item">
                        <h4>Diverse Applications</h4>
                        <ul>
                          {msg.analysis.diverseApplications.map((app, i) => (
                            <li key={i}>{app}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="analysis-item">
                        <h4>Impact Themes</h4>
                        <ul>
                          {msg.analysis.impactThemes.map((theme, i) => (
                            <li key={i}>{theme}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {msg.stories && (
                  <div className="story-previews">
                    <div className="stories-header">
                      <h4>Featured Users</h4>
                      <p className="stories-context">Click to read their full Claude journey</p>
                    </div>
                    {msg.stories.map((story, i) => (
                      <div 
                        key={i} 
                        className="story-preview clickable"
                        onClick={() => window.open(story.url, '_blank')}
                        title="Click to read full story"
                      >
                        <div className="story-number">{i + 1}</div>
                        <div className="story-content">
                          <h4>{story.name} - {story.role}</h4>
                          <div className="story-meta">
                            <span className="company">{story.company}</span>
                          </div>
                          <p className="story-snippet">{story.snippet}</p>
                          <p className="story-impact">
                            <strong>Impact:</strong> {story.impact}
                          </p>
                          <div className="story-actions">
                            <span className="read-more">Read full story →</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {msg.suggestions && (
                  <div className="suggestions">
                    {msg.suggestions.map((sug, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSuggestion(sug)}
                        className="suggestion-btn"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
                
                {msg.followUp && idx === messages.length - 1 && (
                  <p className="follow-up">{msg.followUp}</p>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message bot">
              <span className="bot-icon">CV</span>
              <div className="loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Claude use cases, industries, or success stories..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
      ) : (
        <div className="connections-container">
          {!currentConnection ? (
            <div className="matchmaking-intro">
              <h2>Discover unexpected connections between Claude users</h2>
              <p>See how professionals in completely different fields use Claude 
                 in surprisingly similar ways.</p>
              <button 
                className="find-connection-btn"
                onClick={() => {
                  const connection = getRandomConnection();
                  setCurrentConnection(connection);
                  setPreviousConnections(prev => [...prev, connection]);
                }}
              >
                Show Me a Connection
              </button>
            </div>
          ) : (
            <>
              <div className="connection-header">
                <p className="connection-intro">
                  Two professionals, different worlds, one powerful pattern...
                </p>
              </div>
              
              <UserConnection 
                key={Math.random()}
                user1={currentConnection.user1}
                user2={currentConnection.user2}
                connection={currentConnection.connection}
              />
              
              <div className="connection-actions">
                <button 
                  className="new-connection-btn"
                  onClick={() => {
                    const connection = getRandomConnection();
                    setCurrentConnection(connection);
                    setPreviousConnections(prev => [...prev, connection]);
                  }}
                >
                  Show Another Connection
                </button>
                <button 
                  className="back-btn"
                  onClick={() => setMode('explore')}
                >
                  Explore Stories
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Generate contextual follow-up suggestions
function generateFollowUpSuggestions(query) {
  const theme = query.toLowerCase();
  const basePrompts = [
    "Show me similar use cases",
    "How do teams use Claude?",
    "What about other industries?"
  ];
  
  if (theme.includes('design') || theme.includes('ux')) {
    return [...basePrompts, "Design system creation", "User research analysis", "Prototype generation"];
  } else if (theme.includes('engineer') || theme.includes('code')) {
    return [...basePrompts, "Debugging workflows", "Architecture decisions", "Code review examples"];
  } else if (theme.includes('market') || theme.includes('growth')) {
    return [...basePrompts, "Campaign optimization", "Customer research", "Content strategy"];
  } else if (theme.includes('research') || theme.includes('academic')) {
    return [...basePrompts, "Literature reviews", "Grant writing", "Data analysis"];
  } else if (theme.includes('legal') || theme.includes('compliance')) {
    return [...basePrompts, "Contract analysis", "Risk assessment", "Policy review"];
  } else {
    return [
      "Technical use cases",
      "Creative applications", 
      "Business workflows",
      "Team collaboration",
      "Productivity gains"
    ];
  }
}

export default App;