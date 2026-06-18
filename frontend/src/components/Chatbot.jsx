import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import axios from 'axios';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your Product Information Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    // Simulate AI / Rule-based logic (Step 4)
    setTimeout(async () => {
      let botReply = '';
      const lower = userMsg.toLowerCase();

      // FAQ Retrieval
      if (lower.includes('delivery time') || lower.includes('how long')) {
        botReply = "Standard delivery takes 24-48 hours. High priority orders are delivered within 12 hours.";
      } else if (lower.includes('stock') || lower.includes('inventory')) {
        botReply = "You can view real-time stock levels in our Catalog tab. If something is out of stock, it will be highlighted in red.";
      } else if (lower.includes('recommend') || lower.includes('suggest')) {
        // AI Recommendation simulation
        botReply = "Based on current seasonal trends, I recommend stocking up on Paracetamol and Cetirizine. Would you like me to add them to your cart?";
      } else if (lower.includes('handover') || lower.includes('human') || lower.includes('agent')) {
        // Agent Handover Workflow (Step 3)
        botReply = "I am transferring this chat to a human agent. An Admin will review your ticket and contact you shortly. Ticket #8492 created.";
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications`, {
              user_id: null,
              message: `Agent Handover Requested: Ticket #8492`,
              type: 'Support Alert'
            }, { headers: { Authorization: `Bearer ${token}` }});
          }
        } catch (err) {}
      } else {
        botReply = "I understand you're asking about '" + userMsg + "'. For complex queries, please type 'Agent' to connect with a human representative.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px',
          borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none',
          boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)', cursor: 'pointer', zIndex: 1000,
          display: isOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={30} />
      </button>

      {isOpen && (
        <div className="glass-panel" style={{
          position: 'fixed', bottom: '2rem', right: '2rem', width: '350px', height: '500px',
          zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Header */}
          <div style={{ background: 'var(--primary)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={24} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Smart Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Window */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                display: 'flex', flexDirection: 'column', 
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{ 
                  display: 'flex', gap: '0.5rem', alignItems: 'flex-end',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                }}>
                  <div style={{ 
                    width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: msg.sender === 'user' ? 'var(--accent)' : 'var(--surface-border)', color: 'white'
                  }}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div style={{
                    maxWidth: '220px', padding: '0.75rem 1rem', fontSize: '0.875rem', lineHeight: '1.4',
                    borderRadius: '12px',
                    background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                    borderBottomRightRadius: msg.sender === 'user' ? '0' : '12px',
                    borderBottomLeftRadius: msg.sender === 'bot' ? '0' : '12px',
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--surface-border)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type 'Agent' for handover..."
              style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }}
            />
            <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
