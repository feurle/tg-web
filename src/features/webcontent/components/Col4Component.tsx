import DOMPurify from 'dompurify';
import type { ArticleResponse } from '../types';

interface Props {
  article: ArticleResponse;
}

export default function Col4Component({ article }: Props) {
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
      <div className="contact-info-grid">
        {sorted.map((section) => (
          <div key={section.id} className="contact-info-col">
            <span className="contact-info-label"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.title) }} />
            <span className="contact-info-value"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }} />
          </div>
        ))}
      </div>
    </div>
  );
}
