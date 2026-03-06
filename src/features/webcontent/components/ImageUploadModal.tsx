import { useRef, useState } from 'react';

interface Props {
  onUpload: (file: File) => void;
  onCancel: () => void;
  saving: boolean;
}

export default function ImageUploadModal({ onUpload, onCancel, saving }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFile(e.target.files?.[0] ?? null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedFile) {
      onUpload(selectedFile);
    }
  }

  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1rem' }}>Bild hochladen</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={dropArea}
            onClick={() => inputRef.current?.click()}
          >
            {selectedFile ? (
              <span>{selectedFile.name}</span>
            ) : (
              <span style={{ color: '#888' }}>Datei auswählen…</span>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onCancel} disabled={saving}>Abbrechen</button>
            <button type="submit" disabled={!selectedFile || saving}>
              {saving ? 'Hochladen…' : 'Hochladen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
};

const modal: React.CSSProperties = {
  background: '#fff', padding: '2rem', borderRadius: '8px',
  width: '100%', maxWidth: '400px',
};

const dropArea: React.CSSProperties = {
  border: '2px dashed #ccc',
  borderRadius: '6px',
  padding: '2rem',
  textAlign: 'center',
  cursor: 'pointer',
};
