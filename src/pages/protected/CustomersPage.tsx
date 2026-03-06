import { useEffect, useState } from 'react';
import { customerApi } from '../../features/customers/api';
import type { Customer, CustomerFormData } from '../../features/customers/types';
import CustomerTable from '../../features/customers/components/CustomerTable';
import CustomerFormModal from '../../features/customers/components/CustomerFormModal';
import ConfirmDialog from '../../features/customers/components/ConfirmDialog';
import { ApiError } from '../../lib/apiClient';

type Modal =
  | { kind: 'create' }
  | { kind: 'edit'; customer: Customer }
  | { kind: 'delete'; customer: Customer }
  | null;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
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
      const data = await customerApi.getAll();
      setCustomers(data);
    } catch {
      setError('Kunden konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(data: CustomerFormData) {
    setSaving(true);
    try {
      if (modal?.kind === 'edit') {
        const updated = await customerApi.update(modal.customer.id, data);
        setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await customerApi.create(data);
        setCustomers((prev) => [...prev, created]);
      }
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
      await customerApi.delete(modal.customer.id);
      setCustomers((prev) => prev.filter((c) => c.id !== modal.customer.id));
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
        <h1 style={{ margin: 0 }}>Kundenverwaltung</h1>
        <button onClick={() => setModal({ kind: 'create' })}>+ Neuer Kunde</button>
      </div>

      {error && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
      )}

      {loading ? (
        <p>Laden…</p>
      ) : (
        <CustomerTable
          customers={customers}
          onEdit={(c) => setModal({ kind: 'edit', customer: c })}
          onDelete={(c) => setModal({ kind: 'delete', customer: c })}
        />
      )}

      {(modal?.kind === 'create' || modal?.kind === 'edit') && (
        <CustomerFormModal
          initial={modal.kind === 'edit' ? modal.customer : null}
          onSave={handleSave}
          onCancel={() => setModal(null)}
          saving={saving}
        />
      )}

      {modal?.kind === 'delete' && (
        <ConfirmDialog
          message={`Kunde „${modal.customer.firstName} ${modal.customer.lastName}" wirklich löschen?`}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
