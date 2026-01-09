import React, { useEffect, useState } from 'react';
import StudentGatepass from './StudentGatepass';
import WardenGatepass from './WardenGatepass';
import axios from '../../axiosConfig.js';
import { ScaleLoader } from 'react-spinners';


export default function Gatepass() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const fetchUser = async () => {
    try {
      const response = await axios.get('/user/getUser ');
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
        <div className='h-[60vh] flex justify-center items-center w-full'>
          <ScaleLoader color="#DC851F" />
        </div>
      ) : (
        user?.role === 'Student' ? (<StudentGatepass />) : (<WardenGatepass />)
      )}
    </div>
  );
}