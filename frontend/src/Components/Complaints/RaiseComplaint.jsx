import axios from '../../axiosConfig.js';
import React, { useState,useEffect } from 'react';
import toast from 'react-hot-toast';

export default function RaiseComplaint({ setShowForm, name, hostel }) {

    const [complaintData, setComplaintData] = useState({ name: "", hostel: "", compType: "Furniture", compDetails: "" });

    useEffect(() => {
        setComplaintData(prevData => ({
            ...prevData,
            name: name,
            hostel: hostel
        }));
    }, [name, hostel]);

    function changeHandler(event) {
        event.preventDefault();
        setComplaintData((prevData) => {
            return {
                ...prevData,
                [event.target.name]: event.target.value,
            };
        });
    }

    async function submitHandler(e) {
        e.preventDefault();
        try {
          const response = await axios.post('/complaints/raise', complaintData);
          toast.success(response.data.message);
          setShowForm(false);
        } catch (error) {
          console.log(error);
          toast.error("Error occured while registering the complaint");
        }
      }

    return (
        <div className="flex flex-col gap-7 py-2">
            <div className="text-[#343330] flex items-center justify-between">
                <p className="font-semibold text-xl">Raise Complaint</p>
                <button
                    className="text-white bg-[#DC851F] py-2 px-4 rounded-lg hover:bg-[#eea756] transition-all duration-200"
                    onClick={() => { setShowForm(false); }}
                >
                    View Complaint History
                </button>
            </div>

            <form action="" className="text-[#343330] flex flex-col gap-9" onSubmit={submitHandler}>
                <div className="flex gap-16 items-center">
                    <label
                        htmlFor="compType"
                        className="text-[#DC851F] font-semibold"
                    >
                        Complaint Type
                    </label>
                    <select
                        name="compType"
                        id="compType"
                        className="w-[400px] h-[40px] border-2 border-black rounded-md p-2"
                        onChange={changeHandler}
                        value={complaintData.compType}
                        required
                    >
                        <option value="Furniture">Furniture</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Water Supply">Water Supply</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Mess Food">Mess Food</option>
                    </select>
                </div>

                <div className="flex gap-12 items-center">
                    <label
                        htmlFor="compDetails"
                        className="text-[#DC851F] font-semibold"
                    >
                        Complaint Details
                    </label>
                    <textarea name="compDetails"
                        id="compDetails"
                        className="w-[400px] h-[110px] border-2 border-black rounded-md p-2 resize-none"
                        onChange={changeHandler}
                        value={complaintData.compDetails}
                        placeholder='Enter Details Here'
                        required></textarea>
                </div>

                <button type='submit' className="text-white bg-[#DC851F] py-2 px-4 rounded-lg hover:bg-[#eea756] transition-all duration-200 w-[39%]">Raise Complaint</button>

            </form>
        </div>
    )
}
