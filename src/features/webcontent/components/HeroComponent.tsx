import DOMPurify from 'dompurify';
import type {ArticleResponse} from '../types.ts';
import {imageApi} from '../api.ts';

interface Props {
    article: ArticleResponse;
}

export default function HeroComponent({article}: Props) {
    return (
        <div className="hero">
            {article.tags.length > 0 && (
                <div className="hero-tag"><span>🌿</span>
                    {article.tags.map((tag) => (
                        <span key={tag.id} className="badge badge-green">{tag.name}</span>
                    ))}
                </div>
            )}
            <h1 className="hero-title">
                <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title)}}/>
            </h1>
            {article.images.length > 0 && (
                <div style={{marginBottom: 16, textAlign: 'center'}}>
                    {article.images.map((image) => (
                        <img
                            key={image.id}
                            src={imageApi.getDownloadUrl(image.id)}
                            alt={image.fileName}
                            title={image.fileName}
                            style={{maxWidth: '100%', height: 'auto', display: 'inline-block', marginBottom: 8}}
                        />
                    ))}
                </div>
            )}
            {article.content && (
                <p className="hero-sub" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.content)}}/>
            )}
        </div>
    );
}
