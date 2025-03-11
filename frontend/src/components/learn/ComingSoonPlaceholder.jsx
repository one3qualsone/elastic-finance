// frontend/src/components/learn/ComingSoonPlaceholder.jsx
'use client';

import { CalendarIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export default function ComingSoonPlaceholder({ level }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center mb-8">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <CalendarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {level.charAt(0).toUpperCase() + level.slice(1)} Content Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          We're currently developing in-depth {level} lessons to help you master value investing concepts.
        </p>
      </div>
      
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0">
            <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">What to expect</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Our {level} section will cover advanced concepts including:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
              {level === 'intermediate' ? (
                <>
                  <li>Discounted Cash Flow Analysis</li>
                  <li>Competitive Advantage Analysis</li>
                  <li>Financial Ratio Deep Dives</li>
                  <li>Industry-Specific Valuation Techniques</li>
                </>
              ) : (
                <>
                  <li>Special Situations Investing</li>
                  <li>Advanced Portfolio Management</li>
                  <li>Market Psychology and Behavioral Finance</li>
                  <li>Complex Valuation Models</li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            In the meantime, we recommend exploring our <a href="/learn?tab=beginner" className="text-blue-600 dark:text-blue-400 hover:underline">beginner lessons</a> to build a solid foundation.
          </p>
        </div>
      </div>
    </div>
  );
}