import { useEffect, useState } from 'react';
import { articleApi, imageApi } from '../../features/webcontent/api';
import type {
  ArticleResponse,
  CreateArticleRequest,
  ImageResponse,
  UpdateArticleRequest,
} from '../../features/webcontent/types';
import ArticleTable from '../../features/webcontent/components/ArticleTable';
import ArticleFormModal from '../../features/webcontent/components/ArticleFormModal';
import ConfirmDialog from '../../features/customers/components/ConfirmDialog';
import { ApiError } from '../../lib/apiClient';

type Modal =
  | { kind: 'create' }
  | { kind: 'edit'; article: ArticleResponse }
  | { kind: 'delete'; article: ArticleResponse }
  | null;

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
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
      const [articleData, imageData] = await Promise.all([
        articleApi.getAll(),
        imageApi.getAll(),
      ]);
      setArticles(articleData);
      setImages(imageData);
    } catch {
      setError('Artikel konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: CreateArticleRequest) {
    setSaving(true);
    try {
      const created = await articleApi.create(data);
      setArticles((prev) => [...prev, created]);
      setModal(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Speichern fehlgeschlagen.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(data: UpdateArticleRequest) {
    if (modal?.kind !== 'edit') return;
    setSaving(true);
    try {
      const updated = await articleApi.update(modal.article.id, data);
      setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
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
      await articleApi.delete(modal.article.id);
      setArticles((prev) => prev.filter((a) => a.id !== modal.article.id));
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
        <h1 style={{ margin: 0 }}>Artikelverwaltung</h1>
        <button onClick={() => setModal({ kind: 'create' })}>+ Neuer Artikel</button>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <p>Laden…</p>
      ) : (
        <ArticleTable
          articles={articles}
          onEdit={(a) => setModal({ kind: 'edit', article: a })}
          onDelete={(a) => setModal({ kind: 'delete', article: a })}
        />
      )}

      {modal?.kind === 'create' && (
        <ArticleFormModal
          mode="create"
          images={images}
          onSave={handleCreate}
          onCancel={() => setModal(null)}
          saving={saving}
        />
      )}

      {modal?.kind === 'edit' && (
        <ArticleFormModal
          mode="edit"
          initial={modal.article}
          images={images}
          onSave={handleUpdate}
          onCancel={() => setModal(null)}
          saving={saving}
        />
      )}

      {modal?.kind === 'delete' && (
        <ConfirmDialog
          message={`Artikel „${modal.article.title}" wirklich löschen?`}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
