import type { ArticleResponse } from '../types';
import { imageApi } from '../api';

interface Props {
  article: ArticleResponse;
}

export default function ArticleBlock({ article }: Props) {
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
      {article.images.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {article.images.map((image) => (
            <img
              key={image.id}
              src={imageApi.getDownloadUrl(image.id)}
              alt={image.fileName}
              style={{ maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 8 }}
            />
          ))}
        </div>
      )}
      {article.tags.length > 0 && (
        <div className="article-card-tags">
          {article.tags.map((tag) => (
            <span key={tag.id} className="badge badge-green">{tag.name}</span>
          ))}
        </div>
      )}
      <div className="article-card-title">{article.title}</div>
      <div style={{ whiteSpace: 'pre-wrap' }}>{article.content}</div>
      {dateStr && <div className="article-card-date">{dateStr}</div>}
    </div>
  );
}
