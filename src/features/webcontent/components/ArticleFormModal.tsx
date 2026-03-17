import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '../../../components/RichTextEditor';
import type {
  ArticleResponse,
  ArticleState,
  CreateArticleRequest,
  ImageResponse,
  Language,
  PageType,
  TagResponse,
  UpdateArticleRequest,
} from '../types';

interface CreateProps {
  mode: 'create';
  initial?: undefined;
  images: ImageResponse[];
  tags: TagResponse[];
  onSave: (data: CreateArticleRequest) => void;
  onCancel: () => void;
  saving: boolean;
}

interface EditProps {
  mode: 'edit';
  initial: ArticleResponse;
  images: ImageResponse[];
  tags: TagResponse[];
  onSave: (data: UpdateArticleRequest) => void;
  onCancel: () => void;
  saving: boolean;
}

type Props = CreateProps | EditProps;

const PAGE_VALUES: PageType[] = ['HOME_TEASER', 'HOME_PAGE', 'NEWS_TEASER', 'NEWS_PAGE', 'ABOUT_TEASER', 'ABOUT_PAGE'];
const LANGUAGE_VALUES: Language[] = ['GERMAN', 'ENGLISH', 'SWEDISH', 'RUSSIAN'];
const STATE_VALUES: ArticleState[] = ['CREATED', 'PUBLISHED', 'CLOSED'];

export default function ArticleFormModal(props: Props) {
  const { mode, images, tags, onCancel, saving } = props;
  const initial = mode === 'edit' ? props.initial : null;
  const { t } = useTranslation();

  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [page, setPage] = useState<PageType>(initial?.page ?? 'HOME_TEASER');
  const [language, setLanguage] = useState<Language>(initial?.language ?? 'GERMAN');
  const [state, setState] = useState<ArticleState>(initial?.state ?? 'CREATED');
  const [selectedImageIds, setSelectedImageIds] = useState<Set<number>>(
    new Set(initial?.images.map((i) => i.id) ?? []),
  );
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(
    new Set(initial?.tags.map((tg) => tg.id) ?? []),
  );

  function toggleImage(id: number) {
    setSelectedImageIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleTag(id: number) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const imageIds = Array.from(selectedImageIds);
    const tagIds = Array.from(selectedTagIds);
    if (mode === 'create') {
      props.onSave({ title, content, page, language, imageIds, tagIds });
    } else {
      props.onSave({ title, content, state, language, imageIds, tagIds });
    }
  }

  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1rem' }}>
          {mode === 'create' ? t('article.newHeading') : t('article.editHeading')}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={labelStyle}>
            {t('article.form.title')}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            {t('article.form.content')}
            <RichTextEditor value={content} onChange={setContent} />
          </label>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <label style={{ ...labelStyle, flex: 1 }}>
              {t('article.form.page')}
              <select
                value={page}
                onChange={(e) => setPage(e.target.value as PageType)}
                disabled={mode === 'edit'}
                style={inputStyle}
              >
                {PAGE_VALUES.map((v) => (
                  <option key={v} value={v}>{t(`article.page.${v}`)}</option>
                ))}
              </select>
            </label>

            <label style={{ ...labelStyle, flex: 1 }}>
              {t('article.form.language')}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                style={inputStyle}
              >
                {LANGUAGE_VALUES.map((v) => (
                  <option key={v} value={v}>{t(`article.language.${v}`)}</option>
                ))}
              </select>
            </label>

            {mode === 'edit' && (
              <label style={{ ...labelStyle, flex: 1 }}>
                {t('article.form.status')}
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value as ArticleState)}
                  style={inputStyle}
                >
                  {STATE_VALUES.map((v) => (
                    <option key={v} value={v}>{t(`article.state.${v}`)}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {images.length > 0 && (
            <fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '0.5rem 0.75rem' }}>
              <legend style={{ fontSize: '0.8rem', fontWeight: 500 }}>{t('article.form.images')}</legend>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: '150px', overflowY: 'auto' }}>
                {images.map((img) => (
                  <label key={img.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedImageIds.has(img.id)}
                      onChange={() => toggleImage(img.id)}
                    />
                    <span style={{ fontSize: '0.875rem' }}>{img.fileName}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {tags.length > 0 && (
            <fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '0.5rem 0.75rem' }}>
              <legend style={{ fontSize: '0.8rem', fontWeight: 500 }}>{t('article.form.tags')}</legend>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '4px',
                      border: selectedTagIds.has(tag.id) ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: selectedTagIds.has(tag.id) ? 'var(--accent-light)' : 'transparent',
                      color: selectedTagIds.has(tag.id) ? 'var(--accent)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: selectedTagIds.has(tag.id) ? 600 : 400,
                    }}
                  >
                    {selectedTagIds.has(tag.id) ? '✓ ' : ''}{tag.name}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onCancel} disabled={saving} className="btn-secondary">
              {t('common.cancel')}
            </button>
            <button type="submit" disabled={saving} className="btn-accent">
              {saving ? t('common.saving') : t('common.save')}
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
  width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto',
};

const labelStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 500, gap: '2px',
};

const inputStyle: React.CSSProperties = {
  padding: '0.35rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem',
};
