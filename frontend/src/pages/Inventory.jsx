import { useState, useEffect } from 'react';
import axios from 'axios';
import { PackagePlus, Edit2, Package } from 'lucide-react';

export default function Inventory() {
  const [medicines, setMedicines] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('General');
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/medicines`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/medicines/${editingId}`, 
          { price: parseFloat(price), stock: parseInt(stock) },
          { headers: { Authorization: `Bearer ${token}` }}
        );
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/medicines`, 
          { name, description, price: parseFloat(price), stock: parseInt(stock), category },
          { headers: { Authorization: `Bearer ${token}` }}
        );
      }
      setEditingId(null);
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      fetchMedicines();
      alert(editingId ? 'Medicine updated' : 'Medicine added successfully');
    } catch (err) {
      alert('Error saving medicine');
    }
  };

  const startEdit = (med) => {
    setEditingId(med.id);
    setName(med.name);
    setPrice(med.price);
    setStock(med.stock);
    setCategory(med.category);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Inventory Management</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PackagePlus size={20} /> {editingId ? 'Edit Medicine' : 'Add New Medicine'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Medicine Name</label>
              <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required disabled={!!editingId} />
            </div>
            {!editingId && (
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} rows="2"></textarea>
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Price (₹)</label>
                <input type="number" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Stock Quantity</label>
                <input type="number" className="input-field" value={stock} onChange={(e) => setStock(e.target.value)} required />
              </div>
            </div>
            {!editingId && (
              <div className="input-group">
                <label className="input-label">Category</label>
                <input type="text" className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              {editingId ? 'Update Stock & Price' : 'Add to Catalog'}
            </button>
            {editingId && (
              <button type="button" onClick={() => setEditingId(null)} className="btn" style={{ background: 'transparent', border: '1px solid var(--surface-border)', color: 'var(--text-main)' }}>
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={20} /> Current Catalog
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <th style={{ padding: '1rem 0' }}>Name</th>
                  <th style={{ padding: '1rem 0' }}>Category</th>
                  <th style={{ padding: '1rem 0' }}>Price</th>
                  <th style={{ padding: '1rem 0' }}>Stock</th>
                  <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map(med => (
                  <tr key={med.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: '500' }}>{med.name}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{med.category}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--accent)' }}>₹{med.price}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ color: med.stock < 50 ? 'var(--danger)' : 'var(--success)' }}>{med.stock} units</span>
                    </td>
                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                      <button onClick={() => startEdit(med)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.4rem', borderRadius: '6px', color: 'var(--text-main)', cursor: 'pointer' }}>
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
