import { Link, useNavigate } from 'react-router-dom';
import { Pill, LogOut, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

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
              <Link to="/catalog" className="nav-link">Catalog</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {role === 'pharmacy' && <Link to="/cart" className="nav-link"><ShoppingCart size={20}/></Link>}
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
