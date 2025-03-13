// frontend/src/app/learn/page.jsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticlesByLevel } from '@/lib/learn/contentService';
import ComingSoonPlaceholder from '@/components/learn/ComingSoonPlaceholder';

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

  // Render different content based on the active tab
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // For intermediate and advanced sections, show placeholder
    if (activeTab !== 'beginner') {
      return <ComingSoonPlaceholder level={activeTab} />;
    }

    // For beginner section, show article cards
    return articles.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/learn/${activeTab}/${article.slug}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
              {/* Use a fallback mechanism for images */}
              {article.imagePath && (
                <img
                  src={article.imagePath}
                  alt={article.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/learn/default.jpg';
                  }}
                />
              )}
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
    );
  };

  return (
    <>
      {/* Preston Pysh Attribution Box */}
      <div className="mb-10 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <a href="https://www.youtube.com/@PrestonPysh" target="_blank" rel="noopener noreferrer">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500">
                <img 
                  src="/images/learn/preston.jpg" 
                  alt="Preston Pysh" 
                  className="w-full h-full object-cover"
                />
              </div>
            </a>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Content Acknowledgment</h3>
            <p className="text-gray-700 dark:text-gray-300">
              The educational content in this section has been adapted from the teachings of 
              <a 
                href="https://www.youtube.com/@PrestonPysh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-medium mx-1 hover:underline"
              >
                Preston Pysh
              </a>
              , whose exceptional value investing tutorials have been foundational to this resource.
              We highly recommend visiting his YouTube channel for more in-depth financial education.
            </p>
          </div>
        </div>
      </div>

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
      
      {/* Content Area */}
      {renderContent()}
      
      {/* Resources Section with Added Links */}
      <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Value Investing Books</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.amazon.com/Intelligent-Investor-Definitive-Investing-Essentials/dp/0060555661" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  The Intelligent Investor - Benjamin Graham
                </a>
              </li>
              <li>
                <a 
                  href="https://www.amazon.com/Security-Analysis-Principles-Benjamin-Graham/dp/0071592539" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Security Analysis - Benjamin Graham & David Dodd
                </a>
              </li>
              <li>
                <a 
                  href="https://www.amazon.com/Essays-Warren-Buffett-Lessons-Corporate/dp/1531017509" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  The Essays of Warren Buffett - Warren Buffett
                </a>
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Useful Tools</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://finviz.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Finviz Stock Screener
                </a>
              </li>
              <li>
                <a 
                  href="https://www.sec.gov/edgar/searchedgar/companysearch" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  SEC EDGAR Database
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gurufocus.com/term/dcf/MS/DCF/Morgan+Stanley" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  GuruFocus DCF Calculator
                </a>
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Learning Path</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Follow our structured learning path to master value investing from the basics to advanced techniques.
            </p>
            <div className="mt-4 space-y-2">
              <a href="/learn?tab=beginner" className="text-blue-600 dark:text-blue-400 hover:underline block">
                Beginner Path →
              </a>
              <a href="/learn?tab=intermediate" className="text-blue-600 dark:text-blue-400 hover:underline block">
                Intermediate Path →
              </a>
              <a href="/learn?tab=advanced" className="text-blue-600 dark:text-blue-400 hover:underline block">
                Advanced Path →
              </a>
            </div>
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