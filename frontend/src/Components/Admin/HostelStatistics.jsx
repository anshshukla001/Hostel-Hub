import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from '../../axiosConfig.js';
import 'chart.js/auto';
import { ScaleLoader } from 'react-spinners';

export default function HostelStatistics() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/admin/hostel-stats');
        const stats = response.data.stats;

        const labels = stats.map((stat) => stat.hostel);
        const percentages = stats.map((stat) => parseFloat(stat.percentage));

        setStats(stats); 

        setData({
          labels,
          datasets: [
            {
              label: 'Percentage of Students',
              data: percentages,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
              ],
              hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
              ],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching hostel stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-neutral-100 h-[88vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Hostel Statistics</h1>
      {
        data ? (
          <div className="flex gap-6 p-6 w-full h-[80%] justify-center">
            <div className="w-fit bg-white rounded-2xl shadow-2xl h-full py-3">
              <Pie
                data={data}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    title: {
                      display: true,
                      text: 'Student Distribution Across Hostels',
                    },
                  },
                }}
                className='h-full w-full'
              />
            </div>
            <div className="w-[35%] bg-white rounded-2xl shadow-2xl h-fit px-4 py-4 flex flex-col justify-center items-center">
              <h2 className="text-xl font-semibold mb-4 text-center">Hostel Details</h2>
              <ul className="w-[100%] flex flex-col gap-3">
                {stats.map((stat, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b border-black py-2 font-semibold"
                  >
                    <span className="text-[#DC851F]">{stat.hostel}</span>
                    <span>{stat.percentage}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p><ScaleLoader color="#DC851F" size={100}/></p>
        )
      }
    </div>
  );
}
