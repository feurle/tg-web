import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {articleApi} from '../../features/webcontent/api';
import type {ArticleResponse} from '../../features/webcontent/types';
import ArticleBlock from '../../features/webcontent/components/ArticleBlock';
import Teaser from '../../features/webcontent/components/Teaser';
import ContactButton from '../../features/webcontent/components/ContactButton';
import {resolveLanguage} from '../../features/webcontent/language';

export default function AboutPage() {
    const [teasers, setTeasers] = useState<ArticleResponse[]>([]);
    const [pages, setPages] = useState<ArticleResponse[]>([]);
    const [fetchedLanguage, setFetchedLanguage] = useState<string | null>(null);
    const {t, i18n: i18nInstance} = useTranslation();
    const language = resolveLanguage(i18nInstance.language);
    const loading = fetchedLanguage !== language;

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            articleApi.getPublishedByPage('ABOUT_TEASER', language),
            articleApi.getPublishedByPage('ABOUT_PAGE', language),
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
                    <Teaser key={article.id} article={article}/>
                ))}
                <ContactButton/>
            </div>

            <div className="section">
                {loading ? (
                    <p>{t('common.loading')}</p>
                ) : (
                    <div className="article-grid-1">
                        {pages.map((article) => (
                            <ArticleBlock key={article.id} article={article}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
