import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient, { ApiError } from '../../../lib/apiClient';
import { authStore } from '../authStore';

interface LoginModalProps {
  onClose: () => void;
}

interface LoginResponse {
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  authorities: string[];
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiClient.post<LoginResponse>('/api/auth/login', { login: username, password });
      authStore.login({ username: data.login, roles: data.authorities });
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError(t('auth.errorInvalid'));
      } else {
        setError(t('auth.errorGeneral'));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', padding: '2rem', borderRadius: '8px', minWidth: '320px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{t('auth.loginHeading')}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder={t('auth.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </button>
          <button type="button" onClick={onClose} disabled={loading}>{t('auth.cancel')}</button>
        </form>
      </div>
    </div>
  );
}
