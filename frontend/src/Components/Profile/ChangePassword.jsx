import React, { useState } from 'react';
import axios from '../../axiosConfig.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {

    const [passData, setPassData] = useState({});
    const navigate = useNavigate();

    function changeHandler(e) {
        const { name, value } = e.target;
        setPassData({ ...passData, [name]: value });
    }

    async function submitHandler(e) {
        e.preventDefault();
        if(passData.newPass !== passData.confirmPass) {
            toast.error("Passwords do not match");
            return;
        }
        if(passData.newPass === passData.currPass) {
            toast.error("Current Password and New Password cannot be same");
            return;
        }
        try {
            await axios.post("/user/changepassword",passData);
            toast.success("Password Changed Successfully");
            navigate("/profile");
        } catch (error) {
            toast.error("Current Password Is Incorrect");
        }
    }

    return (
        <div className='flex justify-center items-center py-5'>
            <div className='rounded-2xl shadow-2xl border-2 bg-white py-8 px-7 h-fit w-[45%] flex flex-col gap-7'>
                <div className='text-[#343330] text-center text-2xl font-semibold'>Change Password</div>
                <form className='flex flex-col gap-4' onSubmit={submitHandler}>
                    <div className='h-[1px] w-full bg-neutral-600'></div>
                    <div className='flex gap-3 items-center text-[#343330]'>
                        <label htmlFor="currPass" className='w-[25%] text-[#DC851F] font font-semibold text-xl'>Current Password</label>
                        <input type="password" name='currPass' id='currPass' value={passData.currPass} onChange={changeHandler} className='h-[50px] border-2 border-black rounded-lg px-3 w-[75%] font-semibold' placeholder='Enter Current Password Here' />
                    </div>
                    <div className='h-[1px] w-full bg-neutral-600'></div>
                    <div className='flex gap-3 items-center text-[#343330]'>
                        <label htmlFor="currPass" className='w-[25%] text-[#DC851F] font font-semibold text-xl'>New Password</label>
                        <input type="password" name='newPass' id='newPass' value={passData.newPass} onChange={changeHandler} className='h-[50px] border-2 border-black rounded-lg px-3 w-[75%] font-semibold' placeholder='Enter New Password Here' />
                    </div>
                    <div className='h-[1px] w-full bg-neutral-600'></div>
                    <div className='flex gap-3 items-center text-[#343330]'>
                        <label htmlFor="confirmPass" className='w-[25%] text-[#DC851F] font font-semibold text-xl'>Confirm Password</label>
                        <input type="password" name='confirmPass' id='confirmPass' value={passData.confirmPass} onChange={changeHandler} className='h-[50px] border-2 border-black rounded-lg px-3 w-[75%] font-semibold' placeholder='Confirm Password Here' />
                    </div>
                    <div className='h-[1px] w-full bg-neutral-600'></div>
                    <button className="text-white bg-[#DC851F] py-3 rounded-lg font-semibold hover:bg-[#eea756] transition-all duration-200 w-[170px] px-3">
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    )
}
