import { useState, useEffect } from 'react';
import api from '../api';

function validate(form) {
  if (form.name.length < 20 || form.name.length > 60) return 'Name must be 20–60 characters';
  if (form.address.length > 400) return 'Address max 400 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email';
  if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(form.password)) 
    return 'Password: 8-16 chars, 1 uppercase, 1 special char';
  return null;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('ASC');

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { if (tab === 'users') loadUsers(); }, [tab, filters]);
  useEffect(() => { if (tab === 'stores') loadStores(); }, [tab]);

  const loadStats = async () => {
    const { data } = await api.get('/admin/stats');
    setStats(data);
  };

  const loadUsers = async () => {
    const params = { ...filters, sort: sortDir };
    const { data } = await api.get('/users', { params });
    setUsers(data);
  };

  const loadStores = async () => {
    const { data } = await api.get('/stores');
    setStores(data);
  };

  const handleSort = (field) => {
    const newDir = sortField === field && sortDir === 'ASC' ? 'DESC' : 'ASC';
    setSortField(field);
    setSortDir(newDir);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const v = sortDir === 'ASC' ? 1 : -1;
    return a[sortField] > b[sortField] ? v : -v;
  });

  const addUser = async (e) => {
    e.preventDefault();
    const valErr = validate(userForm);
    if (valErr) { setErr(valErr); return; }
    try {
      await api.post('/users', userForm);
      setMsg('User created!');
      setErr('');
      setUserForm({ name: '', email: '', password: '', address: '', role: 'user' });
      loadStats();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Error');
    }
  };

  const addStore = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stores', { ...storeForm, ownerId: storeForm.ownerId ? +storeForm.ownerId : null });
      setMsg('Store created!');
      setErr('');
      setStoreForm({ name: '', email: '', address: '', ownerId: '' });
      loadStats();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Error');
    }
  };

  const avgRating = (store) => {
    if (!store.ratings || store.ratings.length === 0) return 'N/A';
    const sum = store.ratings.reduce((a, r) => a + r.value, 0);
    return (sum / store.ratings.length).toFixed(1);
  };

  const tabs = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'users', label: '👤 Users' },
    { key: 'stores', label: '🏪 Stores' },
    { key: 'add-user', label: '➕ Add User' },
    { key: 'add-store', label: '➕ Add Store' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginTop: 24, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} className={`btn ${tab === t.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setTab(t.key); setMsg(''); setErr(''); }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div>
          <div className="stats-grid">
            <div className="stat-card"><div className="number">{stats.users ?? '...'}</div><div className="label">Total Users</div></div>
            <div className="stat-card"><div className="number">{stats.stores ?? '...'}</div><div className="label">Total Stores</div></div>
            <div className="stat-card"><div className="number">{stats.ratings ?? '...'}</div><div className="label">Total Ratings</div></div>
          </div>
          <div className="card"><p style={{ color: '#888', textAlign: 'center' }}>Select a tab above to manage users, stores, or view details.</p></div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card">
          <div className="page-header"><h2>All Users</h2></div>
          <div className="filter-bar">
            <input placeholder="Filter by name" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
            <input placeholder="Filter by email" value={filters.email} onChange={e => setFilters({ ...filters, email: e.target.value })} />
            <input placeholder="Filter by address" value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} />
            <select value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })}
              style={{ padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: 6 }}>
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                {['name','email','address','role'].map(f => (
                  <th key={f} onClick={() => handleSort(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)} {sortField === f ? (sortDir === 'ASC' ? '↑' : '↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td><span className={`badge badge-${u.role === 'admin' ? 'admin' : u.role === 'store_owner' ? 'owner' : 'user'}`}>{u.role}</span></td>
                </tr>
              ))}
              {sortedUsers.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: '#aaa' }}>No users found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'stores' && (
        <div className="card">
          <div className="page-header"><h2>All Stores</h2></div>
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Address</th><th>Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>⭐ {avgRating(s)}</td>
                </tr>
              ))}
              {stores.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: '#aaa' }}>No stores yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'add-user' && (
        <div className="card" style={{ maxWidth: 500 }}>
          <h2 style={{ marginBottom: 20 }}>Add New User</h2>
          {msg && <p className="success">{msg}</p>}
          {err && <p className="error">{err}</p>}
          <form onSubmit={addUser}>
            <div className="form-group"><label>Name (20–60 chars)</label>
              <input value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required /></div>
            <div className="form-group"><label>Email</label>
              <input type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required /></div>
            <div className="form-group"><label>Address</label>
              <input value={userForm.address} onChange={e => setUserForm({ ...userForm, address: e.target.value })} required /></div>
            <div className="form-group"><label>Password</label>
              <input type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required /></div>
            <div className="form-group"><label>Role</label>
              <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Create User</button>
          </form>
        </div>
      )}

      {tab === 'add-store' && (
        <div className="card" style={{ maxWidth: 500 }}>
          <h2 style={{ marginBottom: 20 }}>Add New Store</h2>
          {msg && <p className="success">{msg}</p>}
          {err && <p className="error">{err}</p>}
          <form onSubmit={addStore}>
            <div className="form-group"><label>Store Name (20–60 chars)</label>
              <input value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} required /></div>
            <div className="form-group"><label>Email</label>
              <input type="email" value={storeForm.email} onChange={e => setStoreForm({ ...storeForm, email: e.target.value })} required /></div>
            <div className="form-group"><label>Address</label>
              <input value={storeForm.address} onChange={e => setStoreForm({ ...storeForm, address: e.target.value })} required /></div>
            <div className="form-group"><label>Owner User ID (optional)</label>
              <input type="number" placeholder="Leave blank if no owner yet" value={storeForm.ownerId} onChange={e => setStoreForm({ ...storeForm, ownerId: e.target.value })} /></div>
            <button className="btn btn-primary" type="submit">Create Store</button>
          </form>
        </div>
      )}
    </div>
  );
}