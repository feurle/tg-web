import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { articleApi, imageApi } from '../../features/webcontent/api';
import type {
  ArticleResponse,
  CreateArticleRequest,
  ImageResponse,
  UpdateArticleRequest,
} from '../../features/webcontent/types';
import ArticleTable from '../../features/webcontent/components/ArticleTable';
import ArticleFormModal from '../../features/webcontent/components/ArticleFormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
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
  const { t } = useTranslation();

  useEffect(() => {
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
        setError(t('article.loadError'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [t]);

  async function handleCreate(data: CreateArticleRequest) {
    setSaving(true);
    try {
      const created = await articleApi.create(data);
      setArticles((prev) => [...prev, created]);
      setModal(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t('common.saveError');
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
      const message = err instanceof ApiError ? err.message : t('common.saveError');
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
      setError(t('common.deleteError'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>{t('article.management')}</h1>
        <button onClick={() => setModal({ kind: 'create' })}>{t('article.new')}</button>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <p>{t('common.loading')}</p>
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
          message={t('article.deleteConfirm', { title: modal.article.title })}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
