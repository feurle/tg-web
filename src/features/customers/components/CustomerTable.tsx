import { useTranslation } from 'react-i18next';
import type { Customer } from '../types';

interface Props {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({ customers, onEdit, onDelete }: Props) {
  const { t } = useTranslation();

  if (customers.length === 0) {
    return <p style={{ color: '#666' }}>{t('customer.empty')}</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
      <thead>
        <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
          <th style={th}>{t('customer.col.name')}</th>
          <th style={th}>{t('customer.col.email')}</th>
          <th style={th}>{t('customer.col.phone')}</th>
          <th style={th}>{t('customer.col.city')}</th>
          <th style={th}>{t('customer.col.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={td}>{c.firstName} {c.lastName}</td>
            <td style={td}>{c.email}</td>
            <td style={td}>{c.phone ?? t('common.empty')}</td>
            <td style={td}>{c.city ?? t('common.empty')}</td>
            <td style={td}>
              <button onClick={() => onEdit(c)} style={{ marginRight: '0.5rem' }}>
                {t('common.edit')}
              </button>
              <button onClick={() => onDelete(c)} style={{ color: 'red' }}>
                {t('common.delete')}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderBottom: '2px solid #ddd',
  fontWeight: 600,
};

const td: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  verticalAlign: 'middle',
};
