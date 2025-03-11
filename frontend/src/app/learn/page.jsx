'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticlesByLevel } from '@/lib/learn/contentService';

// Separate component that uses useSearchParams
function LearningContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('beginner');
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set active tab based on URL query parameter (if present)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['beginner', 'intermediate', 'advanced'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Load articles when the active tab changes
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        // Get articles for the active tab
        const articles = getArticlesByLevel(activeTab);
        
        // Sort articles by order
        const sortedArticles = [...articles].sort((a, b) => a.order - b.order);
        
        setArticles(sortedArticles);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticles();
  }, [activeTab]);

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setActiveTab('beginner')}
            className={`px-6 py-3 text-sm font-medium rounded-l-md ${
              activeTab === 'beginner'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setActiveTab('intermediate')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'intermediate'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-6 py-3 text-sm font-medium rounded-r-md ${
              activeTab === 'advanced'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>
      
      {/* Article Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/learn/${activeTab}/${article.slug}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                {/* This would be an actual image in production */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <span className="text-sm">Image: {article.imagePath}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                  Lesson {article.order}
                </div>
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {article.description}
                </p>
                <div className="text-blue-600 dark:text-blue-400 hover:underline">
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl text-gray-600 dark:text-gray-400">
            No articles available for this level yet.
          </h3>
          <p className="mt-2">
            Please check back later or try another skill level.
          </p>
        </div>
      )}
      
      {/* Resources Section */}
      <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Value Investing Books</h3>
            <ul className="space-y-2">
              <li>The Intelligent Investor - Benjamin Graham</li>
              <li>Security Analysis - Benjamin Graham & David Dodd</li>
              <li>The Essays of Warren Buffett - Warren Buffett</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Useful Tools</h3>
            <ul className="space-y-2">
              <li>Stock Screeners</li>
              <li>Financial Statement Analyzers</li>
              <li>Valuation Calculators</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Learning Path</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Follow our structured learning path to master value investing from the basics to advanced techniques.
            </p>
            <a href="/learn/path" className="text-blue-600 dark:text-blue-400 hover:underline block mt-2">
              View Learning Path →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// Main Learn Page component that wraps LearningContent in a Suspense boundary
export default function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Learning Center</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Discover the principles of value investing through our comprehensive educational resources.
        </p>
      </div>
      
      {/* Wrap the component that uses useSearchParams in a Suspense boundary */}
      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <LearningContent />
      </Suspense>
    </div>
  );
}