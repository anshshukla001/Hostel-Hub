import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig.js';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from 'react-spinners';

export default function Profile() {

    const [user, setUser] = useState({});
    const [temp, setTemp] = useState(user);
    const [editMode, setEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    async function getUser() {
        try {
            const response = await axios.get('/user/getUser');
            setUser(response.data.user);
            setTemp(response.data.user);
            setLoading(false);
        } catch (error) {
            console.log("Error ", error);
            setLoading(false);
        }
    }

    function changeHandler(e) {
        const { name, value } = e.target;
        setTemp({ ...temp, [name]: value });
    }

    async function submitHandler(e) {
        e.preventDefault();
        try {
            const response = await axios.put('/user/update', temp);
            setEditMode(false);
            getUser();
            toast.success(response.data.message);
            window.location.reload();
        } catch (error) {
            console.log("Error ", error);
        }
    }

    async function pfpChangeHandler(e) {
        try {
            setUploading(true);
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('profileImage', file);

            await toast.promise(
                axios.post('/user/profileImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }),
                {
                    loading: 'Uploading...',
                    success: <b>Profile Picture Updated Successfully!</b>,
                    error: <b>Error Updating Profile Picture.</b>,
                }
            );
            getUser();
            setUploading(false);
        } catch (error) {
            setUploading(false);
            console.log("Error ", error);
        }
    }

    function logoutFunction() {
        toast((t) => (
            <span className='flex gap-2 items-center'>
                <b className='text-[#343330] text-xl'>Are You Sure?</b>
                <button onClick={() => {
                    localStorage.removeItem('token');
                    navigate("/login");
                    toast.dismiss(t.id);
                    toast.success("User Logged Out");
                }} className='text-white bg-[#DC851F] py-2 rounded-lg font-semibold hover:bg-[#eea756] transition-all duration-200 w-[100px]'>
                    Log Out
                </button>
            </span>
        ));
    }

    useEffect(() => {
        getUser();
    }, []);
    return (
        <div>
            {loading ? (
                <div className='h-[60vh] flex justify-center items-center w-full'>
                    <ScaleLoader color="#DC851F" />
                </div>
            ) : (
                <div className="bg-neutral-100 min-h-[88vh] flex justify-center py-7">
                    <div className='w-[65%] flex gap-3'>
                        <div className='w-[37%] rounded-2xl shadow-2xl border-2 bg-white py-3 px-4 h-[500px] flex justify-center items-center'>
                            <div className='flex flex-col justify-center items-center gap-6'>
                                <div className='rounded-full'>
                                    <img src={user.profileImageURL} alt="" className='h-[200px] w-[200px] rounded-full' />
                                </div>
                                <div className='flex flex-col gap-1 justify-center items-center text-[#343330]'>
                                    <div className='text-xl font-semibold'>{user.fullName}</div>
                                    <div className='text-xl font-semibold'>{user.email}</div>
                                </div>

                                <div className='flex gap-3 justify-center items-center'>
                                    <button className="text-white bg-[#DC851F] rounded-lg font-semibold hover:bg-[#eea756] transition-all duration-200">
                                        {
                                            uploading ? (<div className='py-3 w-[150px] bg-[#eea756] rounded-lg'>Uploading...</div>) : (<>
                                                <label htmlFor="profileImage" className='py-3 w-[150px] cursor-pointer'>Change Photo</label>
                                                <input type="file" id='profileImage' name='profileImage' onChange={pfpChangeHandler} className='hidden' />
                                            </>)
                                        }
                                    </button>
                                    <button className="text-white bg-[#DC851F] py-3 rounded-lg font-semibold hover:bg-[#eea756] transition-all duration-200 w-[150px]" onClick={logoutFunction}>
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='rounded-2xl shadow-2xl border-2 bg-white py-4 px-7 h-fit w-[63%]'>
                            {
                                editMode ? (
                                    <form className='flex flex-col gap-3' onSubmit={submitHandler}>
                                        <div className='flex gap-3 items-center text-[#343330]'>
                                            <label htmlFor="fullName" className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Full Name</label>
                                            <input type="text" name='fullName' id='fullName' value={temp.fullName} onChange={changeHandler} className='h-[50px] border-2 border-black rounded-lg px-2 w-[85%] font-semibold text-xl' />
                                        </div>
                                        <div className='h-[1px] w-full bg-neutral-600'></div>
                                        <div className='flex gap-3 items-center text-[#343330]'>
                                            <label htmlFor="email" className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Email</label>
                                            <input type="email" name='email' id='email' value={temp.email} onChange={changeHandler} className='h-[50px] border-2 border-black rounded-lg px-2 w-[85%] font-semibold text-xl' />
                                        </div>
                                        <div className='h-[1px] w-full bg-neutral-600'></div>
                                        <div className='flex gap-3 items-center text-[#343330]'>
                                            <label htmlFor="phone" className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Phone</label>
                                            <input type="text" name='phone' id='phone' value={temp.phone} onChange={changeHandler} className='h-[50px] border-2 border-black rounded-lg px-2 w-[85%] font-semibold text-xl' />
                                        </div>
                                        <div className='h-[1px] w-full bg-neutral-600'></div>
                                        <div className='flex gap-3 items-center text-[#343330]'>
                                            <label htmlFor="hostel" className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Hostel</label>
                                            <input type="text" name='hostel' id='hostel' value={temp.hostel} onChange={changeHandler} className='h-[50px] border-2 border-black rounded-lg px-2 w-[85%] font-semibold text-xl' />
                                        </div>
                                        <div className='h-[1px] w-full bg-neutral-600'></div>
                                        {user.role === "Student" && (<>
                                            <div className='flex gap-3 items-center text-[#343330]'>
                                                <label htmlFor="room" className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Room</label>
                                                <input type="text" name='room' id='room' value={temp.room} onChange={changeHandler} className='h-[50px] border-2 border-black rounded-lg px-2 w-[85%] font-semibold text-xl' />
                                            </div>
                                            <div className='h-[1px] w-full bg-neutral-600'></div>
                                            <div className='flex gap-3 items-center text-[#343330]'>
                                                <label htmlFor="rollNo" className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Roll No</label>
                                                <input type="text" name='rollNo' id='rollNo' value={temp.rollNo} onChange={changeHandler} className='h-[50px] border-2 border-black rounded-lg px-2 w-[85%] font-semibold text-xl' />
                                            </div>
                                            <div className='h-[1px] w-full bg-neutral-600'></div>
                                        </>)}
                                        <button type="submit" className="text-white bg-[#DC851F] py-3 rounded-lg font-semibold hover:bg-[#eea756] transition-all duration-200 w-[150px]">
                                            Save Changes
                                        </button>
                                    </form>) : (
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex gap-3 items-center text-[#343330]'>
                                            <div className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Full Name</div>
                                            <div className='h-[50px] px-2 w-[85%] font-semibold flex items-center text-xl'>{user.fullName}</div>
                                        </div>
                                        <div className='h-[1px] w-full bg-neutral-600 '></div>
                                        <div className='flex gap-3 items-center text-[#343330]'>
                                            <div className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Email</div>
                                            <div className='h-[50px] px-2 w-[85%] font-semibold flex items-center text-xl'>{user.email}</div>
                                        </div>
                                        <div className='h-[1px] w-full bg-neutral-600'></div>
                                        <div className='flex gap-3 items-center text-[#343330]'>
                                            <div className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Phone</div>
                                            <div className='h-[50px] px-2 w-[85%] font-semibold flex items-center text-xl'>{user.phone}</div>
                                        </div>
                                        <div className='h-[1px] w-full bg-neutral-600'></div>
                                        <div className='flex gap-3 items-center text-[#343330]'>
                                            <div className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Hostel</div>
                                            <div className='h-[50px] px-2 w-[85%] font-semibold flex items-center text-xl'>{user?.hostel ? (user.hostel) : (<div>---</div>)}</div>
                                        </div>
                                        <div className='h-[1px] w-full bg-neutral-600'></div>
                                        {user.role === "Student" && (<>
                                            <div className='flex gap-3 items-center text-[#343330]'>
                                                <div className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Room</div>
                                                <div className='h-[50px] px-2 w-[85%] font-semibold flex items-center text-xl'>{user.room}</div>
                                            </div>
                                            <div className='h-[1px] w-full bg-neutral-600'></div>
                                            <div className='flex gap-3 items-center text-[#343330]'>
                                                <div className='w-[15%] text-xl text-[#DC851F] font font-semibold'>Roll No</div>
                                                <div className='h-[50px] px-2 w-[85%] font-semibold flex items-center text-xl'>{user.rollNo}</div>
                                            </div>
                                            <div className='h-[1px] w-full bg-neutral-600'></div>
                                        </>)}
                                        <div className='flex gap-3'>
                                            <button className="text-white bg-[#DC851F] py-3 rounded-lg font-semibold hover:bg-[#eea756] transition-all duration-200 w-[150px]" onClick={() => { setEditMode(true) }}>Edit</button>
                                            <button className="text-white bg-[#DC851F] py-3 rounded-lg font-semibold hover:bg-[#eea756] transition-all duration-200 w-[170px] px-3" onClick={() => { navigate("/changepassword") }}>
                                                Change Password
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}