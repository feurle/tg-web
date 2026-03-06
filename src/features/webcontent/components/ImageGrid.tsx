import { imageApi } from '../api';
import type { ImageResponse } from '../types';

interface Props {
  images: ImageResponse[];
  onDelete: (image: ImageResponse) => void;
}

export default function ImageGrid({ images, onDelete }: Props) {
  if (images.length === 0) {
    return <p>Keine Bilder vorhanden.</p>;
  }

  return (
    <div style={grid}>
      {images.map((img) => (
        <div key={img.id} style={tile}>
          <img
            src={imageApi.getDownloadUrl(img.id)}
            alt={img.fileName}
            style={imgStyle}
          />
          <p style={fileName} title={img.fileName}>{img.fileName}</p>
          <button onClick={() => onDelete(img)} style={{ width: '100%' }}>
            Löschen
          </button>
        </div>
      ))}
    </div>
  );
}

const grid: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
};

const tile: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '6px',
  padding: '0.75rem',
  width: '180px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const imgStyle: React.CSSProperties = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '4px',
};

const fileName: React.CSSProperties = {
  margin: 0,
  fontSize: '0.8rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
