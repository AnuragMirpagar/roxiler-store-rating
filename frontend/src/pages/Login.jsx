import { useState } from 'react';
import api from '../api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [goRegister, setGoRegister] = useState(false);

  if (goRegister) {
    window.location.href = '/register';
    return null;
  }

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      onLogin(data);
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p>Sign in to your account to continue</p>
        <form onSubmit={handle}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: 8 }} type="submit">
            Sign In
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 14, textAlign: 'center' }}>
          No account? <span className="auth-link" onClick={() => window.location.href = '/register'}>Register here</span>
        </p>
      </div>
    </div>
  );
}