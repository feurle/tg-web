import { useEffect, useState } from 'react';
import { userApi } from '../../features/users/api';
import type { CreateUserData, UpdateUserData, User } from '../../features/users/types';
import UserTable from '../../features/users/components/UserTable';
import UserFormModal from '../../features/users/components/UserFormModal';
import ConfirmDialog from '../../features/customers/components/ConfirmDialog';
import { ApiError } from '../../lib/apiClient';

type Modal =
  | { kind: 'create' }
  | { kind: 'edit'; user: User }
  | { kind: 'delete'; user: User }
  | null;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setError(null);
      const data = await userApi.getAll();
      setUsers(data);
    } catch {
      setError('Benutzer konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: CreateUserData) {
    setSaving(true);
    try {
      const created = await userApi.create(data);
      setUsers((prev) => [...prev, created]);
      setModal(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Erstellen fehlgeschlagen.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(data: UpdateUserData) {
    if (modal?.kind !== 'edit') return;
    setSaving(true);
    try {
      const updated = await userApi.update(modal.user.id, data);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setModal(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Speichern fehlgeschlagen.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (modal?.kind !== 'delete') return;
    setSaving(true);
    try {
      await userApi.delete(modal.user.id);
      setUsers((prev) => prev.filter((u) => u.id !== modal.user.id));
      setModal(null);
    } catch {
      setError('Löschen fehlgeschlagen.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Benutzerverwaltung</h1>
        <button onClick={() => setModal({ kind: 'create' })}>+ Neuer Benutzer</button>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <p>Laden…</p>
      ) : (
        <UserTable
          users={users}
          onEdit={(u) => setModal({ kind: 'edit', user: u })}
          onDelete={(u) => setModal({ kind: 'delete', user: u })}
        />
      )}

      {modal?.kind === 'create' && (
        <UserFormModal
          mode="create"
          onSave={handleCreate}
          onCancel={() => setModal(null)}
          saving={saving}
        />
      )}

      {modal?.kind === 'edit' && (
        <UserFormModal
          mode="edit"
          user={modal.user}
          onSave={handleUpdate}
          onCancel={() => setModal(null)}
          saving={saving}
        />
      )}

      {modal?.kind === 'delete' && (
        <ConfirmDialog
          message={`Benutzer „${modal.user.login}" wirklich löschen?`}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
