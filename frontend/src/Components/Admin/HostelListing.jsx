import axios from '../../axiosConfig.js';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';

export default function HostelListing() {
    const { hostelID } = useParams();
    const [wardens, setWardens] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchStudents() {
        try {
            const response = await axios.get(`/user/${hostelID}/getstudents`);
            setStudents(response.data.students);
        } catch (error) {
            toast.error(error.message || "Failed Getting Students");
        }
    }

    async function fetchWardens() {
        try {
            const response = await axios.get(`/user/${hostelID}/getwardens`);
            setWardens(response.data.wardens);
        } catch (error) {
            toast.error(error.message || "Failed Getting Wardens");
        }
    }
    async function removeUserAPICaller(userID) {
        try {
            await axios.delete(`/user/remove/${userID}`);
            toast.success("User Deleted Successfully");
            fetchData();
        } catch (error) {
            toast.error(error.message || "Error in user removal");
        }
    }

    function removeUserHandler(userID) {
        toast((t) => (
            <span className='flex gap-4'>
                <div className='text-center font-semibold'>Are You Sure You Want To Remove This User?</div>
                <button className="text-white bg-red-600 py-1 rounded-lg  hover:bg-red-400 transition-all duration-200 w-[120px]" onClick={() => {
                    removeUserAPICaller(userID);
                    toast.dismiss(t.id);
                }}>
                    Remove
                </button>
            </span>
        ));
    }

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchStudents(), fetchWardens()]);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [hostelID]);
    return (
        <div className='bg-neutral-100 flex justify-center min-h-[88vh]'>
            {
                loading === true ? (<div className='w-full h-[60vh] flex justify-center items-center'>
                    <ScaleLoader color="#DC851F" size={100} />
                </div>) : (
                    <div className='w-[70%] py-8 flex flex-col gap-4'>

                        <div className='min-h-[200px] rounded-2xl shadow-2xl border-2 bg-white p-4 flex flex-col gap-4'>
                            <div className='text-4xl text-center'>Wardens</div>
                            <div className='h-[1px] bg-black'></div>
                            <div className='h-full flex w-full justify-center items-center'>
                                {wardens.length === 0 ? (<div className='text-xl text-[#DC851F]'>No Wardens Yet</div>) : (<table className='w-full flex flex-col gap-3'>
                                    <thead>
                                        <tr className='flex'>
                                            <th className="flex-1 text-center text-xl text-[#DC851F]">S. No</th>
                                            <th className="flex-1 text-center text-xl text-[#DC851F]">Name</th>
                                            <th className="flex-1 text-center text-xl text-[#DC851F]">Phone Number</th>
                                            <th className="flex-1 text-center text-xl text-[#DC851F]">Email</th>
                                            <th className="flex-1 text-center text-xl text-[#DC851F]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            wardens.map((warden, index) => (
                                                <tr className="flex justify-between mb-3 font-semibold"
                                                    key={index}>
                                                    <td className="flex-1 text-center">{index + 1}</td>
                                                    <td className="flex-1 text-center">{warden.fullName}</td>
                                                    <td className="flex-1 text-center">{warden.phone}</td>
                                                    <td className="flex-1 text-center">{warden.email}</td>
                                                    <td className="flex-1 text-center"><button className="text-white bg-red-600 py-1 rounded-lg  hover:bg-red-400 transition-all duration-200 w-[120px]" onClick={() => { removeUserHandler(warden._id); }}>Remove User</button></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>)

                                }

                            </div>
                        </div>
                        <div className='min-h-[200px] rounded-2xl shadow-2xl border-2 bg-white p-4 flex flex-col gap-4'>
                            <div className='text-4xl text-center'>Students</div>
                            <div className='h-[1px] bg-black'></div>
                            <div className='h-full flex w-full justify-center items-center'>
                                {students.length === 0 ? (<div className='text-xl text-[#DC851F]'>No Wardens Yet</div>) : (<table className='w-full flex flex-col gap-3'>
                                    <thead>
                                        <tr className='flex'>
                                            <th className="flex-1 text-center text-xl text-[#DC851F]">S. No</th>
                                            <th className="flex-1 text-center text-xl text-[#DC851F]">Name</th>
                                            <th className="flex-1 text-center text-xl text-[#DC851F]">Phone Number</th>
                                            <th className="flex-1 text-center text-xl text-[#DC851F]">Email</th>
                                            <th className="flex-1 text-center text-xl text-[#DC851F]">Room Number</th>
                                            <th className="flex-1 text-center text-xl text-[#DC851F]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            students.map((student, index) => (
                                                <tr className="flex justify-between mb-3 font-semibold"
                                                    key={index}>
                                                    <td className="flex-1 text-center">{index + 1}</td>
                                                    <td className="flex-1 text-center">{student.fullName}</td>
                                                    <td className="flex-1 text-center">{student.phone}</td>
                                                    <td className="flex-1 text-center">{student.email}</td>
                                                    <td className="flex-1 text-center">{student.room}</td>
                                                    <td className="flex-1 text-center"><button className="text-white bg-red-600 py-1 rounded-lg  hover:bg-red-400 transition-all duration-200 w-[120px]" onClick={() => { removeUserHandler(student._id); }}>Remove User</button></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>)

                                }
                            </div>
                        </div>

                    </div>)
            }
        </div >
    )
}
