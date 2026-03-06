import type { Customer } from '../types';

interface Props {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({ customers, onEdit, onDelete }: Props) {
  if (customers.length === 0) {
    return <p style={{ color: '#666' }}>Keine Kunden vorhanden.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
      <thead>
        <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
          <th style={th}>Name</th>
          <th style={th}>E-Mail</th>
          <th style={th}>Telefon</th>
          <th style={th}>Ort</th>
          <th style={th}>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={td}>{c.firstName} {c.lastName}</td>
            <td style={td}>{c.email}</td>
            <td style={td}>{c.phone ?? '—'}</td>
            <td style={td}>{c.city ?? '—'}</td>
            <td style={td}>
              <button onClick={() => onEdit(c)} style={{ marginRight: '0.5rem' }}>
                Bearbeiten
              </button>
              <button onClick={() => onDelete(c)} style={{ color: 'red' }}>
                Löschen
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
