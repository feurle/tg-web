import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../router/routes';
import { useAuth } from '../features/auth/authStore';
import LoginModal from '../features/auth/components/LoginModal';

const LANGUAGES = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'sv', label: 'SV' },
  { code: 'ru', label: 'RU' },
];

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const { t, i18n: i18nInstance } = useTranslation();
  const currentLang = i18nInstance.language;

  function switchLanguage(code: string) {
    localStorage.setItem('lang', code);
    i18nInstance.changeLanguage(code);
  }

  return (
    <>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <NavLink to={ROUTES.HOME}>{t('nav.home')}</NavLink>
        <NavLink to={ROUTES.NEWS}>{t('nav.news')}</NavLink>

        {isAuthenticated && (
          <>
            <NavLink to={ROUTES.CUSTOMERS}>{t('nav.customers')}</NavLink>
            <NavLink to={ROUTES.USERS}>{t('nav.users')}</NavLink>
            <NavLink to={ROUTES.ARTICLES}>{t('nav.articles')}</NavLink>
            <NavLink to={ROUTES.IMAGES}>{t('nav.images')}</NavLink>
          </>
        )}

        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              style={{
                fontWeight: currentLang === lang.code ? 'bold' : 'normal',
                textDecoration: currentLang === lang.code ? 'underline' : 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0 0.25rem',
              }}
            >
              {lang.label}
            </button>
          ))}

          <span style={{ marginLeft: '0.5rem' }}>
            {isAuthenticated ? (
              <>
                <span style={{ marginRight: '1rem' }}>{user?.username}</span>
                <button onClick={logout}>{t('nav.logout')}</button>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)}>{t('nav.login')}</button>
            )}
          </span>
        </span>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
