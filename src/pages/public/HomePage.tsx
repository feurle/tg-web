import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { articleApi } from '../../features/webcontent/api';
import type { ArticleResponse } from '../../features/webcontent/types';
import ArticleCard from '../../features/webcontent/components/ArticleCard';
import { resolveLanguage } from '../../features/webcontent/language';

export default function HomePage() {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [fetchedLanguage, setFetchedLanguage] = useState<string | null>(null);
  const { t, i18n: i18nInstance } = useTranslation();
  const language = resolveLanguage(i18nInstance.language);
  const loading = fetchedLanguage !== language;

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      articleApi.getPublishedByPage('HOME_TEASER', language),
      articleApi.getPublishedByPage('HOME_PAGE', language),
    ])
      .then(([teasers, full]) => { if (!cancelled) { setArticles([...teasers, ...full]); setFetchedLanguage(language); } })
      .catch(() => { if (!cancelled) { setArticles([]); setFetchedLanguage(language); } });
    return () => { cancelled = true; };
  }, [language]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 60px)' }}>
      <div className="hero">
        <div className="hero-tag">
          <span>🌿</span> {t('home.tagline')}
        </div>
        <h1 className="hero-title">
          {t('home.title.line1')}<br />
          <strong>{t('home.title.line2')}</strong>
        </h1>
        <p className="hero-sub">
          {t('home.subtitle')}
        </p>
        <div className="hero-actions">
          <button className="btn-primary">{t('home.cta.primary')}</button>
          <button className="btn-secondary">{t('home.cta.secondary')}</button>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">{t('home.articles.title')}</span>
          <span className="section-link">{t('home.articles.viewAll')} →</span>
        </div>
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
