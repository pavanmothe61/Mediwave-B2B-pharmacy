import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`, { email, password });
      
      // Strict security check: Ensure this user is actually an admin!
      if (res.data.user.role !== 'admin') {
        setError('Unauthorized: Pharmacy users cannot access the Admin Portal.');
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('address', res.data.user.address || '');
      localStorage.setItem('name', res.data.user.name || '');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card animate-fade-in" style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.75rem', color: '#EF4444' }}>Admin Secure Portal</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Admin Email Address</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label">Master Password</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', gap: '0.5rem', background: '#EF4444', border: 'none' }}>
            <ShieldAlert size={18} /> Admin Login
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Not an admin? <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Go to Pharmacy Login</a>
        </p>
      </div>
    </div>
  );
}
