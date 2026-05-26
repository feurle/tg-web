import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { articleApi } from '../api';
import type { ArticleResponse } from '../types';
import { resolveLanguage } from '../language';
import HeroComponent from './HeroComponent';
import Col3Component from './Col3Component';
import Col4Component from './Col4Component';
import ArticleBlock from './ArticleBlock';
import ContactButton from './ContactButton';

interface Props {
    pageSlug: string;
}

export default function PublicPage({ pageSlug }: Props) {
    const [articles, setArticles] = useState<ArticleResponse[]>([]);
    const [fetchedLanguage, setFetchedLanguage] = useState<string | null>(null);
    const { i18n: i18nInstance } = useTranslation();
    const language = resolveLanguage(i18nInstance.language);
    const loading = fetchedLanguage !== language;

    useEffect(() => {
        let cancelled = false;
        setFetchedLanguage(null);
        articleApi.getPublishedByPage(pageSlug, language)
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
    }, [pageSlug, language]);

    return (
        <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 60px)' }}>
            {!loading && articles.map((article) => {
                if (article.articleType === 'HERO') return <HeroComponent key={article.id} article={article} />;
                if (article.articleType === 'COL3') return <Col3Component key={article.id} article={article} />;
                if (article.articleType === 'COL4') return <Col4Component key={article.id} article={article} />;
                if (article.articleType === 'TEXT') return <ArticleBlock key={article.id} article={article} />;
                return null;
            })}
            <div className="cta-section">
                <ContactButton />
            </div>
        </div>
    );
}
