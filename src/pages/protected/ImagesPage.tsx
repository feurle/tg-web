import { useEffect, useState } from 'react';
import { imageApi } from '../../features/webcontent/api';
import type { ImageResponse } from '../../features/webcontent/types';
import ImageGrid from '../../features/webcontent/components/ImageGrid';
import ImageUploadModal from '../../features/webcontent/components/ImageUploadModal';
import ConfirmDialog from '../../features/customers/components/ConfirmDialog';
import { ApiError } from '../../lib/apiClient';

type Modal =
  | { kind: 'upload' }
  | { kind: 'delete'; image: ImageResponse }
  | null;

export default function ImagesPage() {
  const [images, setImages] = useState<ImageResponse[]>([]);
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
      const data = await imageApi.getAll();
      setImages(data);
    } catch {
      setError('Bilder konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file: File) {
    setSaving(true);
    try {
      const created = await imageApi.upload(file);
      setImages((prev) => [...prev, created]);
      setModal(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Hochladen fehlgeschlagen.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (modal?.kind !== 'delete') return;
    setSaving(true);
    try {
      await imageApi.delete(modal.image.id);
      setImages((prev) => prev.filter((img) => img.id !== modal.image.id));
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
        <h1 style={{ margin: 0 }}>Bildverwaltung</h1>
        <button onClick={() => setModal({ kind: 'upload' })}>+ Bild hochladen</button>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <p>Laden…</p>
      ) : (
        <ImageGrid
          images={images}
          onDelete={(img) => setModal({ kind: 'delete', image: img })}
        />
      )}

      {modal?.kind === 'upload' && (
        <ImageUploadModal
          onUpload={handleUpload}
          onCancel={() => setModal(null)}
          saving={saving}
        />
      )}

      {modal?.kind === 'delete' && (
        <ConfirmDialog
          message={`Bild „${modal.image.fileName}" wirklich löschen?`}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
