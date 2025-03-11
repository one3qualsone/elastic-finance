// frontend/src/components/learn/MarkdownContent.jsx
'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Custom renderer for images in markdown
const MarkdownImage = ({ src, alt }) => {
  // Ensure image paths are handled correctly
  const imageSrc = src.startsWith('/') ? src : `/${src}`;
  
  return (
    <div className="my-8 flex justify-center">
      <div className="relative w-full max-w-2xl rounded-lg overflow-hidden shadow-lg">
        <Image 
          src={imageSrc}
          alt={alt || "Educational image"}
          width={800}
          height={500}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default function MarkdownContent({ content, slug, level, relatedArticles = [] }) {
  const [tableOfContents, setTableOfContents] = useState([]);
  
  // Extract headers for table of contents
  useEffect(() => {
    if (content) {
      const headers = [];
      const lines = content.split('\n');
      
      lines.forEach(line => {
        if (line.startsWith('## ')) {
          const title = line.replace('## ', '');
          const id = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
          headers.push({ title, id });
        }
      });
      
      setTableOfContents(headers);
    }
  }, [content]);

  // Handle scrolling to anchors with offset for fixed header
  const scrollToSection = (id) => {
    // Log for debugging
    console.log(`Attempting to scroll to section with id: ${id}`);
    
    const element = document.getElementById(id);
    if (element) {
      console.log(`Found element with id: ${id}`);
      
      // Add a longer delay to ensure the DOM is fully rendered and calculated
      setTimeout(() => {
        try {
          const headerOffset = 100; // Adjust based on your header height
          
          // Get current scroll position
          const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
          
          // Calculate element position relative to the document
          const elementPosition = element.getBoundingClientRect().top + currentPosition;
          
          // Calculate final position with offset
          const offsetPosition = elementPosition - headerOffset;
          
          console.log(`Scrolling to position: ${offsetPosition}`);
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } catch (error) {
          console.error('Error scrolling to section:', error);
        }
      }, 200); // Increased timeout for better reliability
    } else {
      console.warn(`Element with id "${id}" not found`);
    }
  };

  if (!content) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Generate previous and next article links
  const currentIndex = relatedArticles.findIndex(article => article.slug === slug);
  const prevArticle = currentIndex > 0 ? relatedArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < relatedArticles.length - 1 ? relatedArticles[currentIndex + 1] : null;

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Main content layout - using CSS Grid for better layout control */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content area - takes 3/4 of space on large screens */}
        <div className="lg:col-span-3">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ node, ...props }) => {
                  const id = props.children[0].toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
                  return <h2 id={id} className="pt-4 mt-8 border-t border-gray-200 dark:border-gray-700" {...props} />;
                },
                img: ({ node, ...props }) => <MarkdownImage {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" {...props} target="_blank" rel="noopener noreferrer" />,
                table: ({ node, ...props }) => <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} /></div>,
                thead: ({ node, ...props }) => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
                th: ({ node, ...props }) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" {...props} />,
                td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm" {...props} />,
                // Add these new components for list rendering
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-4 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-4 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />
              }}
            >
              {content}
            </ReactMarkdown>

            {/* Navigation between articles */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
              <div>
                {prevArticle && (
                  <Link 
                    href={`/learn/${level}/${prevArticle.slug}`}
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    <ChevronLeftIcon className="h-5 w-5 mr-1" />
                    <span>Previous:<br />{prevArticle.title}</span>
                  </Link>
                )}
              </div>
              <div className="text-right">
                {nextArticle && (
                  <Link 
                    href={`/learn/${level}/${nextArticle.slug}`}
                    className="inline-flex items-center justify-end text-blue-600 hover:underline"
                  >
                    <span>Next:<br />{nextArticle.title}</span>
                    <ChevronRightIcon className="h-5 w-5 ml-1" />
                  </Link>
                )}
              </div>
            </div>

            {/* Related articles */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Related Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles
                  .filter(article => article.slug !== slug)
                  .slice(0, 4)
                  .map(article => (
                    <Link 
                      key={article.slug}
                      href={`/learn/${level}/${article.slug}`}
                      className="card hover:shadow-lg transition-shadow duration-300 p-4"
                    >
                      <h4 className="text-lg font-semibold">{article.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{article.description}</p>
                    </Link>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents - takes 1/4 of space on large screens */}
        {tableOfContents.length > 2 && (
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold mb-2">Contents</h4>
              <ul className="space-y-2">
                {tableOfContents.map((header) => (
                  <li key={header.id}>
                    <button
                      onClick={() => scrollToSection(header.id)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-left w-full text-sm"
                    >
                      {header.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Table of Contents */}
      {tableOfContents.length > 2 && (
        <div className="lg:hidden mt-8 mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-2">Contents</h4>
          <ul className="space-y-2">
            {tableOfContents.map((header) => (
              <li key={header.id}>
                <button
                  onClick={() => scrollToSection(header.id)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-left w-full"
                >
                  {header.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}