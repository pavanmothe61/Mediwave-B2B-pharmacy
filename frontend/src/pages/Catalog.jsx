import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, PackagePlus, Edit2, Check, X } from 'lucide-react';

export default function Catalog() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Edit State
  const [editingMedId, setEditingMedId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  // Add Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/medicines?search=${search}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMedicines(res.data);
      } catch (err) {
        console.error('Failed to fetch medicines', err);
      }
    };
    if (token) fetchMedicines();
  }, [search, token]);

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/medicines', 
        { name, description, price: parseFloat(price), stock: parseInt(stock), category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Medicine successfully added to catalog!');
      setMedicines([...medicines, res.data]);
      setShowAddForm(false);
      setName(''); setDescription(''); setPrice(''); setStock(''); setCategory('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medicine');
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/medicines/${id}`, 
        { price: parseFloat(editPrice), stock: parseInt(editStock) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMedicines(medicines.map(m => m.id === id ? res.data.medicine : m));
      setEditingMedId(null);
    } catch (err) {
      alert('Failed to update medicine details');
    }
  };

  const addToCart = (med) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === med.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...med, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${med.name} added to cart`);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Medicine Catalog</h1>
          {role === 'admin' && (
            <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary" style={{ background: 'var(--success)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <Plus size={16} /> {showAddForm ? 'Cancel' : 'Add New'}
            </button>
          )}
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input 
            type="text" 
            placeholder="Search medicines..." 
            className="input-field" 
            style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {showAddForm && role === 'admin' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PackagePlus size={24} color="#10B981" /> Add New Medicine
          </h2>
          {error && <div style={{ color: '#EF4444', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const res = await axios.post('http://localhost:5000/api/medicines', 
                { name, description, price: parseFloat(price), stock: parseInt(stock), category },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              alert('Medicine successfully added to catalog!');
              setMedicines([...medicines, res.data]);
              setShowAddForm(false);
              setName(''); setDescription(''); setPrice(''); setStock(''); setCategory('');
            } catch (err) {
              setError(err.response?.data?.message || 'Failed to add medicine');
            }
          }}>
            <div className="input-group">
              <label className="input-label">Medicine Name</label>
              <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Paracetamol 500mg" />
            </div>
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} required rows="2" placeholder="Brief details and uses..."></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Price (₹)</label>
                <input type="number" step="0.01" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="e.g. 15.00" />
              </div>
              <div className="input-group">
                <label className="input-label">Initial Stock Count</label>
                <input type="number" className="input-field" value={stock} onChange={(e) => setStock(e.target.value)} required placeholder="e.g. 100" />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Category</label>
              <input type="text" className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g. Antibiotics" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#10B981', border: 'none', padding: '0.75rem', fontWeight: 'bold' }}>
              Add Inventory to Catalog
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {medicines.map(med => (
          <div key={med.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', opacity: med.stock > 0 || role === 'admin' ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{med.name}</h3>
              {role === 'admin' && editingMedId !== med.id && (
                <button onClick={() => { setEditingMedId(med.id); setEditPrice(med.price); setEditStock(med.stock); }} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>{med.description}</p>
            
            {editingMedId === med.id ? (
              <div style={{ background: 'var(--surface-border)', padding: '1rem', borderRadius: '8px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price (₹)</label>
                    <input type="number" step="0.01" className="input-field" style={{ padding: '0.5rem', marginTop: '0.25rem', background: 'var(--surface)' }} value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock</label>
                    <input type="number" className="input-field" style={{ padding: '0.5rem', marginTop: '0.25rem', background: 'var(--surface)' }} value={editStock} onChange={(e) => setEditStock(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditingMedId(null)} className="btn" style={{ padding: '0.4rem 0.75rem', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}><X size={14} /> Cancel</button>
                  <button onClick={() => handleSaveEdit(med.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', background: 'var(--success)', fontSize: '0.875rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}><Check size={14} /> Save</button>
                </div>
              </div>
            ) : (
              <>
                {role === 'admin' && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Stock: <strong style={{ color: 'var(--text-main)'}}>{med.stock}</strong></p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent)' }}>₹{med.price}</span>
                  {role === 'pharmacy' && (
                    med.stock > 0 ? (
                      <button onClick={() => addToCart(med)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem' }}>
                        <Plus size={16} /> Add to Cart
                      </button>
                    ) : (
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
                        Out of Stock
                      </span>
                    )
                  )}
                  {role === 'admin' && med.stock <= 0 && (
                     <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
                        Out of Stock
                      </span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        {medicines.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No medicines found. Admin needs to add inventory.</p>}
      </div>
    </div>
  );
}
