import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { articleApi } from '../../features/webcontent/api';
import type { ArticleResponse } from '../../features/webcontent/types';
import ArticleBlock from '../../features/webcontent/components/ArticleBlock';
import { resolveLanguage } from '../../features/webcontent/language';
import ContactButton from '../../features/webcontent/components/ContactButton';

export default function NewsPage() {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [fetchedLanguage, setFetchedLanguage] = useState<string | null>(null);
  const { t, i18n: i18nInstance } = useTranslation();
  const language = resolveLanguage(i18nInstance.language);
  const loading = fetchedLanguage !== language;

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      articleApi.getPublishedByPage('NEWS_TEASER', language),
      articleApi.getPublishedByPage('NEWS_PAGE', language),
    ])
      .then(([teasers, full]) => { if (!cancelled) { setArticles([...teasers, ...full]); setFetchedLanguage(language); } })
      .catch(() => { if (!cancelled) { setArticles([]); setFetchedLanguage(language); } });
    return () => { cancelled = true; };
  }, [language]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 60px)' }}>
      <div className="hero" style={{ paddingBottom: 32 }}>
        <h1 className="hero-title" style={{ fontSize: 36 }}>
          <strong>{t('pages.news')}</strong>
        </h1>
        <p className="hero-sub" style={{ marginBottom: 0 }}>
          {t('news.subtitle')}
        </p>
        <ContactButton/>
      </div>

      <div className="section">
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <div className="article-grid-1">
            {articles.map((article) => (
              <ArticleBlock key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
