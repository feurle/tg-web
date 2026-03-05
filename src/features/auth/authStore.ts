import { useState } from 'react';

// Minimaler Auth-State ohne externe Bibliothek.
// Später durch Zustand oder Context ersetzen.

export interface AuthUser {
  username: string;
  roles: string[];
}

let _user: AuthUser | null = null;
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((l) => l());
}

export const authStore = {
  getUser: () => _user,
  isAuthenticated: () => _user !== null,

  login(user: AuthUser) {
    _user = user;
    notify();
  },

  logout() {
    _user = null;
    notify();
  },

  subscribe(listener: () => void) {
    _listeners.add(listener);
    return () => _listeners.delete(listener);
  },
};

/** React Hook für Auth-State */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(authStore.getUser());

  useState(() => {
    const unsub = authStore.subscribe(() => setUser(authStore.getUser()));
    return unsub;
  });

  return {
    user,
    isAuthenticated: user !== null,
    login: authStore.login.bind(authStore),
    logout: authStore.logout.bind(authStore),
  };
}
