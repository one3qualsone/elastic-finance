// frontend/src/app/page.jsx
'use client';

import StockDashboard from '@/components/dashboard/StockDashboard';

export default function Home() {
  return (
    <div className="space-y-8">

      <StockDashboard />
      
    </div>
  );
}