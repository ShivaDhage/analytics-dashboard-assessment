import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load CSV data
    Papa.parse('/Electric_Vehicle_Population_Data.csv', {
      download: true,
      header: true,
      complete: (result) => {
        setData(result.data);
        setLoading(false);
      },
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  // Data Aggregation for Visualizations
  const brandsCount = data.reduce((acc, row) => {
    acc[row.Make] = (acc[row.Make] || 0) + 1;
    return acc;
  }, {});

  const modelsCount = data.reduce((acc, row) => {
    acc[row.Model] = (acc[row.Model] || 0) + 1;
    return acc;
  }, {});

  const brandLabels = Object.keys(brandsCount);
  const brandValues = Object.values(brandsCount);

  const modelLabels = Object.keys(modelsCount)
    .filter((label) => label && label.length > 0)
    .slice(0, 10); // Limit to top 10
  const modelValues = Object.values(modelsCount).slice(0, 10);

  return (
    <div className="dashboard">
      <h1>Electric Vehicle Dashboard</h1>

      <div className="chart-container">
        <h2>Electric Vehicle Brands Distribution</h2>
        <Pie
          data={{
            labels: brandLabels,
            datasets: [
              {
                label: 'Brands Distribution',
                data: brandValues,
                backgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                  '#FF9F40', '#FFCD56', '#4CAF50', '#3F51B5', '#FF5722'
                ],
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
              },
            },
          }}
        />
      </div>

      <div className="chart-container">
        <h2>Top 10 Vehicle Models</h2>
        <Bar
          data={{
            labels: modelLabels,
            datasets: [
              {
                label: 'Model Popularity',
                data: modelValues,
                backgroundColor: '#36A2EB',
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Count',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Model',
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
