import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {articleApi} from '../../features/webcontent/api';
import type {ArticleResponse} from '../../features/webcontent/types';
import {resolveLanguage} from '../../features/webcontent/language';
import HeroComponent from '../../features/webcontent/components/HeroComponent.tsx';
import Col3Component from '../../features/webcontent/components/Col3Component.tsx';
import Col4Component from '../../features/webcontent/components/Col4Component.tsx';
import ContactButton from '../../features/webcontent/components/ContactButton';
import ArticleBlock from "../../features/webcontent/components/ArticleBlock.tsx";

export default function HomePage() {
    const [articles, setArticles] = useState<ArticleResponse[]>([]);
    const [fetchedLanguage, setFetchedLanguage] = useState<string | null>(null);
    const {i18n: i18nInstance} = useTranslation();
    const language = resolveLanguage(i18nInstance.language);
    const loading = fetchedLanguage !== language;

    useEffect(() => {
        let cancelled = false;
        articleApi.getPublishedByPage('home', language)
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
        <div style={{background: 'var(--bg)', minHeight: 'calc(100vh - 60px)'}}>
            {!loading && articles.map((article) => {
                if (article.articleType === 'HERO') return <HeroComponent key={article.id} article={article} />;
                if (article.articleType === 'COL3') return <Col3Component key={article.id} article={article} />;
                if (article.articleType === 'COL4') return <Col4Component key={article.id} article={article} />;
                if (article.articleType === 'TEXT') return <ArticleBlock key={article.id} article={article} />;
                return null;
            })}

            <div className="hero">
                <ContactButton/>
            </div>
        </div>
    );
}
