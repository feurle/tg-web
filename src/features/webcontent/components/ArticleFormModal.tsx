import { useState } from 'react';
import type {
  ArticleResponse,
  ArticleState,
  CreateArticleRequest,
  ImageResponse,
  Language,
  PageType,
  UpdateArticleRequest,
} from '../types';

interface CreateProps {
  mode: 'create';
  initial?: undefined;
  images: ImageResponse[];
  onSave: (data: CreateArticleRequest) => void;
  onCancel: () => void;
  saving: boolean;
}

interface EditProps {
  mode: 'edit';
  initial: ArticleResponse;
  images: ImageResponse[];
  onSave: (data: UpdateArticleRequest) => void;
  onCancel: () => void;
  saving: boolean;
}

type Props = CreateProps | EditProps;

const PAGE_OPTIONS: { value: PageType; label: string }[] = [
  { value: 'HOME_TEASER', label: 'Home Teaser' },
  { value: 'HOME_PAGE', label: 'Home' },
  { value: 'NEWS_TEASER', label: 'News Teaser' },
  { value: 'NEWS_PAGE', label: 'News' },
];

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'GERMAN', label: 'Deutsch' },
  { value: 'ENGLISH', label: 'Englisch' },
  { value: 'SWEDISH', label: 'Schwedisch' },
  { value: 'RUSSIAN', label: 'Russisch' },
];

const STATE_OPTIONS: { value: ArticleState; label: string }[] = [
  { value: 'CREATED', label: 'Erstellt' },
  { value: 'PUBLISHED', label: 'Veröffentlicht' },
  { value: 'CLOSED', label: 'Geschlossen' },
];

export default function ArticleFormModal(props: Props) {
  const { mode, images, onCancel, saving } = props;
  const initial = mode === 'edit' ? props.initial : null;

  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [page, setPage] = useState<PageType>(initial?.page ?? 'HOME_TEASER');
  const [language, setLanguage] = useState<Language>(initial?.language ?? 'GERMAN');
  const [state, setState] = useState<ArticleState>(initial?.state ?? 'CREATED');
  const [selectedImageIds, setSelectedImageIds] = useState<Set<number>>(
    new Set(initial?.images.map((i) => i.id) ?? []),
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const imageIds = Array.from(selectedImageIds);
    if (mode === 'create') {
      props.onSave({ title, content, page, language, imageIds });
    } else {
      props.onSave({ title, content, state, language, imageIds });
    }
  }

  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1rem' }}>
          {mode === 'create' ? 'Neuer Artikel' : 'Artikel bearbeiten'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={labelStyle}>
            Titel *
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Inhalt *
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </label>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <label style={{ ...labelStyle, flex: 1 }}>
              Seite
              <select
                value={page}
                onChange={(e) => setPage(e.target.value as PageType)}
                disabled={mode === 'edit'}
                style={inputStyle}
              >
                {PAGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>

            <label style={{ ...labelStyle, flex: 1 }}>
              Sprache
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                style={inputStyle}
              >
                {LANGUAGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>

            {mode === 'edit' && (
              <label style={{ ...labelStyle, flex: 1 }}>
                Status
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value as ArticleState)}
                  style={inputStyle}
                >
                  {STATE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {images.length > 0 && (
            <fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '0.5rem 0.75rem' }}>
              <legend style={{ fontSize: '0.8rem', fontWeight: 500 }}>Bilder</legend>
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

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onCancel} disabled={saving}>Abbrechen</button>
            <button type="submit" disabled={saving}>
              {saving ? 'Speichern…' : 'Speichern'}
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
