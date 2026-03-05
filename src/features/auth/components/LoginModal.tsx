import { useState, type FormEvent } from 'react';
import { authStore } from '../authStore';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    // TODO: echten API-Call gegen tg-app ersetzen
    if (username && password) {
      authStore.login({ username, roles: ['USER'] });
      onClose();
    } else {
      setError('Bitte Benutzername und Passwort eingeben.');
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
        <h2>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
          <button type="submit">Anmelden</button>
          <button type="button" onClick={onClose}>Abbrechen</button>
        </form>
      </div>
    </div>
  );
}
