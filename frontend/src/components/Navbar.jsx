export default function Navbar({ user, onLogout }) {
  return (
    <nav>
      <h1>⭐ StoreRate</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>Welcome, {user.name} ({user.role})</span>
        <button className="btn btn-primary btn-sm" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}