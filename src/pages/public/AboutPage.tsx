import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { articleApi } from '../../features/webcontent/api';
import type { ArticleResponse } from '../../features/webcontent/types';
import ArticleBlock from '../../features/webcontent/components/ArticleBlock';
import { resolveLanguage } from '../../features/webcontent/language';

export default function AboutPage() {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [fetchedLanguage, setFetchedLanguage] = useState<string | null>(null);
  const { t, i18n: i18nInstance } = useTranslation();
  const language = resolveLanguage(i18nInstance.language);
  const loading = fetchedLanguage !== language;

  useEffect(() => {
    let cancelled = false;
    articleApi.getPublishedByPage('ABOUT_PAGE', language)
      .then((articles) => {
        if (!cancelled) {
          setArticles(articles);
          setFetchedLanguage(language);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setArticles([]);
          setFetchedLanguage(language);
        }
      });
    return () => { cancelled = true; };
  }, [language]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 60px)' }}>
      <div className="hero" style={{ paddingBottom: 32 }}>
        <h1 className="hero-title" style={{ fontSize: 36 }}>
          <strong>{t('pages.about')}</strong>
        </h1>
        <p className="hero-sub" style={{ marginBottom: 0 }}>
          {t('about.subtitle')}
        </p>
      </div>

      <div className="section">
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <div className="article-grid" style={{ gridTemplateColumns: '1fr' }}>
            {articles.map((article) => (
              <ArticleBlock key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
