import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pill, LogOut, ShoppingCart, Bell, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (token) {
      const fetchNotifications = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setNotifications(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Polling every 10s
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const markAsRead = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/mark-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Pill size={28} color="#0284C7" />
          Pharmacy B2B Ordering Portal
        </Link>
        <div className="nav-links" style={{ alignItems: 'center' }}>
          {token ? (
            <>
              {role === 'pharmacy' && <Link to="/catalog" className="nav-link">Catalog</Link>}
              {role === 'mr' && <Link to="/mr-visit" className="nav-link">Log Visit</Link>}
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {role === 'pharmacy' && <Link to="/cart" className="nav-link"><ShoppingCart size={20}/></Link>}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  className="nav-link" 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--danger)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="glass-panel" style={{ position: 'absolute', top: '100%', right: '0', width: '320px', zIndex: 50, padding: '1rem', marginTop: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h4>
                      {unreadCount > 0 && (
                        <button onClick={markAsRead} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle2 size={14} /> Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>No new notifications.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {notifications.map(n => (
                          <div key={n.id} style={{ padding: '0.75rem', background: n.is_read ? 'transparent' : 'var(--surface-border)', borderRadius: '6px', border: '1px solid var(--surface-border)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '0.25rem' }}>{n.type}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{n.message}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{new Date(n.createdAt).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '0.4rem 1rem', display: 'flex', gap: '0.5rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
