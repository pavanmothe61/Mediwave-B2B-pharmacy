import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Users, ShoppingCart, Clock, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ background: color, padding: '1rem', borderRadius: '12px', display: 'flex' }}>
      <Icon size={24} color="white" />
    </div>
    <div>
      <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</h3>
      <p style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.25rem' }}>{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, medsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/medicines`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setOrders(ordersRes.data);
        setMedicines(medsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      }
    };
    if (token) fetchData();
  }, [token]);

  const updateOrderStatus = async (id, status) => {
    try {
      let distributor_location = undefined;
      if (status === 'Shipped') {
        distributor_location = prompt("Enter Distributor / Warehouse Location:");
        if (!distributor_location) return;
      }
      await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders/${id}/status`, { status, distributor_location }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.map(o => o.id === id ? { ...o, status, distributor_location: distributor_location || o.distributor_location } : o));
      
      if (status === 'Delivered') {
        alert("Order Completed! 📱 Automated WhatsApp Delivery confirmation sent to Pharmacy.");
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;



  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {role === 'admin' ? 'Admin Dashboard' : 'Pharmacy Dashboard'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Overview of your operations and orders.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <StatCard title={role === 'admin' ? "Total Orders" : "My Orders"} value={orders.length} icon={ShoppingCart} color="#4F46E5" />
        <StatCard title="Pending Requests" value={pendingOrders} icon={Clock} color="#F59E0B" />
        {role === 'admin' && <StatCard title="Active Users" value="-" icon={Users} color="#10B981" />}
        <StatCard title="Available Medicines" value={medicines.length} icon={Package} color={role === 'admin' ? "#EF4444" : "#10B981"} />
      </div>
      
      <div className="glass-panel" style={{ marginTop: '2.5rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Orders</h3>
        {orders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No orders found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <th style={{ padding: '1rem 0' }}>Order ID</th>
                  <th style={{ padding: '1rem 0' }}>Date</th>
                  <th style={{ padding: '1rem 0' }}>Ordered By</th>
                  <th style={{ padding: '1rem 0' }}>Total Amount</th>
                  <th style={{ padding: '1rem 0' }}>Delivery To</th>
                  <th style={{ padding: '1rem 0' }}>Dispatch From</th>
                  <th style={{ padding: '1rem 0' }}>Status</th>
                  <th style={{ padding: '1rem 0' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 0', fontFamily: 'monospace', fontSize: '0.875rem' }}>{order.id.slice(0,8)}...</td>
                    <td style={{ padding: '1rem 0' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem 0', fontWeight: '500' }}>{order.customer_name || 'N/A'}</td>
                    <td style={{ padding: '1rem 0', fontWeight: '500', color: 'var(--accent)' }}>₹{order.total_amount}</td>
                    <td style={{ padding: '1rem 0' }}>{order.delivery_address || 'N/A'}</td>
                    <td style={{ padding: '1rem 0' }}>{order.distributor_location || 'Pending'}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '99px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: order.status === 'Pending' ? 'rgba(245, 158, 11, 0.2)' : order.status === 'Shipped' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: order.status === 'Pending' ? '#F59E0B' : order.status === 'Shipped' ? '#38BDF8' : '#10B981'
                      }}>
                        {order.status === 'Delivered' && <CheckCircle size={12} />}
                        {order.status}
                      </span>
                    </td>
                    {role === 'admin' ? (
                      <td style={{ padding: '1rem 0' }}>
                        {order.status === 'Pending' && <button onClick={() => updateOrderStatus(order.id, 'Shipped')} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Ship</button>}
                        {order.status === 'Shipped' && <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="btn" style={{ background: 'var(--success)', color: 'white', padding: '0.25rem 0.75rem', fontSize: '0.75rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Deliver</button>}
                      </td>
                    ) : (
                      <td style={{ padding: '1rem 0' }}>
                        {order.status === 'Delivered' && (
                          <button onClick={() => window.print()} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.25rem 0.75rem', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>Download Invoice</button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
