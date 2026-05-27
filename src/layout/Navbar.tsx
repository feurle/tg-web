import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../router/routes';
import { useAuth } from '../features/auth/authStore';
import LoginModal from '../features/auth/components/LoginModal';
import logoImg from '../assets/logo.png';

const LANGUAGES = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t, i18n: i18nInstance } = useTranslation();
  const currentLang = i18nInstance.language;
  const currentLangData = LANGUAGES.find((l) => l.code === currentLang);
  const location = useLocation();

  function switchLanguage(code: string) {
    localStorage.setItem('lang', code);
    i18nInstance.changeLanguage(code);
    setShowLangDropdown(false);
    setMenuOpen(false);
  }

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    }

    if (showLangDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLangDropdown]);

  return (
    <>
      <nav className="navbar">
        <NavLink to={ROUTES.HOME} className="nav-logo">
          <img src={logoImg} alt="Tier Gesund" className="nav-logo-img" />
          {t('app.name')}
        </NavLink>

        <div className="nav-links">
          <NavLink to={ROUTES.HOME} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {t('nav.home')}
          </NavLink>
          <NavLink to={ROUTES.NEWS} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {t('nav.news')}
          </NavLink>
          <NavLink to={ROUTES.ABOUT} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {t('pages.about')}
          </NavLink>
          {isAuthenticated && (
            <NavLink to={ROUTES.CUSTOMERS} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {t('nav.administration')}
            </NavLink>
          )}
        </div>

        <div className="nav-right">
          <div className="lang-dropdown" ref={dropdownRef}>
            <button onClick={() => setShowLangDropdown(!showLangDropdown)} className="lang-btn-flag" title={currentLangData?.label}>
              {currentLangData?.flag}
            </button>
            {showLangDropdown && (
              <div className="lang-dropdown-menu">
                {LANGUAGES.map((lang) => (
                  <button key={lang.code} onClick={() => switchLanguage(lang.code)} className="lang-dropdown-item">
                    <span className="lang-flag">{lang.flag}</span>
                    <span className="lang-name">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {isAuthenticated ? (
            <button onClick={logout} className="btn-secondary">{t('nav.logout')}</button>
          ) : (
            <button onClick={() => setShowLogin(true)} className="btn-primary">{t('nav.login')}</button>
          )}
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="7" x2="21" y2="7"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="17" x2="21" y2="17"/>
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-overlay" role="dialog" aria-modal="true" aria-label="Navigation">
          <nav className="mobile-overlay-links">
            <NavLink to={ROUTES.HOME} className={({ isActive }) => isActive ? 'mobile-overlay-link active' : 'mobile-overlay-link'}>
              {t('nav.home')}
            </NavLink>
            <NavLink to={ROUTES.NEWS} className={({ isActive }) => isActive ? 'mobile-overlay-link active' : 'mobile-overlay-link'}>
              {t('nav.news')}
            </NavLink>
            <NavLink to={ROUTES.ABOUT} className={({ isActive }) => isActive ? 'mobile-overlay-link active' : 'mobile-overlay-link'}>
              {t('pages.about')}
            </NavLink>
            {isAuthenticated && (
              <NavLink to={ROUTES.CUSTOMERS} className={({ isActive }) => isActive ? 'mobile-overlay-link active' : 'mobile-overlay-link'}>
                {t('nav.administration')}
              </NavLink>
            )}
          </nav>
          <div className="mobile-overlay-bottom">
            <div className="mobile-overlay-lang">
              {LANGUAGES.map((lang) => (
                <button key={lang.code} onClick={() => switchLanguage(lang.code)} className={`mobile-lang-btn${currentLang === lang.code ? ' active' : ''}`}>
                  {lang.flag}
                </button>
              ))}
            </div>
            {isAuthenticated ? (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="btn-secondary mobile-overlay-btn">
                {t('nav.logout')}
              </button>
            ) : (
              <button onClick={() => { setMenuOpen(false); setShowLogin(true); }} className="btn-primary mobile-overlay-btn">
                {t('nav.login')}
              </button>
            )}
          </div>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
