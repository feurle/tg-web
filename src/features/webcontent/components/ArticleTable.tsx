import { useTranslation } from 'react-i18next';
import type { ArticleResponse } from '../types';

interface Props {
  articles: ArticleResponse[];
  onEdit: (article: ArticleResponse) => void;
  onDelete: (article: ArticleResponse) => void;
}

export default function ArticleTable({ articles, onEdit, onDelete }: Props) {
  const { t } = useTranslation();

  if (articles.length === 0) {
    return <p>{t('article.empty')}</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
          <th style={th}>{t('article.col.title')}</th>
          <th style={th}>{t('article.col.page')}</th>
          <th style={th}>{t('article.col.language')}</th>
          <th style={th}>{t('article.col.status')}</th>
          <th style={th}>{t('article.col.published')}</th>
          <th style={th}>{t('article.col.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((a) => (
          <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={td}>{a.title}</td>
            <td style={td}>{t(`article.page.${a.page}`, a.page)}</td>
            <td style={td}>{t(`article.language.${a.language}`, a.language)}</td>
            <td style={td}>{t(`article.state.${a.state}`, a.state)}</td>
            <td style={td}>
              {a.publishedDate
                ? new Date(a.publishedDate).toLocaleDateString('de-DE')
                : t('common.empty')}
            </td>
            <td style={td}>
              <button onClick={() => onEdit(a)} style={{ marginRight: '0.5rem' }}>
                {t('common.edit')}
              </button>
              <button onClick={() => onDelete(a)}>{t('common.delete')}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th: React.CSSProperties = { padding: '0.5rem 0.75rem' };
const td: React.CSSProperties = { padding: '0.5rem 0.75rem' };
