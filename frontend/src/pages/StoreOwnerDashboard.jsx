import { useState, useEffect } from 'react';
import api from '../api';

export default function StoreOwnerDashboard({ user }) {
  const [store, setStore] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [newPwd, setNewPwd] = useState('');
  const [msg, setMsg] = useState('');
  const [sortDir, setSortDir] = useState('ASC');

  useEffect(() => { loadStore(); }, []);

  const loadStore = async () => {
    try {
      const { data } = await api.get('/stores/my-store');
      setStore(data);
    } catch {
      setStore(null);
    }
  };

  const avgRating = () => {
    if (!store?.ratings?.length) return 'N/A';
    return (store.ratings.reduce((a, r) => a + r.value, 0) / store.ratings.length).toFixed(1);
  };

  const sortedRatings = store?.ratings ? [...store.ratings].sort((a, b) => {
    const v = sortDir === 'ASC' ? 1 : -1;
    return (a.user?.name || '') > (b.user?.name || '') ? v : -v;
  }) : [];

  const changePwd = async (e) => {
    e.preventDefault();
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(newPwd)) {
      setMsg('Password: 8-16 chars, 1 uppercase, 1 special char');
      return;
    }
    await api.patch('/users/password', { password: newPwd });
    setMsg('Password updated!');
    setNewPwd('');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginTop: 24, marginBottom: 20 }}>
        <button className={`btn ${tab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('dashboard')}>📊 Dashboard</button>
        <button className={`btn ${tab === 'password' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('password')}>🔐 Change Password</button>
      </div>

      {tab === 'dashboard' && (
        <div>
          {!store ? (
            <div className="card"><p style={{ color: '#aaa', textAlign: 'center' }}>No store assigned to your account yet. Contact the admin.</p></div>
          ) : (
            <>
              <div className="card" style={{ marginBottom: 16 }}>
                <h2 style={{ marginBottom: 8 }}>{store.name}</h2>
                <p style={{ color: '#666', marginBottom: 4 }}>{store.address}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#e94560' }}>⭐ {avgRating()} <span style={{ fontSize: 14, color: '#aaa' }}>average rating</span></p>
              </div>
              <div className="card">
                <div className="page-header">
                  <h2>Ratings Received ({store.ratings?.length || 0})</h2>
                  <button className="btn btn-secondary btn-sm" onClick={() => setSortDir(d => d === 'ASC' ? 'DESC' : 'ASC')}>
                    Sort by Name {sortDir === 'ASC' ? '↑' : '↓'}
                  </button>
                </div>
                <table>
                  <thead>
                    <tr><th>User Name</th><th>Email</th><th>Rating</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {sortedRatings.map(r => (
                      <tr key={r.id}>
                        <td>{r.user?.name || 'Unknown'}</td>
                        <td>{r.user?.email || '—'}</td>
                        <td>{'⭐'.repeat(r.value)} ({r.value})</td>
                        <td>{new Date(r.updatedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {sortedRatings.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: '#aaa' }}>No ratings yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'password' && (
        <div className="card" style={{ maxWidth: 400 }}>
          <h2 style={{ marginBottom: 20 }}>Change Password</h2>
          {msg && <p className={msg.includes('updated') ? 'success' : 'error'}>{msg}</p>}
          <form onSubmit={changePwd}>
            <div className="form-group"><label>New Password</label>
              <input type="password" placeholder="8-16 chars, 1 uppercase, 1 special char" value={newPwd}
                onChange={e => setNewPwd(e.target.value)} required />
            </div>
            <button className="btn btn-primary" type="submit">Update Password</button>
          </form>
        </div>
      )}
    </div>
  );
}