import type { User } from '../types';

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, onEdit, onDelete }: Props) {
  if (users.length === 0) {
    return <p style={{ color: '#666' }}>Keine Benutzer vorhanden.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
      <thead>
        <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
          <th style={th}>Login</th>
          <th style={th}>Name</th>
          <th style={th}>E-Mail</th>
          <th style={th}>Rollen</th>
          <th style={th}>Aktiv</th>
          <th style={th}>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={td}><code>{u.login}</code></td>
            <td style={td}>{[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}</td>
            <td style={td}>{u.email}</td>
            <td style={td}>{u.authorities.length > 0 ? u.authorities.join(', ') : '—'}</td>
            <td style={td}>
              <span style={{ color: u.activated ? 'green' : '#999' }}>
                {u.activated ? 'Ja' : 'Nein'}
              </span>
            </td>
            <td style={td}>
              <button onClick={() => onEdit(u)} style={{ marginRight: '0.5rem' }}>
                Bearbeiten
              </button>
              <button onClick={() => onDelete(u)} style={{ color: 'red' }}>
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
