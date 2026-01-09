import React, { useEffect, useState } from "react";
import axios from '../../axiosConfig.js';
import toast from "react-hot-toast";

function formatDate(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function formatDateToYYYYMMDD(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addOneDay(dateString) {
  const date = new Date(dateString);
  const nextDate = new Date(date.getTime() + 86400000);
  const year = nextDate.getFullYear();
  const month = String(nextDate.getMonth() + 1).padStart(2, "0");
  const day = String(nextDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
export default function StudentGatepass() {

  const [user, setUser] = useState({});

  const [gatePassData, setGatePassData] = useState({
    name: user?.fullName,
    applyFor: "Day Out",
    outDate: "",
    outTime: "",
    inDate: "",
    inTime: "",
    reason: "",
    hostel: user?.hostel,
  });

  async function getUser() {
    try {
      const response = await axios.get('/user/getUser');
      setUser(response.data.user);
    } catch (error) {
      console.log("Error ", error);
    }
  }

  const [applyForm, setApplyForm] = useState(true);
  const currentDate = formatDate(new Date());
  const [gatepasses, setGatepasses] = useState();
  const [editButton, setEditButton] = useState(false);

  async function getData() {
    try {
      const response = await axios.get('/gatepass/all');
      const sortedGatepasses = response.data.gatepasses.sort((a, b) => {

        if (a.status === "Pending" && b.status !== "Pending") return -1;
        if (a.status !== "Pending" && b.status === "Pending") return 1;

        return new Date(b.outDate) - new Date(a.outDate);
      });
      setGatepasses(sortedGatepasses);
    } catch (error) {
      console.log("Error ", error);
    }
  }

  useEffect(() => {
    try {
      getData();
      getUser();
    } catch (error) {
      console.log("Error ", error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setGatePassData((prevData) => ({
        ...prevData,
        name: user.fullName || "",
        hostel: user.hostel || "",
      }));
    }
  }, [user]);


  function changeHandler(event) {
    event.preventDefault();
    setGatePassData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function submitHandler(event) {
    event.preventDefault();
    try {
      console.log(gatePassData.name);
      const response = editButton ? (await axios.patch(
        '/gatepass/apply',
        gatePassData
      )) : (await axios.post(
        '/gatepass/apply',
        gatePassData
      ));
      toast.success(response.data.message);
      setApplyForm(false);
      setEditButton(false);
      getData();
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  }

  function editHandler() {
    setEditButton(true);
    setApplyForm(true);
  }

  return (
    <div className="bg-neutral-100 min-h-[88vh]">
      <div className="w-full flex justify-center items-center py-4 flex-col gap-3">
        <div className="w-[80%] rounded-2xl shadow-2xl border-2 bg-white py-3 px-4">
          <div>
            <p className="sm:text-3xl text-[#DC851F] text-xl">
              Hi,{" "}
              <span className="text-[#343330] font-semibold">{user?.fullName}</span>
            </p>
            <p className="font-semibold">
              <span className="text-[#DC851F]">Roll No - </span>
              {user?.rollNo}
            </p>
            <p className="font-semibold">
              <span className="text-[#DC851F]">Hostel - </span>
              {user?.hostel} , {user?.room}
            </p>
          </div>
        </div>

        <div className="w-[80%] rounded-2xl shadow-2xl border-2 bg-white py-3 px-4">
          {applyForm ? (
            <div className="flex flex-col gap-7 py-2">
              <div className="text-[#343330] flex items-center justify-between sm:flex-row flex-col">
                <p className="font-semibold sm:text-xl">Apply Gatepass</p>
                <button
                  className="text-white bg-[#DC851F] py-2 px-4 rounded-lg hover:bg-[#eea756] transition-all duration-200"
                  onClick={() => {
                    setApplyForm(!applyForm);
                  }}
                >
                  View Gatepass History
                </button>
              </div>
              <form
                action=""
                className="text-[#343330] flex flex-col gap-3"
                onSubmit={submitHandler}
              >
                <p className="flex gap-14 text-[#DC851F] font-semibold">
                  Apply Date{" "}
                  <span className="text-[#343330]">{currentDate}</span>
                </p>
                <div className="flex gap-14 items-center">
                  <label
                    htmlFor="applyFor"
                    className="text-[#DC851F] font-semibold"
                  >
                    Apply For
                  </label>
                  <select
                    name="applyFor"
                    id="applyFor"
                    defaultValue="Day Out"
                    className="w-[300px] h-[40px] border-2 border-black rounded-md p-2"
                    onChange={changeHandler}
                    value={gatePassData.applyFor}
                  >
                    <option value="Day Out">Day Out</option>
                    <option value="Night Out">Night Out</option>
                  </select>
                </div>

                <div className="flex gap-4 lg:flex-row flex-col">
                  <div className="flex gap-2 flex-col">
                    <label
                      htmlFor="outDate"
                      className="text-[#DC851F] font-semibold"
                    >
                      Out Date
                    </label>
                    <input
                      type="date"
                      id="outDate"
                      name="outDate"
                      className="lg:w-[300px] w-[100%] h-[40px] border-2 border-black rounded-md p-2"
                      onChange={changeHandler}
                      value={gatePassData.outDate}
                      min={formatDateToYYYYMMDD(currentDate)}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <label
                      htmlFor="outDate"
                      className="text-[#DC851F] font-semibold"
                    >
                      Out Time
                    </label>
                    <input
                      type="text"
                      id="outTime"
                      name="outTime"
                      className="lg:w-[300px] w-[100%] h-[40px] border-2 border-black rounded-md p-2"
                      placeholder="Enter Out Time Here"
                      onChange={changeHandler}
                      value={gatePassData.outTime}
                    />
                  </div>
                </div>

                <div className="flex gap-4 lg:flex-row flex-col">
                  {gatePassData.applyFor === "Night Out" ? (
                    <div className="flex gap-2 flex-col">
                      <label
                        htmlFor="inDate"
                        className="text-[#DC851F] font-semibold"
                      >
                        In Date
                      </label>
                      <input
                        type="date"
                        id="inDate"
                        name="inDate"
                        className="lg:w-[300px] w-[100%] h-[40px] border-2 border-black rounded-md p-2"
                        onChange={changeHandler}
                        value={gatePassData.inDate}
                        min={gatePassData.outDate ? addOneDay(gatePassData.outDate) : ""}
                      />
                    </div>
                  ) : null}
                  <div className="flex gap-2 flex-col">
                    <label
                      htmlFor="inTime"
                      className="text-[#DC851F] font-semibold"
                    >
                      In Time
                    </label>
                    <input
                      type="text"
                      id="inTime"
                      name="inTime"
                      className="lg:w-[300px] w-[100%] h-[40px] border-2 border-black rounded-md p-2"
                      placeholder="Enter Out Time Here"
                      onChange={changeHandler}
                      value={gatePassData.inTime}
                    />
                  </div>
                </div>
                <div className="flex gap-6 lg:flex-row flex-col lg:items-end">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="reason"
                      className="text-[#DC851F] font-semibold"
                    >
                      Reason
                    </label>
                    <input
                      type="text"
                      id="reason"
                      name="reason"
                      placeholder="Enter Reason Here"
                      className="lg:w-[300px] w-[100%] h-[40px] border-2 border-black rounded-md p-2"
                      onChange={changeHandler}
                      value={gatePassData.reason}
                    />
                  </div>
                  <div>
                    {
                      editButton ? (<button
                        type="submit"
                        className="text-white bg-[#DC851F] py-2 px-4 rounded-lg hover:bg-[#eea756] transition-all duration-200"
                      >
                        Edit GatePass
                      </button>) : (<button
                        type="submit"
                        className="text-white bg-[#DC851F] py-2 px-4 rounded-lg hover:bg-[#eea756] transition-all duration-200"
                      >
                        Apply Gatepass
                      </button>)
                    }
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-2 flex flex-col gap-7">
              <div className="text-[#343330] flex items-center justify-between sm:flex-row flex-col">
                <p className="font-semibold sm:text-xl">Gatepass History</p>
                <button
                  className="text-white bg-[#DC851F] py-2 px-4 rounded-lg hover:bg-[#eea756] transition-all duration-200"
                  onClick={() => {
                    setApplyForm(!applyForm);
                    setEditButton(false);
                  }}
                >
                  Apply Gatepass
                </button>
              </div>
              <div className="h-[1px] w-full bg-neutral-400"></div>
              <div className="overflow-x-scroll lg:overflow-x-visible">
                <table className="w-full min-w-[1100px]" border="1">
                  <thead>
                    <tr className="flex mb-4">
                      <th className="flex-1 text-center text-xl text-[#DC851F]">
                        S. No
                      </th>
                      <th className="flex-1 text-center text-xl text-[#DC851F]">
                        Leave Type
                      </th>
                      <th className="flex-1 text-center text-xl text-[#DC851F]">
                        Status
                      </th>
                      <th className="flex-1 text-center text-xl text-[#DC851F]">
                        Leave Date
                      </th>
                      <th className="flex-1 text-center text-xl text-[#DC851F]">
                        Reason
                      </th>
                      <th className="flex-1 text-center text-xl text-[#DC851F]">
                        Approved/Rejected By
                      </th>
                      <th className="flex-1 text-center text-xl text-[#DC851F]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {gatepasses.map((gatepass, index) => (
                      <tr
                        className="flex justify-between mb-3 font-semibold"
                        key={index}
                      >
                        <td className="flex-1 text-center">{index + 1}</td>
                        <td className="flex-1 text-center">
                          {gatepass.leaveType}
                        </td>
                        <td
                          className={`flex-1 text-center ${gatepass.status === "Approved" ? "text-green-500" :
                            gatepass.status === "Rejected" ? "text-red-500" :
                              "text-blue-500"
                            }`}
                        >
                          {gatepass.status}
                        </td>
                        <td className="flex-1 text-center">
                          {formatDateToDDMMYYYY(gatepass.outDate)}
                        </td>
                        <td className="flex-1 text-center">
                          {gatepass.reason}
                        </td>
                        <td className="flex-1 text-center text-blue-500">
                          {
                            gatepass.approvedOrRejectedBy ? (gatepass.approvedOrRejectedBy) : (<div>---</div>)
                          }
                        </td>
                        {
                          gatepass.status === "Pending" ? (<td className="flex-1 text-center">
                            <button onClick={editHandler}>Edit</button>
                          </td>) : (<td className="flex-1 text-center">---</td>)
                        }

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
