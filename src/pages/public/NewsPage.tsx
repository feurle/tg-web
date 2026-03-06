import { useEffect, useState } from 'react';
import { articleApi } from '../../features/webcontent/api';
import type { ArticleResponse } from '../../features/webcontent/types';
import ArticleCard from '../../features/webcontent/components/ArticleCard';

export default function NewsPage() {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      articleApi.getPublishedByPage('NEWS_TEASER'),
      articleApi.getPublishedByPage('NEWS_PAGE'),
    ])
      .then(([teasers, full]) => setArticles([...teasers, ...full]))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>News</h1>
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
