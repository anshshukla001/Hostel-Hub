import logo from "../../Images/logos/hostel-hub-logo.png";
import { useState, useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../Context/AppContext";

axios.defaults.withCredentials = true;

export default function Login() {
  const [loginData, setLoginData] = useState({ email: "", pass: "" });
  const navigate = useNavigate();
  const {setIsAuthenticated } = useContext(AppContext);

  function changeHandler(event) {
    event.preventDefault();
    setLoginData((prevData) => {
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
        "https://hostel-hub-backend.vercel.app/user/login",
        loginData
      );
      toast.success(response.data.message);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      toast.error("Invalid Username Or Password");
      console.log("Error ", error);
    }
  }

  function setAuthorizationHeader() {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  useEffect(() => {
    setAuthorizationHeader();
  }, []);

  return (
    <div className="flex h-[100vh] w-full justify-center items-center">
      <div className="h-full flex flex-col w-[60%] justify-center items-center">
        <div>
          <img src={logo} alt="" className="w-[300px] h-[300px]" />
        </div>

        <div className="w-[50%]">
          <form action="" onSubmit={submitHandler}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-[100%] border-2 border-black rounded-md h-[50px] p-3"
                  placeholder="Enter Email Here"
                  onChange={changeHandler}
                  value={loginData.email}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="font-semibold">
                  Password
                </label>
                <input
                  id="pass"
                  name="pass"
                  type="password"
                  className="w-[100%] border-2 border-black rounded-md h-[50px] p-3"
                  placeholder="Enter Password Here"
                  value={loginData.pass}
                  onChange={changeHandler}
                />
                <div className="flex justify-end">
                  <span className="cursor-pointer text-[#DC851F] hover:underline transition-all duration-200">
                    Forgot Password
                  </span>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-[100%] h-[50px] bg-[#DC851F] rounded-2xl text-white cursor-pointer hover:bg-[#dc941fed] transition-all duration-200"
                >
                  Sign In
                </button>
              </div>
            </div>
          </form>

          <div className="flex justify-center items-center mt-4 gap-2">
            <span>Don't Have An Account? </span>
            <button
              className="text-[#DC851F] hover:underline transition-all duration-200"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
