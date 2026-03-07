import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Customer, CustomerFormData } from '../types';

interface Props {
  initial: Customer | null;
  onSave: (data: CustomerFormData) => void;
  onCancel: () => void;
  saving: boolean;
}

const EMPTY: CustomerFormData = {
  firstName: '', lastName: '', email: '',
  phone: '', address: '', city: '', state: '', zip: '', country: '',
};

function toFormData(c: Customer): CustomerFormData {
  return {
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone ?? '',
    address: c.address ?? '',
    city: c.city ?? '',
    state: c.state ?? '',
    zip: c.zip ?? '',
    country: c.country ?? '',
  };
}

export default function CustomerFormModal({ initial, onSave, onCancel, saving }: Props) {
  const [form, setForm] = useState<CustomerFormData>(initial ? toFormData(initial) : EMPTY);
  const { t } = useTranslation();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  const isEdit = initial !== null;

  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1rem' }}>{isEdit ? t('customer.editHeading') : t('customer.newHeading')}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={row}>
            <Field label={t('customer.form.firstName')} name="firstName" value={form.firstName} onChange={handleChange} required />
            <Field label={t('customer.form.lastName')} name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
          <Field label={t('customer.form.email')} name="email" value={form.email} onChange={handleChange} required type="email" />
          <Field label={t('customer.form.phone')} name="phone" value={form.phone} onChange={handleChange} />
          <Field label={t('customer.form.address')} name="address" value={form.address} onChange={handleChange} />
          <div style={row}>
            <Field label={t('customer.form.zip')} name="zip" value={form.zip} onChange={handleChange} />
            <Field label={t('customer.form.city')} name="city" value={form.city} onChange={handleChange} />
          </div>
          <div style={row}>
            <Field label={t('customer.form.state')} name="state" value={form.state} onChange={handleChange} />
            <Field label={t('customer.form.country')} name="country" value={form.country} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onCancel} disabled={saving}>{t('common.cancel')}</button>
            <button type="submit" disabled={saving}>
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}

function Field({ label, name, value, onChange, required, type = 'text' }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '2px' }}>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        style={{ padding: '0.35rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
      />
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
};

const modal: React.CSSProperties = {
  background: '#fff', padding: '2rem', borderRadius: '8px',
  width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
};

const row: React.CSSProperties = {
  display: 'flex', gap: '0.75rem',
};
