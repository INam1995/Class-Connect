import React, { useEffect, useState } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

const Roles = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalUploads: 0,
    totalDownloads: 0,
  });

  // ✅ Fetch data from the backend correctly
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/stat/getStats");
        setStats(data);  // ✅ Corrected `setStats`
      } catch (error) {
        console.error("Error fetching stats:", error.message);
      }
    };

    fetchStats();  // ✅ Call the function inside `useEffect`
  }, []);

  // ✅ Data for the donut chart
  const data = {
    labels: ['Users', 'Admins', 'Uploads', 'Downloads'],
    datasets: [
      {
        label: 'Statistics',
        data: [
          stats.totalUsers,
          stats.totalAdmins,
          stats.totalUploads,
          stats.totalDownloads,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '400px', margin: 'auto', marginTop: '50px' }}>
      <h1>Statistics Donut Chart</h1>
      <Doughnut data={data} />
    </div>
  );
}

export default Roles;
