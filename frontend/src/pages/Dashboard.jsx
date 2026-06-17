import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Users, ShoppingCart, Clock, CheckCircle, History, AlertCircle } from 'lucide-react';

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
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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

  const updateOrder = async (id, payload) => {
    try {
      let distributor_location = undefined;
      if (payload.status === 'Shipped') {
        distributor_location = prompt("Enter Distributor / Warehouse Location:");
        if (!distributor_location) return;
        payload.distributor_location = distributor_location;
      }
      const res = await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders/${id}/status`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // The backend returns the updated order
      setOrders(orders.map(o => o.id === id ? res.data.order : o));
      
      if (payload.status === 'Delivered') {
        alert("Order Completed! 📱 Automated WhatsApp Delivery confirmation sent to Pharmacy.");
      }
    } catch (err) {
      alert('Failed to update order');
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
                  <th style={{ padding: '1rem 0' }}>Priority</th>
                  <th style={{ padding: '1rem 0' }}>Total Amount</th>
                  <th style={{ padding: '1rem 0' }}>Status</th>
                  <th style={{ padding: '1rem 0' }}>History</th>
                  <th style={{ padding: '1rem 0' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <React.Fragment key={order.id}>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 0', fontFamily: 'monospace', fontSize: '0.875rem' }}>{order.id.slice(0,8)}</td>
                    <td style={{ padding: '1rem 0' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem 0', fontWeight: '500' }}>{order.customer_name || 'N/A'}</td>
                    <td style={{ padding: '1rem 0' }}>
                      {role === 'admin' ? (
                        <select 
                          value={order.priority || 'Medium'} 
                          onChange={(e) => updateOrder(order.id, { priority: e.target.value })}
                          style={{ background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--surface-border)', padding: '0.25rem', borderRadius: '4px', fontSize: '0.75rem' }}
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      ) : (
                        <span style={{ 
                          padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                          background: order.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : order.priority === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: order.priority === 'High' ? '#EF4444' : order.priority === 'Medium' ? '#F59E0B' : '#10B981'
                        }}>{order.priority || 'Medium'}</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0', fontWeight: '500', color: 'var(--accent)' }}>₹{order.total_amount}</td>
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
                    <td style={{ padding: '1rem 0' }}>
                      <button onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', gap: '0.25rem', alignItems: 'center', cursor: 'pointer' }}>
                        <History size={14} /> History
                      </button>
                    </td>
                    {role === 'admin' ? (
                      <td style={{ padding: '1rem 0' }}>
                        {order.status === 'Pending' && <button onClick={() => updateOrder(order.id, { status: 'Shipped' })} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Ship</button>}
                        {order.status === 'Shipped' && <button onClick={() => updateOrder(order.id, { status: 'Delivered' })} className="btn" style={{ background: 'var(--success)', color: 'white', padding: '0.25rem 0.75rem', fontSize: '0.75rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Deliver</button>}
                      </td>
                    ) : (
                      <td style={{ padding: '1rem 0' }}>
                        {order.status === 'Delivered' && (
                          <button onClick={() => window.print()} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.25rem 0.75rem', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>Download Invoice</button>
                        )}
                      </td>
                    )}
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                      <td colSpan="8" style={{ padding: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <History size={16} /> Action History & Timeline
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {order.action_history && order.action_history.map((log, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                              <div style={{ color: 'var(--accent)', fontWeight: 'bold', width: '150px' }}>
                                {new Date(log.timestamp).toLocaleString()}
                              </div>
                              <div style={{ color: 'var(--text-muted)', width: '120px' }}>By: {log.user}</div>
                              <div>{log.action}</div>
                            </div>
                          ))}
                          {(!order.action_history || order.action_history.length === 0) && (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No history recorded.</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
