import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { articleApi } from '../../features/webcontent/api';
import type { ArticleResponse } from '../../features/webcontent/types';
import { resolveLanguage } from '../../features/webcontent/language';
import ArticleCard from '../../features/webcontent/components/ArticleCard';
import ArticleDetailModal from '../../features/webcontent/components/ArticleDetailModal';
import ContactButton from '../../features/webcontent/components/ContactButton';
import PageSkeleton from '../../components/PageSkeleton';

export default function NewsPage() {
    const [articles, setArticles] = useState<ArticleResponse[]>([]);
    const [selected, setSelected] = useState<ArticleResponse | null>(null);
    const [fetchedLanguage, setFetchedLanguage] = useState<string | null>(null);
    const { i18n: i18nInstance } = useTranslation();
    const language = resolveLanguage(i18nInstance.language);
    const loading = fetchedLanguage !== language;

    useEffect(() => {
        let cancelled = false;
        setFetchedLanguage(null);
        articleApi.getPublishedByPage('news', language)
            .then((data) => {
                if (!cancelled) {
                    setArticles([...data].sort((a, b) => a.order - b.order));
                    setFetchedLanguage(language);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setArticles([]);
                    setFetchedLanguage(language);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [language]);

    return (
        <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 72px)' }}>
            <div className="news-feed">
                {loading && <PageSkeleton />}
                {!loading && (
                    <div className="article-grid-2">
                        {articles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                                onClick={() => setSelected(article)}
                            />
                        ))}
                    </div>
                )}
            </div>
            {selected && (
                <ArticleDetailModal article={selected} onClose={() => setSelected(null)} />
            )}
            <div className="cta-section">
                <ContactButton />
            </div>
        </div>
    );
}
