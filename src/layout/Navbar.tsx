import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t, i18n: i18nInstance } = useTranslation();
  const currentLang = i18nInstance.language;
  const currentLangData = LANGUAGES.find((l) => l.code === currentLang);

  function switchLanguage(code: string) {
    localStorage.setItem('lang', code);
    i18nInstance.changeLanguage(code);
    setShowLangDropdown(false);
  }

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
        <div className="nav-logo">
          <img src={logoImg} alt="Tier Gesund" className="nav-logo-img" />
          {t('app.name')}
        </div>
        <div className="nav-links">
          <NavLink
            to={ROUTES.HOME}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to={ROUTES.NEWS}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            {t('nav.news')}
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to={ROUTES.CUSTOMERS}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {t('nav.administration')}
            </NavLink>
          )}
        </div>

        <div className="nav-right">
          <div className="lang-dropdown" ref={dropdownRef}>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="lang-btn-flag"
              title={currentLangData?.label}
            >
              {currentLangData?.flag}
            </button>
            {showLangDropdown && (
              <div className="lang-dropdown-menu">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className="lang-dropdown-item"
                  >
                    <span className="lang-flag">{lang.flag}</span>
                    <span className="lang-name">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <button onClick={logout} className="btn-secondary">
              {t('nav.logout')}
            </button>
          ) : (
            <button onClick={() => setShowLogin(true)} className="btn-primary">
              {t('nav.login')}
            </button>
          )}
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
