'use client';

import { useEffect, useState } from 'react';
import BarChart from '@/components/charts/BarChart';

export default function IncomeStatement({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data || !data.annualReports) return;

    // Process the data for the chart
    const reports = data.annualReports.slice(0, 5).reverse();
    
    const labels = reports.map(report => {
      const date = new Date(report.fiscalDateEnding);
      return date.getFullYear();
    });

    // Extract the revenue and income data
    const totalRevenue = reports.map(report => parseFloat(report.totalRevenue) / 1000000);
    const grossProfit = reports.map(report => parseFloat(report.grossProfit) / 1000000);
    const netIncome = reports.map(report => parseFloat(report.netIncome) / 1000000);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Total Revenue',
          data: totalRevenue,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Gross Profit',
          data: grossProfit,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Net Income',
          data: netIncome,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
        },
      ],
    });
  }, [data]);

  if (!chartData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No income statement data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <BarChart
        data={chartData}
        title="Income Statement Overview"
        xAxisLabel="Year"
        yAxisLabel="Amount (Millions $)"
      />
    </div>
  );
}