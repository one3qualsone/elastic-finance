// frontend/src/components/layout/Footer.jsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Value Investing</h3>
            <p className="text-gray-300 dark:text-gray-400">
              A platform for value investors to analyze stocks based on fundamental principles.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 dark:text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-gray-300 dark:text-gray-400 hover:text-white">
                  Learn
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Learning Paths</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/learn?tab=beginner" className="text-gray-300 dark:text-gray-400 hover:text-white">
                  Beginner
                </Link>
              </li>
              <li>
                <Link href="/learn?tab=intermediate" className="text-gray-300 dark:text-gray-400 hover:text-white">
                  Intermediate
                </Link>
              </li>
              <li>
                <Link href="/learn?tab=advanced" className="text-gray-300 dark:text-gray-400 hover:text-white">
                  Advanced
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 dark:text-gray-500">
          <p>© {new Date().getFullYear()} | Open Source Value Investing Portfolio Project</p>
          <p className="mt-2 text-sm">
            Data provided by Yahoo Finance API. This website is for educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}