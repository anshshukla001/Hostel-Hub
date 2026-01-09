import React from 'react';
import { useState, useEffect } from 'react';
import StudentComplaints from './StudentComplaints';
import WardenComplaints from './WardenComplaints';
import axios from '../../axiosConfig.js';
import { ScaleLoader } from 'react-spinners';

export default function Complaints() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/user/getUser');
      setUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching user:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      {loading ? (
        <div className='h-[60vh] flex justify-center items-center'>
          <ScaleLoader color="#DC851F" />
        </div>
      ) : (
        user?.role === "Student" ? (<StudentComplaints />) : (<WardenComplaints />)
      )}
    </div>
  )
}