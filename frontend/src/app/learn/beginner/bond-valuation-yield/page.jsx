import fs from 'fs';
import path from 'path';
import MarkdownContent from '@/components/learn/MarkdownContent';
import { getRelatedArticles } from '@/lib/learn/contentService';

export default async function BondValuationYieldPage() {
  const slug = 'bond-valuation-yield';
  const level = 'beginner';
  
  // Read markdown file directly on the server
  const markdownPath = path.join(process.cwd(), 'src', 'app', 'learn', level, slug, `${slug}.md`);
  let content = '';
  
  try {
    content = fs.readFileSync(markdownPath, 'utf8');
  } catch (error) {
    console.error(`Error reading markdown file for ${slug}:`, error);
    content = `# Bond Valuation & Yield to Maturity\n\nContent coming soon.`;
  }
  
  // Get related articles for navigation
  const relatedArticles = await getRelatedArticles(level, slug);
  
  return (
    <div className="max-w-4xl mx-auto">
      <MarkdownContent 
        content={content}
        slug={slug}
        level={level}
        relatedArticles={relatedArticles}
      />
    </div>
  );
}