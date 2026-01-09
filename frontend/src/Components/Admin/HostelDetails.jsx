import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from '../../axiosConfig.js';
import { ScaleLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

export default function HostelDetails() {
  const [hostel, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function getHostels() {
    try {
      const response = await axios.get('/user/getHostels');
      setHostels(response.data);
    } catch (err) {
      axios.error(err.message || 'Failed to fetch hostels');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getHostels();
  }, []);

  function clickHandler(hostelID) {
    navigate(`/hostel/${hostelID}`);
  }

  return (
    <div className='bg-neutral-100 flex justify-center min-h-[88vh]'>
      <div className="w-[80%] flex py-10 flex-col gap-3">
        {
          loading === true ? (<div className='w-full h-[60vh] flex justify-center items-center'>
            <ScaleLoader color="#DC851F" size={100} />
          </div>) : (<div className='w-[100%] flex flex-col gap-3'>{hostel.map((host) => (
            <div className='rounded-lg border-2 border-black bg-white w-full h-[150px] p-2 px-4 shadow-xl flex justify-between'>
              <div className='h-full flex items-center gap-1'>
                <p className='text-xl font-semibold text-[#DC851F]'>Hostel - </p>
                <p className='text-xl font-semibold'>{host._id}</p>
              </div>
              <div className='h-full flex gap-14'>
                <div className='h-full flex flex-col justify-center items-center'>
                  <div className='flex gap-1'>
                    <p className='text-xl font-semibold text-[#DC851F]'>Number Of Students - </p>
                    <p className='text-xl'>{host.numberOfStudents}</p>
                  </div>
                  <div className='flex gap-1'>
                    <p className='text-xl font-semibold text-[#DC851F]'>Number Of Wardens - </p>
                    <p className='text-xl'>{host.numberOfWardens}</p>
                  </div>
                </div>
                <div className='h-full flex justify-center items-center'>
                  <button className="text-white bg-[#DC851F] py-3 rounded-lg font-semibold hover:bg-[#eea756] transition-all duration-200 w-[110px]" onClick={() => clickHandler(host._id)}>View Details</button>
                </div>
              </div>
            </div>
          ))}</div>)
        }

      </div>
    </div>
  )
}
