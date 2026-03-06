import { imageApi } from '../api';
import type { ArticleResponse } from '../types';

interface Props {
  article: ArticleResponse;
}

export default function ArticleCard({ article }: Props) {
  return (
    <div style={card}>
      <h2 style={{ marginTop: 0, marginBottom: '0.75rem' }}>{article.title}</h2>
      <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 1rem' }}>{article.content}</p>
      {article.images.length > 0 && (
        <div style={imageRow}>
          {article.images.map((img) => (
            <img
              key={img.id}
              src={imageApi.getDownloadUrl(img.id)}
              alt={img.fileName}
              style={imgStyle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const card: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1.5rem',
  marginBottom: '1.5rem',
};

const imageRow: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
};

const imgStyle: React.CSSProperties = {
  maxWidth: '200px',
  maxHeight: '150px',
  objectFit: 'cover',
  borderRadius: '4px',
};
