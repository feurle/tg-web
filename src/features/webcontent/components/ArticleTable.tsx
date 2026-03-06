import type { ArticleResponse } from '../types';

const PAGE_LABELS: Record<string, string> = {
  HOME_TEASER: 'Home Teaser',
  HOME_PAGE: 'Home',
  NEWS_TEASER: 'News Teaser',
  NEWS_PAGE: 'News',
};

const LANGUAGE_LABELS: Record<string, string> = {
  GERMAN: 'Deutsch',
  ENGLISH: 'Englisch',
  SWEDISH: 'Schwedisch',
  RUSSIAN: 'Russisch',
};

const STATE_LABELS: Record<string, string> = {
  CREATED: 'Erstellt',
  PUBLISHED: 'Veröffentlicht',
  CLOSED: 'Geschlossen',
};

interface Props {
  articles: ArticleResponse[];
  onEdit: (article: ArticleResponse) => void;
  onDelete: (article: ArticleResponse) => void;
}

export default function ArticleTable({ articles, onEdit, onDelete }: Props) {
  if (articles.length === 0) {
    return <p>Keine Artikel vorhanden.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
          <th style={th}>Titel</th>
          <th style={th}>Seite</th>
          <th style={th}>Sprache</th>
          <th style={th}>Status</th>
          <th style={th}>Veröffentlicht</th>
          <th style={th}>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((a) => (
          <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={td}>{a.title}</td>
            <td style={td}>{PAGE_LABELS[a.page] ?? a.page}</td>
            <td style={td}>{LANGUAGE_LABELS[a.language] ?? a.language}</td>
            <td style={td}>{STATE_LABELS[a.state] ?? a.state}</td>
            <td style={td}>
              {a.publishedDate
                ? new Date(a.publishedDate).toLocaleDateString('de-DE')
                : '—'}
            </td>
            <td style={td}>
              <button onClick={() => onEdit(a)} style={{ marginRight: '0.5rem' }}>
                Bearbeiten
              </button>
              <button onClick={() => onDelete(a)}>Löschen</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th: React.CSSProperties = { padding: '0.5rem 0.75rem' };
const td: React.CSSProperties = { padding: '0.5rem 0.75rem' };
