import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { articleApi } from '../../features/webcontent/api';
import type { ArticleResponse } from '../../features/webcontent/types';
import ArticleCard from '../../features/webcontent/components/ArticleCard';
import { resolveLanguage } from '../../features/webcontent/language';

export default function NewsPage() {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n: i18nInstance } = useTranslation();
  const language = resolveLanguage(i18nInstance.language);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      articleApi.getPublishedByPage('NEWS_TEASER', language),
      articleApi.getPublishedByPage('NEWS_PAGE', language),
    ])
      .then(([teasers, full]) => setArticles([...teasers, ...full]))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [language]);

  return (
    <div>
      <h1>{t('pages.news')}</h1>
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))
      )}
    </div>
  );
}
