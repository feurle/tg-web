import DOMPurify from 'dompurify';
import type {ArticleResponse} from '../types';
import {imageApi} from '../api';
import {splitContent} from '../utils';

interface Props {
    article: ArticleResponse;
    onClose: () => void;
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
                            <div className="article-modal-tags" style={{marginBottom: 8}}>
                                {article.tags.map((tag) => (
                                    <span key={tag.id} className="badge badge-green">{tag.name}</span>
                                ))}
                            </div>
                        )}
                        <h2 className="article-title">{article.title}</h2>
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
                        className="article-content article-modal-content"
                        style={{lineHeight: 1.7}}
                        dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}}
                    />
                )}

                {images.map((image, index) => {
                    const floatLeft = index % 2 === 0;
                    return (
                        <div key={image.id} style={{overflow: 'hidden', marginBottom: 24}}>
                            <img
                                src={imageApi.getDownloadUrl(image.id)}
                                alt={image.fileName}
                                title={image.fileName}
                                style={{
                                    float: floatLeft ? 'left' : 'right',
                                    width: '40%',
                                    height: 'auto',
                                    borderRadius: 8,
                                    marginRight: floatLeft ? 24 : 0,
                                    marginLeft: floatLeft ? 0 : 24,
                                    marginBottom: 8,
                                }}
                            />
                            {segments[index] && (
                                <div
                                    className="article-content article-modal-content"
                                    style={{lineHeight: 1.7}}
                                    dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(segments[index])}}
                                />
                            )}
                        </div>
                    );
                })}
                {[...article.sections]
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                        <div key={section.id} className="article-section">
                            {section.title && (
                                <h3 className="article-section-title">{section.title}</h3>
                            )}
                            {section.content && (
                                <div
                                    className="article-content article-modal-content"
                                    style={{ lineHeight: 1.7 }}
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }}
                                />
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}
