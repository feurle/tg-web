import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {articleApi} from '../../features/webcontent/api';
import type {ArticleResponse} from '../../features/webcontent/types';
import ArticleCard from '../../features/webcontent/components/ArticleCard';
import {resolveLanguage} from '../../features/webcontent/language';
import AboutTeaser from "../../features/webcontent/components/AboutTeaser.tsx";

export default function HomePage() {
    const [teasers, setTeasers] = useState<ArticleResponse[]>([]);
    const [pages, setPages] = useState<ArticleResponse[]>([]);
    const [fetchedLanguage, setFetchedLanguage] = useState<string | null>(null);
    const {t, i18n: i18nInstance} = useTranslation();
    const language = resolveLanguage(i18nInstance.language);
    const loading = fetchedLanguage !== language;

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            articleApi.getPublishedByPage('HOME_TEASER', language),
            articleApi.getPublishedByPage('HOME_PAGE', language),
        ])
            .then(([teaserData, pageData]) => {
                if (!cancelled) {
                    setTeasers(teaserData);
                    setPages(pageData);
                    setFetchedLanguage(language);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setTeasers([]);
                    setPages([]);
                    setFetchedLanguage(language);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [language]);

    return (
        <div style={{background: 'var(--bg)', minHeight: 'calc(100vh - 60px)'}}>

            <div className="hero" style={{paddingBottom: 32}}>
                {!loading && teasers.map((article) => (
                    <AboutTeaser key={article.id} article={article}/>
                ))}
            </div>

            <div className="section">
                <div className="section-header">
                    <span className="section-title">{t('home.articles.title')}</span>
                    <span className="section-link">{t('home.articles.viewAll')} →</span>
                </div>
                {loading ? (
                    <p>{t('common.loading')}</p>
                ) : (
                    <div className="article-grid-3">
                        {pages.map((article) => (
                            <ArticleCard key={article.id} article={article}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
