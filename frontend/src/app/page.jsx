// frontend/src/app/page.jsx
'use client';

import StockDashboard from '@/components/dashboard/StockDashboard';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Elastic Finance</h1>
        <p className="text-xl mb-8">
          Analyze stocks using value investing principles and make informed investment decisions
        </p>
      </section>

      <StockDashboard />
      
      <section className="card max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Understanding Value Investing</h2>
        <p className="mb-4">
          Value investing is an investment strategy that involves selecting stocks that appear to be trading for less than their 
          intrinsic or book value. Value investors actively seek stocks they believe the market has undervalued.
        </p>
        <p className="mb-4">
          This approach was pioneered by Benjamin Graham and David Dodd, but it was Warren Buffett who became its most famous practitioner.
          Buffett's success over many decades has proven the effectiveness of this investment philosophy.
        </p>
        
        <blockquote className="border-l-4 border-primary-500 pl-4 italic my-6 text-gray-700 dark:text-gray-300">
          "Price is what you pay. Value is what you get." - Warren Buffett
        </blockquote>
        
        <h3 className="text-lg font-semibold mt-4 mb-2">Key Metrics Explained</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <h4 className="font-semibold mb-1">Price to Earnings (P/E) Ratio</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Buffett typically looks for companies with a P/E ratio below 15, indicating 
              potential undervaluation.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1">Price to Book (P/B) Ratio</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              A P/B ratio below 1.5 is considered attractive, as it indicates the company might 
              be trading below its book value.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1">Return on Equity (ROE)</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Buffett seeks companies with consistent ROE above 15%, indicating effective 
              use of shareholder capital.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1">Debt to Equity Ratio</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Buffett prefers companies with a debt-to-equity ratio below 0.5, showing 
              financial stability.
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300">
          Learn more about value investing principles and strategies in our educational resources section.
        </p>
      </section>
    </div>
  );
}