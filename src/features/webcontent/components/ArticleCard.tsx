import type { ArticleResponse } from '../types';

interface Props {
  article: ArticleResponse;
}

export default function ArticleCard({ article }: Props) {
  // Extract excerpt from content (first 150 chars)
  const excerpt = article.content?.split('\n')[0]?.substring(0, 150) || '';

  // Format date if it exists
  const dateStr = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '';

  return (
    <div className="article-card">
      <div className="article-card-title">{article.title}</div>
      <div className="article-card-excerpt">{excerpt}</div>
      {dateStr && <div className="article-card-date">{dateStr}</div>}
    </div>
  );
}
