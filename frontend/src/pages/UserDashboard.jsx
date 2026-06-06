import { useState, useEffect } from 'react';
import api from '../api';

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`star ${(hover || value) >= s ? 'filled' : ''}`}
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}>★</span>
      ))}
    </div>
  );
}

export default function UserDashboard({ user }) {
  const [tab, setTab] = useState('stores');
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [ratings, setRatings] = useState({});
  const [newPwd, setNewPwd] = useState('');
  const [msg, setMsg] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('ASC');

  useEffect(() => { loadStores(); }, [search]);

  const loadStores = async () => {
    const { data } = await api.get('/stores', { params: search });
    setStores(data);
    const r = {};
    data.forEach(s => {
      if (s.ratings) {
        const mine = s.ratings.find(x => x.userId === user.id);
        if (mine) r[s.id] = mine.value;
      }
    });
    setRatings(prev => ({ ...prev, ...r }));
  };

  const handleRate = async (storeId, value) => {
    setRatings(prev => ({ ...prev, [storeId]: value }));
    await api.post('/ratings', { storeId, value });
    loadStores();
  };

  const avgRating = (store) => {
    if (!store.ratings || store.ratings.length === 0) return 'N/A';
    return (store.ratings.reduce((a, r) => a + r.value, 0) / store.ratings.length).toFixed(1);
  };

  const handleSort = (field) => {
    const dir = sortField === field && sortDir === 'ASC' ? 'DESC' : 'ASC';
    setSortField(field); setSortDir(dir);
  };

  const sortedStores = [...stores].sort((a, b) => {
    const v = sortDir === 'ASC' ? 1 : -1;
    return a[sortField] > b[sortField] ? v : -v;
  });

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
        <button className={`btn ${tab === 'stores' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('stores')}>🏪 Stores</button>
        <button className={`btn ${tab === 'password' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('password')}>🔐 Change Password</button>
      </div>

      {tab === 'stores' && (
        <div className="card">
          <div className="page-header"><h2>All Stores</h2></div>
          <div className="filter-bar">
            <input placeholder="Search by name" value={search.name} onChange={e => setSearch({ ...search, name: e.target.value })} />
            <input placeholder="Search by address" value={search.address} onChange={e => setSearch({ ...search, address: e.target.value })} />
          </div>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Store Name {sortField === 'name' ? (sortDir === 'ASC' ? '↑' : '↓') : ''}</th>
                <th onClick={() => handleSort('address')}>Address {sortField === 'address' ? (sortDir === 'ASC' ? '↑' : '↓') : ''}</th>
                <th>Avg Rating</th>
                <th>Your Rating</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {sortedStores.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.address}</td>
                  <td>⭐ {avgRating(s)}</td>
                  <td>{ratings[s.id] ? `⭐ ${ratings[s.id]}` : '—'}</td>
                  <td><StarRating value={ratings[s.id] || 0} onChange={v => handleRate(s.id, v)} /></td>
                </tr>
              ))}
              {sortedStores.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa' }}>No stores found</td></tr>}
            </tbody>
          </table>
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