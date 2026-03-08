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
    return (
      <div style={{ margin: '0 32px' }}>
        <p style={{ color: 'var(--text-muted)' }}>{t('article.empty')}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>{t('article.col.title')}</th>
            <th>{t('article.col.page')}</th>
            <th>{t('article.col.language')}</th>
            <th>{t('article.col.status')}</th>
            <th>{t('article.col.published')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td style={{ fontWeight: 500 }}>{a.title}</td>
              <td className="td-secondary">{t(`article.page.${a.page}`, a.page)}</td>
              <td className="td-secondary">{t(`article.language.${a.language}`, a.language)}</td>
              <td className="td-secondary">{t(`article.state.${a.state}`, a.state)}</td>
              <td className="td-secondary">
                {a.publishedDate
                  ? new Date(a.publishedDate).toLocaleDateString('de-DE')
                  : t('common.empty')}
              </td>
              <td>
                <div className="row-actions">
                  <button onClick={() => onEdit(a)} className="icon-btn" title={t('common.edit')}>
                    ✏️
                  </button>
                  <button onClick={() => onDelete(a)} className="icon-btn danger" title={t('common.delete')}>
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
