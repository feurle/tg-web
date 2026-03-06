import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../router/routes';
import { useAuth } from '../features/auth/authStore';
import LoginModal from '../features/auth/components/LoginModal';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <NavLink to={ROUTES.HOME}>Home</NavLink>
        <NavLink to={ROUTES.NEWS}>News</NavLink>

        {isAuthenticated && (
          <>
            <NavLink to={ROUTES.CUSTOMERS}>Customers</NavLink>
            <NavLink to={ROUTES.USERS}>Users</NavLink>
            <NavLink to={ROUTES.ARTICLES}>Artikel</NavLink>
            <NavLink to={ROUTES.IMAGES}>Bilder</NavLink>
          </>
        )}

        <span style={{ marginLeft: 'auto' }}>
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: '1rem' }}>{user?.username}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)}>Login</button>
          )}
        </span>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
