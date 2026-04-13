import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {articleApi} from '../../features/webcontent/api';
import type {ArticleResponse} from '../../features/webcontent/types';
import ServiceCard from '../../features/webcontent/components/ServiceCard';
import {resolveLanguage} from '../../features/webcontent/language';
import Teaser from '../../features/webcontent/components/Teaser';
import ContactButton from '../../features/webcontent/components/ContactButton';
import ContactInfo from '../../features/contact/components/ContactInfo';

export default function HomePage() {
    const [teasers, setTeasers] = useState<ArticleResponse[]>([]);
    const [articles, setArticles] = useState<ArticleResponse[]>([]);
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
                    setArticles(pageData);
                    setFetchedLanguage(language);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setTeasers([]);
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

            <div className="hero" style={{paddingBottom: 32}}>
                {!loading && teasers.map((article) => (
                    <Teaser key={article.id} article={article}/>
                ))}
                <ContactButton/>
            </div>

            <div className="section">
                <div className="section-header">
                    <span className="section-title">{t('home.articles.title')}</span>
                    <span className="section-sub">{t('home.articles.sub')}</span>
                </div>
                {loading ? (
                    <p>{t('common.loading')}</p>
                ) : (
                    <div className="article-grid-3">
                        {articles.map((article) => (
                            <ServiceCard key={article.id} article={article} />
                        ))}
                    </div>
                )}
            </div>

            <ContactInfo />


        </div>
    );
}
