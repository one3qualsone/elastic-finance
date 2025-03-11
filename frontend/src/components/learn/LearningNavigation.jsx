// frontend/src/components/learn/LearningNavigation.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getArticlesByLevel } from '@/lib/learn/contentService';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

export default function LearningNavigation({ level, currentSlug }) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const fetchedArticles = await getArticlesByLevel(level);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, [level]);

  if (isLoading) {
    return (
      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 capitalize">{level} Level Articles</h3>
      <ul className="space-y-2">
        {articles.map((article) => {
          const isActive = article.slug === currentSlug;
          return (
            <li key={article.slug}>
              <Link 
                href={`/learn/${level}/${article.slug}`}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {isActive && <ChevronRightIcon className="w-4 h-4 mr-2 flex-shrink-0" />}
                <span className={isActive ? '' : 'ml-6'}>{article.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}