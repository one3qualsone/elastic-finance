'use client';

import { useEffect, useState } from 'react';
import BarChart from '@/components/charts/BarChart';

export default function Cashflow({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data || !data.annualReports) return;

    // Process the data for the chart
    const reports = data.annualReports.slice(0, 5).reverse();
    
    const labels = reports.map(report => {
      const date = new Date(report.fiscalDateEnding);
      return date.getFullYear();
    });

    // Extract the cash flow data
    const operatingCashflow = reports.map(report => parseFloat(report.operatingCashflow) / 1000000);
    const cashflowFromInvestment = reports.map(report => parseFloat(report.cashflowFromInvestment) / 1000000);
    const cashflowFromFinancing = reports.map(report => parseFloat(report.cashflowFromFinancing) / 1000000);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Operating Cash Flow',
          data: operatingCashflow,
          backgroundColor: 'rgba(46, 204, 113, 0.6)',
        },
        {
          label: 'Investment Cash Flow',
          data: cashflowFromInvestment,
          backgroundColor: 'rgba(52, 152, 219, 0.6)',
        },
        {
          label: 'Financing Cash Flow',
          data: cashflowFromFinancing,
          backgroundColor: 'rgba(155, 89, 182, 0.6)',
        },
      ],
    });
  }, [data]);

  if (!chartData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No cash flow data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <BarChart
        data={chartData}
        title="Cash Flow Overview"
        xAxisLabel="Year"
        yAxisLabel="Amount (Millions $)"
      />
    </div>
  );
}