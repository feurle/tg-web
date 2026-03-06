import { useEffect, useState } from 'react';
import { articleApi } from '../../features/webcontent/api';
import type { ArticleResponse } from '../../features/webcontent/types';
import ArticleCard from '../../features/webcontent/components/ArticleCard';

export default function HomePage() {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      articleApi.getPublishedByPage('HOME_TEASER'),
      articleApi.getPublishedByPage('HOME_PAGE'),
    ])
      .then(([teasers, full]) => setArticles([...teasers, ...full]))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Willkommen</h1>
      {loading ? (
        <p>Laden…</p>
      ) : (
        articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))
      )}
    </div>
  );
}
