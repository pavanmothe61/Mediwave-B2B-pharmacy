import { useState } from 'react';
import axios from 'axios';
import { UserCheck } from 'lucide-react';

export default function MRVisit() {
  const [doctorName, setDoctorName] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Pending Follow-up');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/mr-visits`, 
      { doctor_name: doctorName, pharmacy_name: pharmacyName, notes, status },
      { headers: { Authorization: `Bearer ${token}` }});
      
      setMessage('Visit logged successfully!');
      setDoctorName('');
      setPharmacyName('');
      setNotes('');
      setStatus('Pending Follow-up');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error logging visit');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Medical Representative Visit Form</h1>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        {message && <div style={{ background: 'var(--success)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>{message}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <label className="input-label">Doctor Name</label>
            <input type="text" className="input-field" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="e.g. Dr. John Smith" />
          </div>
          
          <div className="input-group">
            <label className="input-label">Pharmacy Name</label>
            <input type="text" className="input-field" value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} placeholder="e.g. City Care Pharmacy" />
          </div>
          
          <div className="input-group">
            <label className="input-label">Visit Notes / Summary</label>
            <textarea className="input-field" rows="4" value={notes} onChange={(e) => setNotes(e.target.value)} required placeholder="Discussed new antibiotic range..."></textarea>
          </div>
          
          <div className="input-group">
            <label className="input-label">Status</label>
            <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Completed">Completed</option>
              <option value="Pending Follow-up">Pending Follow-up</option>
              <option value="Sample Dropped">Sample Dropped</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <UserCheck size={20} /> Submit Visit Log
          </button>
        </form>
      </div>
    </div>
  );
}
