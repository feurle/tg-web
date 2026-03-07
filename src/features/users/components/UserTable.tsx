import { useTranslation } from 'react-i18next';
import type { User } from '../types';

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, onEdit, onDelete }: Props) {
  const { t } = useTranslation();

  if (users.length === 0) {
    return <p style={{ color: '#666' }}>{t('user.empty')}</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
      <thead>
        <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
          <th style={th}>{t('user.col.login')}</th>
          <th style={th}>{t('user.col.name')}</th>
          <th style={th}>{t('user.col.email')}</th>
          <th style={th}>{t('user.col.roles')}</th>
          <th style={th}>{t('user.col.active')}</th>
          <th style={th}>{t('user.col.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={td}><code>{u.login}</code></td>
            <td style={td}>{[u.firstName, u.lastName].filter(Boolean).join(' ') || t('common.empty')}</td>
            <td style={td}>{u.email}</td>
            <td style={td}>{u.authorities.length > 0 ? u.authorities.join(', ') : t('common.empty')}</td>
            <td style={td}>
              <span style={{ color: u.activated ? 'green' : '#999' }}>
                {u.activated ? t('user.active.yes') : t('user.active.no')}
              </span>
            </td>
            <td style={td}>
              <button onClick={() => onEdit(u)} style={{ marginRight: '0.5rem' }}>
                {t('common.edit')}
              </button>
              <button onClick={() => onDelete(u)} style={{ color: 'red' }}>
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
