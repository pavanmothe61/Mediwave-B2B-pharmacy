import React, { useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

export default function Feedback() {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Please enter a feedback message.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/feedback`,
        { rating, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Thank you for your feedback!');
      setMessage('');
      setRating(5);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
        Customer Feedback
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        We value your suggestions! Please let us know how we can improve your ordering experience.
      </p>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="input-label" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
            Rate your experience
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                onClick={() => setRating(star)}
                fill={rating >= star ? '#FBBF24' : 'transparent'}
                color={rating >= star ? '#FBBF24' : 'var(--text-muted)'}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              />
            ))}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Detailed Feedback</label>
          <textarea
            className="input-field"
            rows="5"
            placeholder="Tell us what you liked or what we can improve..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', fontSize: '1.1rem' }}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
