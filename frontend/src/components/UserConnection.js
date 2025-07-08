import React, { useState, useEffect } from 'react';
import './UserConnection.css';

function UserConnection({ user1, user2, connection }) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Reset reveal state when connection changes
  useEffect(() => {
    setIsRevealed(false);
  }, [user1, user2]);

  return (
    <div className={`user-connection ${isRevealed ? 'revealed' : ''}`}>
      <div className="surface-layer">
        <div className="user-card left">
          <div className="user-header">
            <h3>{user1.name}</h3>
            <div className="user-title">{user1.role}</div>
            <div className="user-company">{user1.company}</div>
            <span className="location">{user1.location}</span>
          </div>
          <div className="profile-tags">
            {user1.profile.map((tag, i) => (
              <div key={i} className="profile-tag">{tag}</div>
            ))}
          </div>
          <div className="user-details">
            {user1.details.map((detail, i) => (
              <p key={i}>{detail}</p>
            ))}
          </div>
        </div>

        <div className="connection-space">
          <div className="connecting-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="user-card right">
          <div className="user-header">
            <h3>{user2.name}</h3>
            <div className="user-title">{user2.role}</div>
            <div className="user-company">{user2.company}</div>
            <span className="location">{user2.location}</span>
          </div>
          <div className="profile-tags">
            {user2.profile.map((tag, i) => (
              <div key={i} className="profile-tag">{tag}</div>
            ))}
          </div>
          <div className="user-details">
            {user2.details.map((detail, i) => (
              <p key={i}>{detail}</p>
            ))}
          </div>
        </div>
      </div>

      <div className={`connection-layer ${isRevealed ? 'visible' : ''}`}>
        <div className="connection-reveal">
          <h2>{connection.sharedExperience}</h2>
          
          {isRevealed && user1.claudeStory && user2.claudeStory && (
            <div className="claude-stories">
              <div className="claude-story">
                <h3>{user1.name}'s Claude Story</h3>
                <p>"{user1.claudeStory}"</p>
              </div>
              <div className="claude-story">
                <h3>{user2.name}'s Claude Story</h3>
                <p>"{user2.claudeStory}"</p>
              </div>
            </div>
          )}
          
          <div className="shared-details">
            {connection.details.map((detail, i) => (
              <p key={i} className="detail-item">{detail}</p>
            ))}
          </div>
          
          {connection.insight && (
            <div className="connection-insight">
              <p>{connection.insight}</p>
            </div>
          )}
          
          <div className="connection-impact">
            {connection.impact}
          </div>
        </div>
      </div>

      <button 
        className="reveal-button"
        onClick={() => setIsRevealed(!isRevealed)}
      >
        {isRevealed ? 'Show Profiles' : 'Reveal Connection'}
      </button>

      <div className="story-links">
        <a 
          href={user1.claudeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="story-link"
        >
          Read {user1.name}'s Full Story →
        </a>
        <a 
          href={user2.claudeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="story-link"
        >
          Read {user2.name}'s Full Story →
        </a>
      </div>
    </div>
  );
}

export default UserConnection;