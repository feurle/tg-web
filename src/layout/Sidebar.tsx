import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../router/routes';
import { useAuth } from '../features/auth/authStore';

export default function Sidebar() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const getInitials = (username?: string) => {
    if (!username) return 'U';
    return username
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section-label">{t('nav.sidebar.management')}</div>
      <NavLink
        to={ROUTES.CUSTOMERS}
        className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
      >
        <span className="sidebar-icon">👥</span>
        {t('nav.customers')}
      </NavLink>
      <NavLink
        to={ROUTES.USERS}
        className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
      >
        <span className="sidebar-icon">👤</span>
        {t('nav.users')}
      </NavLink>

      <div className="sidebar-section-label">{t('nav.sidebar.webcontent')}</div>
      <NavLink
        to={ROUTES.ARTICLES}
        className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
      >
        <span className="sidebar-icon">📄</span>
        {t('nav.articles')}
      </NavLink>
      <NavLink
        to={ROUTES.IMAGES}
        className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
      >
        <span className="sidebar-icon">🖼️</span>
        {t('nav.images')}
      </NavLink>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{getInitials(user?.username)}</div>
          <div>
            <div className="user-name">{user?.username || 'User'}</div>
            <div className="user-role">{t('nav.sidebar.admin')}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
