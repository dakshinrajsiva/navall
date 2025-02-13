import React, { useState, useRef, useEffect } from 'react';
import './NavalChat.css';

function NavalChat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [{
      type: 'bot',
      content: "👋 Hi! I'm Naval AI, your guide to Naval Ravikant's wisdom. Ask me anything about wealth creation, happiness, or philosophy."
    }];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setIsLoading(true);

    try {
      setError(null);
      const response = await fetch('https://aiagent.ofofo.ai/api/v1/prediction/d86d3518-4f8e-45a0-83ef-eacbae2d48e2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
    } catch (error) {
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const clearChat = () => {
    setMessages([{
      type: 'bot',
      content: "👋 Hi! I'm Naval AI, your guide to Naval Ravikant's wisdom. Ask me anything about wealth creation, happiness, or philosophy."
    }]);
  };

  const suggestedQuestions = [
    "What are Naval's principles for building wealth?",
    "How does Naval approach happiness?",
    "What is specific knowledge?",
    "Explain Naval's views on reading"
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Add a toast notification
    alert('Copied to clipboard!');
  };

  return (
    <div className="chat-interface">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Naval AI</h1>
        </div>
        <div className="sidebar-content">
          <div className="topic-list">
            <h2>Popular Topics</h2>
            <button onClick={() => setInput("What are Naval's principles for wealth creation?")}>
              💰 Wealth Creation
            </button>
            <button onClick={() => setInput("What does Naval say about happiness?")}>
              ✨ Happiness
            </button>
            <button onClick={() => setInput("Explain Naval's concept of specific knowledge")}>
              🧠 Specific Knowledge
            </button>
            <button onClick={() => setInput("What are Naval's reading habits?")}>
              📚 Reading Habits
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="chat-container">
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.type === 'bot' && (
                  <div className="avatar">N</div>
                )}
                <div className="message-content">{message.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="avatar">N</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Naval's teachings..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <button onClick={clearChat}>Clear Chat</button>

      <button 
        className="theme-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default NavalChat; 