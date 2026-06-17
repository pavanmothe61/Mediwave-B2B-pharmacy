import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id, delta) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    if (!deliveryAddress.trim()) {
      alert('Please enter a delivery address before placing your order.');
      return;
    }
    try {
      const items = cart.map(c => ({ medicine_id: c.id, quantity: c.quantity }));
      const customer_name = localStorage.getItem('name');
      await axios.post('http://localhost:5000/api/orders', { items, delivery_address: deliveryAddress, customer_name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('cart');
      setCart([]);
      setDeliveryAddress('');
      alert('Order placed successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error placing order', err);
      alert('Failed to place order. Is the order API implemented?');
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your cart is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Browse the catalog to add medicines.</p>
          <button onClick={() => navigate('/catalog')} className="btn btn-primary">Go to Catalog</button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--surface-border)' }}>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{item.name}</h4>
                <p style={{ color: 'var(--accent)', fontWeight: '500' }}>₹{item.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-border)', borderRadius: '8px', overflow: 'hidden' }}>
                  <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '1.25rem' }}>-</button>
                  <span style={{ padding: '0 0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '1.25rem' }}>+</button>
                </div>
                <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1rem' }}>
            <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Total:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>₹{total.toFixed(2)}</span>
          </div>
          
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem' }}>
            <label className="input-label" style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>Delivery Address</label>
            <textarea 
              className="input-field" 
              value={deliveryAddress} 
              onChange={(e) => setDeliveryAddress(e.target.value)} 
              required 
              rows="3" 
              placeholder="Enter full delivery address here..."
            ></textarea>
          </div>

          <button onClick={placeOrder} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.125rem' }}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
