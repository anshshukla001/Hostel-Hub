import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig.js';
import toast from "react-hot-toast";
import { ScaleLoader } from 'react-spinners';


export default function WardenGatepass() {
  const [gatePasses, setGatePasses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [loadingGatepass, setLoadingGatepass] = useState({});


  async function getUser() {
    try {
      const response = await axios.get('/user/getUser ');
      setUser(response.data.user);
    } catch (error) {
      console.log("Error ", error);
    }
  }

  async function getData() {
    const hostel = user?.hostel;
    setLoading(true);
    try {
      const response = await axios.get(`/gatepass/warden/gatepass/${hostel}`);
      setGatePasses(response.data.gatepasses);
    } catch (error) {
      console.log("Error ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getData();
  }, [user])

  useEffect(() => {
    const fetchGatepasses = async () => {
      if (search) {
        setLoading(true);
        try {
          const response = await axios.get(`/gatepass/search?search=${search}`);
          setGatePasses(response.data.gatepasses);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchGatepasses();
  }, [search]);


  const handleApprove = async (gatepassId) => {
    setLoadingGatepass((prev) => ({ ...prev, [gatepassId]: 'approving' }));
    try {
      const response = await axios.put(`/gatepass/warden/approve/${gatepassId}`);
      toast.success(response.data.message);
      getData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve gatepass");
    } finally {
      setLoadingGatepass((prev) => ({ ...prev, [gatepassId]: null }));
    }
  };

  const handleReject = async (gatepassId) => {
    setLoadingGatepass((prev) => ({ ...prev, [gatepassId]: 'rejecting' }));
    try {
      const response = await axios.put(`/gatepass/warden/reject/${gatepassId}`);
      toast.success(response.data.message);
      getData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject gatepass");
    } finally {
      setLoadingGatepass((prev) => ({ ...prev, [gatepassId]: null }));
    }
  };


  return (
    <div className='bg-neutral-100 min-h-[88vh]'>
      <div className="w-full flex justify-center items-center py-4 flex-col gap-3">
        <div className="w-[80%] rounded-2xl shadow-2xl border-2 bg-white py-3 px-4">
          <div>
            <p className="text-3xl text-[#DC851F]">
              Hi,{" "}
              <span className="text-[#343330] font-semibold">{user?.fullName}</span>
            </p>
            <p className="font-semibold">
              <span className="text-[#DC851F]">Role - </span>
              {user?.role}
            </p>
            <p className="font-semibold">
              <span className="text-[#DC851F]">Hostel - </span>
              {user?.hostel}
            </p>
          </div>
        </div>

        <div className="w-[80%] rounded-2xl shadow-2xl border-2 bg-white py-3 px-4 flex flex-col gap-4">
          <div className='flex justify-between items-center'>
            <h1 className="font-semibold text-xl">Gatepasses</h1>
            <div className='w-[30%]'>
              <div class="max-w-md mx-auto">
                <div class="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden border-2 border-[#343330] ">
                  <div className="grid place-items-center h-full w-12 text-[#DC851F]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <input
                    class="peer h-full w-full outline-none text-xm text-[#343330] pr-2 placeholder-[#343330]"
                    type="text"
                    id="search"
                    placeholder="Search Student.."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-3 h-[50vh] overflow-y-scroll py-2'>
            {
              loading ? (
                <div className='h-full w-full flex justify-center items-center'>
                  <ScaleLoader color="#DC851F" size={100} />
                </div>
              ) : (
                gatePasses.length === 0 ? (
                  <div className='h-full w-full flex justify-center items-center'>
                    <div className='text-[#DC851F] text-2xl font-semibold'>No Gatepasses Yet</div>
                  </div>
                ) : (
                  gatePasses.map((gatepass) => (
                    <div className='p-3 w-full rounded-xl shadow-xl border-2 border-[#343330] flex justify-between'>
                      <div className='font-semibold flex flex-col gap-1 text-xm'>
                        <h1 className='text-xl'><span className='text-[#DC851F]'>Name - </span>{gatepass.name}</h1>
                        <div><span className='text-[#DC851F]'>Leave Type  -  </span>{gatepass.leaveType}</div>
                        <div><span className='text-[#DC851F]'>Out Date  -  </span>{new Date(gatepass.outDate).toLocaleDateString('en-GB')}</div>
                        <div>
                          {
                            gatepass.inDate ? (<div><span className='text-[#DC851F]'>In Date - </span>{new Date(gatepass.inDate).toLocaleDateString('en-GB')}</div>) : (null)
                          }
                        </div>
                        <div><span className='text-[#DC851F]'>Out Time - </span>{gatepass.outTime}</div>
                        <div><span className='text-[#DC851F]'>In Time - </span>{gatepass.inTime}</div>
                        <div><span className='text-[#DC851F]'>Reason - </span>{gatepass.reason}</div>
                      </div>
                      <div className='w-[20%] flex flex-col items-center justify-center gap-4'>
                        <button
                          className={`w-full py-2 rounded-md font-semibold text-white transition-all duration-200 ${loadingGatepass[gatepass._id] === 'approving'
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-[#4caf50] hover:bg-[#37c93c]'
                            }`}
                          disabled={loadingGatepass[gatepass._id] === 'approving' || loadingGatepass[gatepass._id] === 'rejecting'}
                          onClick={() => handleApprove(gatepass._id)}
                        >
                          {loadingGatepass[gatepass._id] === 'approving' ? 'Approving...' : 'Approve'}
                        </button>

                        <button
                          className={`w-full py-2 rounded-md font-semibold text-white transition-all duration-200 ${loadingGatepass[gatepass._id] === 'rejecting'
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-[#f44336] hover:bg-[#c22e23]'
                            }`}
                          disabled={loadingGatepass[gatepass._id] === 'approving' || loadingGatepass[gatepass._id] === 'rejecting'}
                          onClick={() => handleReject(gatepass._id)}
                        >
                          {loadingGatepass[gatepass._id] === 'rejecting' ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  ))
                )
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}