// frontend/src/lib/learn/contentService.js

// This service handles fetching and organizing educational content

// Mock data for beginner level articles
const beginnerArticles = [
    {
      slug: 'value-investing-basics',
      title: 'What is Value Investing?',
      description: 'Learn the fundamentals of value investing and how it differs from other strategies.',
      order: 1,
      imagePath: '/images/learn/value-investing.jpg',
    },
    {
      slug: 'valuing-small-business',
      title: 'Valuing a Small Business',
      description: 'Understand how to evaluate the worth of a small business using fundamental principles.',
      order: 2,
      imagePath: '/images/learn/small-business.jpg',
    },
    {
      slug: 'balance-sheet-margin-safety',
      title: 'Balance Sheet & Margin of Safety',
      description: 'Learn how to read a balance sheet and understand the concept of margin of safety.',
      order: 3,
      imagePath: '/images/learn/balance-sheet.jpg',
    },
    {
      slug: 'what-is-share',
      title: 'What is a Share?',
      description: 'Understand shares, shares outstanding, and basic valuation techniques for shares.',
      order: 4,
      imagePath: '/images/learn/stock-share.jpg',
    },
    {
      slug: 'buffett-stock-basics',
      title: 'Warren Buffett Stock Basics',
      description: 'Learn Warren Buffett\'s four rules for buying stocks and his basic valuation techniques.',
      order: 5,
      imagePath: '/images/learn/buffett.jpg',
    },
    {
      slug: 'what-is-bond',
      title: 'What is a Bond?',
      description: 'Understand the fundamentals of bonds and why they are important for investors.',
      order: 6,
      imagePath: '/images/learn/bonds.jpg',
    },
    {
      slug: 'bond-components',
      title: 'Components of a Bond',
      description: 'Learn about par value, coupon rate, term, and market value of bonds.',
      order: 7,
      imagePath: '/images/learn/bond-components.jpg',
    },
    {
      slug: 'bond-valuation-yield',
      title: 'Bond Valuation & Yield to Maturity',
      description: 'Understand how to value bonds and calculate yield to maturity.',
      order: 8,
      imagePath: '/images/learn/bond-yield.jpg',
    },
    {
      slug: 'stock-market-basics',
      title: 'What is the Stock Market?',
      description: 'Learn the basics of how the stock market functions and Benjamin Graham\'s Mr. Market.',
      order: 9,
      imagePath: '/images/learn/stock-market.jpg',
    },
    {
      slug: 'market-crashes-bubbles',
      title: 'Stock Market Crashes & Bubbles',
      description: 'Understand market psychology, fear and greed cycles, and how to navigate them.',
      order: 10,
      imagePath: '/images/learn/market-crash.jpg',
    },
    {
      slug: 'fed-explained',
      title: 'What is the Fed?',
      description: 'Learn about the Federal Reserve, its mission, and how it influences markets.',
      order: 11,
      imagePath: '/images/learn/federal-reserve.jpg',
    },
    {
      slug: 'reading-financial-statements',
      title: 'Reading Financial Statements',
      description: 'Learn how to read and interpret income statements, balance sheets, and cash flow statements.',
      order: 12,
      imagePath: '/images/learn/financial-statements.jpg',
    },
    {
      slug: 'intrinsic-value-calculation',
      title: 'Calculating Intrinsic Value',
      description: 'Understand the concept of intrinsic value and learn basic calculation methods.',
      order: 13,
      imagePath: '/images/learn/intrinsic-value.jpg',
    },
  ];
  
  // Mock data for intermediate level articles
  const intermediateArticles = [
    {
      slug: 'discounted-cash-flow',
      title: 'Discounted Cash Flow Analysis',
      description: 'Learn advanced methods for calculating the intrinsic value of a business.',
      order: 1,
      imagePath: '/images/learn/dcf.jpg',
    },
    // Additional intermediate articles would go here
  ];
  
  // Mock data for advanced level articles
  const advancedArticles = [
    {
      slug: 'special-situations',
      title: 'Special Situations Investing',
      description: 'Learn about arbitrage, spin-offs, and other special investment situations.',
      order: 1,
      imagePath: '/images/learn/special-situations.jpg',
    },
    // Additional advanced articles would go here
  ];
  
  /**
   * Get article content by level and slug
   * @param {string} level - beginner, intermediate, or advanced
   * @param {string} slug - article slug
   * @returns {Promise<Object>} - article content and metadata
   */
  export const getArticleContent = async (level, slug) => {
    try {
      // In a real implementation, this would fetch from an API
      // For now, we're using a mock implementation
      
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, this would be an API fetch
      const response = await fetch(`/api/educational-content/${level}/${slug}`)
        .catch(() => {
          // Fall back to static content if API is not available
          return { ok: false };
        });
      
      // If we got a valid response from the API, use it
      if (response && response.ok) {
        const content = await response.text();
        return {
          content,
          metadata: getArticleMetadata(level, slug)
        };
      }
      
      // Otherwise, return mock content (for development)
      // In a real app, you'd load this from a file or database
      return {
        content: `# ${getArticleTitle(level, slug)}\n\nThis is placeholder content for ${slug}. In a real application, this would load the actual markdown content.`,
        metadata: getArticleMetadata(level, slug)
      };
    } catch (error) {
      console.error(`Error fetching content for ${level}/${slug}:`, error);
      throw new Error(`Failed to fetch content for ${slug}`);
    }
  };
  
  /**
   * Get article metadata by level and slug
   * @param {string} level - beginner, intermediate, or advanced
   * @param {string} slug - article slug
   * @returns {Object} - article metadata
   */
  export const getArticleMetadata = (level, slug) => {
    const articles = getArticlesByLevel(level);
    const article = articles.find(a => a.slug === slug);
    
    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
        imagePath: '/images/learn/default.jpg',
      };
    }
    
    return article;
  };
  
  /**
   * Get article title by level and slug
   * @param {string} level - beginner, intermediate, or advanced
   * @param {string} slug - article slug
   * @returns {string} - article title
   */
  export const getArticleTitle = (level, slug) => {
    const metadata = getArticleMetadata(level, slug);
    return metadata.title || 'Article Not Found';
  };
  
  /**
   * Get all articles for a specific level
   * @param {string} level - beginner, intermediate, or advanced
   * @returns {Array} - array of article objects
   */
  export const getArticlesByLevel = (level) => {
    switch (level) {
      case 'beginner':
        return beginnerArticles;
      case 'intermediate':
        return intermediateArticles;
      case 'advanced':
        return advancedArticles;
      default:
        return [];
    }
  };
  
  /**
   * Get related articles for a specific article
   * @param {string} level - beginner, intermediate, or advanced
   * @param {string} currentSlug - current article slug
   * @returns {Promise<Array>} - array of related article objects
   */
  export const getRelatedArticles = async (level, currentSlug) => {
    try {
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get all articles for the level
      const allArticles = getArticlesByLevel(level);
      
      // Sort by order
      const sortedArticles = [...allArticles].sort((a, b) => a.order - b.order);
      
      // Return all articles (including current one, which can be filtered out if needed)
      return sortedArticles;
    } catch (error) {
      console.error(`Error fetching related articles for ${level}/${currentSlug}:`, error);
      return [];
    }
  };
  
  /**
   * Get next and previous articles for navigation
   * @param {string} level - beginner, intermediate, or advanced
   * @param {string} currentSlug - current article slug
   * @returns {Promise<Object>} - object with next and previous articles
   */
  export const getNavigationArticles = async (level, currentSlug) => {
    try {
      const allArticles = await getRelatedArticles(level, currentSlug);
      
      // Find the current article index
      const currentIndex = allArticles.findIndex(article => article.slug === currentSlug);
      
      if (currentIndex === -1) {
        return { prev: null, next: null };
      }
      
      // Get previous and next articles
      const prev = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
      const next = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;
      
      return { prev, next };
    } catch (error) {
      console.error(`Error fetching navigation for ${level}/${currentSlug}:`, error);
      return { prev: null, next: null };
    }
  };
  
  export default {
    getArticleContent,
    getArticleMetadata,
    getArticleTitle,
    getArticlesByLevel,
    getRelatedArticles,
    getNavigationArticles
  };