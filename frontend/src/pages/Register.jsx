import { useState } from 'react';
import api from '../api';

function validate(form) {
  if (form.name.length < 20 || form.name.length > 60) return 'Name must be 20–60 characters';
  if (form.address.length > 400) return 'Address max 400 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email';
  if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(form.password)) 
    return 'Password: 8-16 chars, 1 uppercase, 1 special character';
  return null;
}

export default function Register({ onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    const err = validate(form);
    if (err) { setError(err); return; }
    try {
      const { data } = await api.post('/auth/register', form);
      onLogin(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Create Account</h2>
        <p>Join StoreRate to discover and rate stores</p>
        <form onSubmit={handle}>
          <div className="form-group">
            <label>Full Name (20–60 chars)</label>
            <input placeholder="Enter your full name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input placeholder="Your address" value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="8-16 chars, uppercase + special char" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: 8 }} type="submit">
            Register
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 14, textAlign: 'center' }}>
          Have an account? <span className="auth-link" onClick={() => window.location.href = '/login'}>Login</span>
        </p>
      </div>
    </div>
  );
}