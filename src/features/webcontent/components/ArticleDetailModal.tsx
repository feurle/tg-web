import DOMPurify from 'dompurify';
import type {ArticleResponse} from '../types';
import {imageApi} from '../api';

interface Props {
    article: ArticleResponse;
    onClose: () => void;
}

function splitContent(content: string, count: number): string[] {
    if (!content || count === 0) return [content || ''];

    const paragraphs = content.split(/(?<=<\/p>)/).filter(p => p.trim());
    if (paragraphs.length === 0) return [content];

    const perSegment = Math.ceil(paragraphs.length / count);
    return Array.from({length: count}, (_, i) =>
        paragraphs.slice(i * perSegment, (i + 1) * perSegment).join('')
    );
}

export default function ArticleDetailModal({article, onClose}: Props) {
    const {images, content} = article;
    const segments = splitContent(content ?? '', images.length);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-card"
                style={{maxWidth: 720, maxHeight: '85vh', overflowY: 'auto', padding: 40}}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20}}>
                    <div>
                        {article.tags.length > 0 && (
                            <div className="article-card-tags" style={{marginBottom: 8}}>
                                {article.tags.map((tag) => (
                                    <span key={tag.id} className="badge badge-green">{tag.name}</span>
                                ))}
                            </div>
                        )}
                        <h2 style={{margin: 0, fontSize: 22, color: 'var(--text-primary)'}}>{article.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-secondary)', marginLeft: 16, flexShrink: 0}}
                        aria-label="Schließen"
                    >
                        ✕
                    </button>
                </div>

                {images.length === 0 && content && (
                    <div
                        className="article-card-excerpt"
                        style={{lineHeight: 1.7}}
                        dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}}
                    />
                )}

                {images.length === 1 && (
                    <div style={{overflow: 'hidden'}}>
                        <img
                            src={imageApi.getDownloadUrl(images[0].id)}
                            alt={images[0].fileName}
                            title={images[0].fileName}
                            style={{float: 'left', width: '40%', height: 'auto', borderRadius: 8, marginRight: 24, marginBottom: 8}}
                        />
                        {content && (
                            <div
                                className="article-card-excerpt"
                                style={{lineHeight: 1.7}}
                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}}
                            />
                        )}
                    </div>
                )}

                {images.length > 1 && (
                    images.map((image, index) => (
                        <div
                            key={image.id}
                            style={{
                                display: 'flex',
                                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                                gap: 24,
                                marginBottom: 24,
                                alignItems: 'flex-start',
                            }}
                        >
                            <img
                                src={imageApi.getDownloadUrl(image.id)}
                                alt={image.fileName}
                                title={image.fileName}
                                style={{width: '40%', height: 'auto', borderRadius: 8, flexShrink: 0}}
                            />
                            {segments[index] && (
                                <div
                                    className="article-card-excerpt"
                                    style={{lineHeight: 1.7, flex: 1}}
                                    dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(segments[index])}}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
