import type { ArticleResponse } from '../types';
import DOMPurify from "dompurify";

interface Props {
  article: ArticleResponse;
  onClick?: () => void;
}

export default function ArticleCard({ article, onClick }: Readonly<Props>) {
  // Extract excerpt from content (first 150 chars)
  const rawExcerpt = article.content?.split('\n')[0]?.substring(0, 150) || '';
  const excerpt = rawExcerpt ? rawExcerpt + ' ...' : '';

  // Format date if it exists
  const dateStr = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '';

  return (
    <div className="article-card" onClick={onClick} style={onClick ? {cursor: 'pointer'} : undefined}>
      {article.tags.length > 0 && (
        <div className="article-card-tags">
          {article.tags.map((tag) => (
            <span key={tag.id} className="badge badge-green">{tag.name}</span>
          ))}
        </div>
      )}
      <div className="article-card-title">{article.title}</div>
      <div className="article-content article-card-content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(excerpt)}} />
      {dateStr && <div className="article-card-date">{dateStr}</div>}
    </div>
  );
}
