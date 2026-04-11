import DOMPurify from 'dompurify';
import type {ArticleResponse} from '../types';
import {imageApi} from '../api';

interface Props {
    article: ArticleResponse;
    onClose: () => void;
}

export default function ArticleDetailModal({article, onClose}: Props) {
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

                {article.images.length > 0 && (
                    <div style={{marginBottom: 20}}>
                        {article.images.map((image) => (
                            <img
                                key={image.id}
                                src={imageApi.getDownloadUrl(image.id)}
                                alt={image.fileName}
                                title={image.fileName}
                                style={{maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 8, borderRadius: 8}}
                            />
                        ))}
                    </div>
                )}

                {article.content && (
                    <div
                        className="article-card-excerpt"
                        style={{lineHeight: 1.7}}
                        dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.content)}}
                    />
                )}
            </div>
        </div>
    );
}
