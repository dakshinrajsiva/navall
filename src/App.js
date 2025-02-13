import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const formatResponse = (text) => {
  // Split response into sections if it contains numbered points
  if (text.includes('1.')) {
    const sections = text.split(/(\d+\.\s)/).filter(Boolean);
    return (
      <div className="formatted-response">
        {sections.map((section, index) => {
          if (section.match(/^\d+\.\s/)) {
            // This is a number
            return <strong key={index} className="point-number">{section}</strong>;
          } else {
            // This is content
            return <span key={index} className="point-content">{section}</span>;
          }
        })}
      </div>
    );
  }
  
  // For responses without numbered points
  return <div className="formatted-response">{text}</div>;
};

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatMessagesRef = useRef(null);
  const inputRef = useRef(null);

  const sampleQuestions = [
    "What does Naval say about creating wealth without luck?",
    "How does Naval approach the concept of happiness and peace?",
    "What are Naval's thoughts on reading and self-education?",
    "Can you explain Naval's perspective on leverage?",
    "What does Naval teach about specific knowledge?",
    "How does Naval view the relationship between wealth and status?"
  ];

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message, isUser) => {
    setMessages(prev => [...prev, { text: message, isUser }]);
  };

  const sendMessage = async () => {
    const message = inputRef.current.value.trim();
    if (!message) return;

    addMessage(message, true);
    inputRef.current.value = '';
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: message
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.answer || data.response || data.text || data.result;
      if (answer) {
        addMessage(answer, false);
      } else {
        throw new Error('No valid response format found in the API response');
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage(`Error: ${error.message}. Please try again later.`, false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (question) => {
    inputRef.current.value = question;
    sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Naval Ravikant AI Guide</h1>
        <p>Explore Naval's wisdom on wealth, happiness, and life</p>
      </div>
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.length === 0 && (
          <div className="welcome-message assistant-message">
            <p className="greeting">Hello! I'm your guide to Naval Ravikant's insights and wisdom.</p>
            <p className="instruction">Ask me anything about his teachings on:</p>
            <ul className="topics-list">
              <li>Wealth Creation</li>
              <li>Happiness & Peace</li>
              <li>Decision Making</li>
              <li>Life Philosophy</li>
            </ul>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isUser ? 'user-message' : 'assistant-message'}`}>
            {msg.isUser ? msg.text : formatResponse(msg.text)}
          </div>
        ))}
        {loading && (
          <div className="loading">
            Thinking
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      <div className="suggestion-chips">
        {sampleQuestions.map((question, index) => (
          <button 
            key={index} 
            className="suggestion-chip"
            onClick={() => handleSuggestionClick(question)}
          >
            {question}
          </button>
        ))}
      </div>
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask about Naval's insights..."
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App; 