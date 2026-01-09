import React from "react";
import logo from "../../Images/logos/hostel-hub-logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    phone: "",
    hostel: "",
    role: "Student",
    room: "",
    rollNo: "",
    pass: "",
  });
  const navigate = useNavigate();


  function changeHandler(event) {
    event.preventDefault();
    setSignupData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://hostel-hub-backend.vercel.app/user/signup",
        signupData
      );
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        console.log("Error response:", error.response.data);

        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          error.response.data.errors.forEach((err) => {
            toast.error(err);
          });
        } else {
          toast.error(error.response.data.message || "An error occurred");
        }
      } else {
        console.log("Error", error);
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="flex h-[100vh] w-full justify-center items-center">
      <div className="h-full flex flex-col w-[60%] justify-center items-center">
        <div>
          <img src={logo} alt="" className="w-[270px] h-[270px]" />
        </div>

        <div className="w-[50%]">
          <form
            action=""
            className="flex flex-col gap-4"
            onSubmit={submitHandler}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="font-semibold">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="w-[100%] border-2 border-black rounded-md h-[50px] p-3"
                placeholder="Enter Name Here"
                onChange={changeHandler}
                value={signupData.fullName}
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="w-[50%] flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-[100%] border-2 border-black rounded-md h-[50px] p-3"
                  placeholder="Enter Email Here"
                  required
                  onChange={changeHandler}
                  value={signupData.email}
                />
              </div>
              <div className="w-[50%] flex flex-col gap-2">
                <label htmlFor="phone" className="font-semibold">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="w-[100%] border-2 border-black rounded-md h-[50px] p-3"
                  placeholder="Enter Phone Number Here"
                  required
                  onChange={changeHandler}
                  value={signupData.phone}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[50%] flex flex-col gap-2">
                <label htmlFor="hostel" className="font-semibold">
                  Hostel Name
                </label>
                <input
                  type="text"
                  id="hostel"
                  name="hostel"
                  className="w-[100%] border-2 border-black rounded-md h-[50px] p-3"
                  placeholder="Enter Hostel Name Here"
                  required
                  onChange={changeHandler}
                  value={signupData.hostel}
                />
              </div>
              <div className="w-[50%] flex flex-col gap-2">
                <label htmlFor="Role" className="font-semibold">
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  className="w-[100%] h-[50px] border-2 border-black rounded-md p-2"
                  onChange={changeHandler}
                  value={signupData.role}
                >
                  <option value="Student">Student</option>
                  <option value="Warden">Warden</option>
                </select>
              </div>
            </div>

            {signupData.role === "Student" ? (
              <div className="flex gap-4">
                <div className="w-[50%] flex flex-col gap-2">
                  <label htmlFor="room" className="font-semibold">
                    Room Number
                  </label>
                  <input
                    type="text"
                    id="room"
                    name="room"
                    className="w-[100%] border-2 border-black rounded-md h-[50px] p-3"
                    placeholder="Enter Room Number Here"
                    required
                    onChange={changeHandler}
                    value={signupData.room}
                  />
                </div>
                <div className="w-[50%] flex flex-col gap-2">
                  <label htmlFor="rollNo" className="font-semibold">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    id="rollNo"
                    name="rollNo"
                    className="w-[100%] border-2 border-black rounded-md h-[50px] p-3"
                    placeholder="Enter Roll Number Here"
                    required
                    onChange={changeHandler}
                    value={signupData.rollNo}
                  />
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <label htmlFor="pass" className="font-semibold">
                Password
              </label>
              <input
                id="pass"
                name="pass"
                type="password"
                className="w-[100%] border-2 border-black rounded-md h-[50px] p-3"
                placeholder="Enter Password Here"
                onChange={changeHandler}
                value={signupData.pass}
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-[100%] h-[50px] bg-[#DC851F] rounded-2xl text-white cursor-pointer hover:bg-[#dc941fed] transition-all duration-200"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="flex justify-center items-center mt-4 gap-2">
            <span>Already Have An Account? </span>
            <button
              className="text-[#DC851F] hover:underline transition-all duration-200"
              onClick={() => {
                navigate("/login");
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
