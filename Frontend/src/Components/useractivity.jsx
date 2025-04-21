import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';
function formatDuration(minutes) {
    if (minutes === 0) return '0 minutes';
  
    const units = [
      { label: 'year', minutes: 525600 },   // 365 days
      { label: 'month', minutes: 43200 },   // 30 days
      { label: 'day', minutes: 1440 },
      { label: 'hour', minutes: 60 },
      { label: 'minute', minutes: 1 },
    ];
  
    let remainingMinutes = minutes;
    const parts = [];
  
    for (const unit of units) {
      const unitValue = Math.floor(remainingMinutes / unit.minutes);
      if (unitValue > 0) {
        parts.push(`${unitValue} ${unit.label}${unitValue > 1 ? 's' : ''}`);
        remainingMinutes %= unit.minutes;
      }
    }
  
    return parts.join(', ');
  }
  
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label" ><strong>{data.name}</strong></p>
          <p className="intro" style={{ color: "#8884d8" }} >Total Logins: {data.totalLogins}</p>
          <p className="desc" style={{ color: "#82ca9d" }}>Total Time Spent: {formatDuration(data.totalTimeSpent)} </p>
        </div>
      );
    }
  
    return null;
  };
const UserActivityGraph = () => {
  const [activityData, setActivityData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stat/activity', { withCredentials: true });
        const transformedData = response.data.map(user => ({
          userId: user._id,
          name: user.name|| 'Unknown',
          totalLogins: user.totalLogins,
          totalTimeSpent: user.totalTimeSpent,
        }));
        setActivityData(transformedData);
      } catch (error) {
        console.error('Error fetching activity data:', error);
      }
    };

    fetchActivityData();
  }, []);

  const handleBarClick = (data) => {
    const { userId } = data;
    navigate(`/user-profile/${userId}`);
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3>User Activity Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={activityData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          
          <YAxis />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Legend />
          
          <Bar
            dataKey="totalLogins"
            fill="#8884d8"
            name="Total Logins:"
            onClick={handleBarClick}
          />
          <Bar
            dataKey="totalTimeSpent"
            fill="#82ca9d"
            name="Total Time Spent:"
            onClick={handleBarClick}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserActivityGraph;
