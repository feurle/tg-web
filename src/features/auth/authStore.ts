import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const unsub = authStore.subscribe(() => setUser(authStore.getUser()));
    return () => { unsub(); };
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    login: (user: AuthUser) => authStore.login(user),
    logout: authStore.logout.bind(authStore),
  };
}
