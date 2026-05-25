import DOMPurify from 'dompurify';
import type { ArticleResponse } from '../types';

interface Props {
  article: ArticleResponse;
}

export default function Col3Component({ article }: Props) {
  const sorted = [...article.sections].sort((a, b) => a.order - b.order);
  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.title) }} />
        {article.content && (
          <span className="section-sub"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
        )}
      </div>
      <div className="article-grid-3">
        {sorted.map((section) => (
          <div key={section.id} className="article-card">
            <div className="article-card-title"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.title) }} />
            <div className="article-content article-card-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }} />
          </div>
        ))}
      </div>
    </div>
  );
}
