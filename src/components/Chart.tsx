'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type ChartProps = {
  title: string;
  labels: string[];
  data: number[];
  color?: string;
  borderColor?: string;
  bgColor?: string;
};

export default function Chart({
  title,
  labels,
  data,
  color = 'rgb(59, 130, 246)',
  borderColor = 'rgb(59, 130, 246)',
  bgColor = 'rgba(59, 130, 246, 0.1)',
}: ChartProps) {
  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor,
        backgroundColor: bgColor,
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: color,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgb(31, 41, 55)',
        titleColor: 'rgb(229, 231, 235)',
        bodyColor: 'rgb(229, 231, 235)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm h-80">
      <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-4">{title}</h3>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
} 