import { useTranslation } from 'react-i18next';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();

  return (
    <div style={overlay} onClick={onCancel}>
      <div style={dialog} onClick={(e) => e.stopPropagation()}>
        <p style={{ marginBottom: '1.5rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onCancel}>{t('common.cancel')}</button>
          <button onClick={onConfirm} style={{ color: 'white', background: 'red', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
};

const dialog: React.CSSProperties = {
  background: '#fff', padding: '1.5rem 2rem', borderRadius: '8px',
  minWidth: '320px', maxWidth: '480px',
};
