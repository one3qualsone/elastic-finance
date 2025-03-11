'use client';

import { useEffect, useState } from 'react';
import BarChart from '@/components/charts/BarChart';

export default function BalanceSheet({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data || !data.annualReports) return;

    // Process the data for the chart
    const reports = data.annualReports.slice(0, 5).reverse();
    
    const labels = reports.map(report => {
      const date = new Date(report.fiscalDateEnding);
      return date.getFullYear();
    });

    // Extract the assets and liabilities data
    const totalAssets = reports.map(report => parseFloat(report.totalAssets) / 1000000);
    const totalLiabilities = reports.map(report => parseFloat(report.totalLiabilities) / 1000000);
    const totalEquity = reports.map(report => parseFloat(report.totalShareholderEquity) / 1000000);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Total Assets',
          data: totalAssets,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Total Liabilities',
          data: totalLiabilities,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
        {
          label: 'Shareholder Equity',
          data: totalEquity,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    });
  }, [data]);

  if (!chartData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No balance sheet data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <BarChart
        data={chartData}
        title="Balance Sheet Overview"
        xAxisLabel="Year"
        yAxisLabel="Amount (Millions $)"
      />
    </div>
  );
}