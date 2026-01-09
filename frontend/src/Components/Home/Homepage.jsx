import React from "react";
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CCarousel, CCarouselItem } from "@coreui/react";
import image1 from "../../Images/images/image4.jpg";
import image2 from "../../Images/images/2nd-page-image-2.jpg";
import image3 from "../../Images/images/3rd-page-image.jpg";

export default function Homepage() {
  return (
    <div>
      <CCarousel indicators interval={2000} transition="crossfade">
        <CCarouselItem>
          <div className="h-[88vh] relative">
            <div
              className="h-full w-full brightness-50 absolute"
              style={{
                backgroundImage: `url(${image1})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="absolute z-40 h-full bg-transparent flex w-full justify-center items-center flex-col gap-7">
              <h1 className="md:text-7xl text-4xl text-white font-semibold text-center md:w-[60%] w-[80%] leading-tight">
                Elevate Your Campus Living with{" "}
                <span className="text-[#DC851F]">Hostel</span>{" "}
                <span className="text-[#DC851F]">Hub</span>
              </h1>
              <h2 className="md:w-[60%] w-[80%] md:text-2xl text-xl text-center text-[#b9b9b8] leading-loose">
                Empowering students with seamless gate pass applications and
                complaint management. Streamline your hostel experience and
                focus on what truly matters.
              </h2>
              <div className="flex gap-5 flex-col sm:flex-row w-[80%] sm:justify-center">
                <button className="text-white bg-[#DC851F] p-3 px-5 rounded-lg font-semibold hover:bg-[#eea756] transition-all duration-200">
                  Gatepass
                </button>
                <button className="text-white bg-[#DC851F] p-3 px-5 rounded-lg font-semibold hover:bg-[#eea756] transition-all duration-200">
                  Complaint
                </button>
              </div>
            </div>
          </div>
        </CCarouselItem>
        <CCarouselItem>
          <div className="h-[88vh] relative">
            <div
              className="h-full w-full brightness-75 absolute"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${image3})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="absolute z-40 h-full bg-transparent flex w-full justify-center items-center flex-col gap-7">
              <h1 className="md:text-7xl text-4xl text-white font-semibold text-center md:w-[60%] leading-tight w-[80%]">
                Stay Connected with{" "}
                <span className="text-[#DC851F]">Hostel</span>{" "}
                <span className="text-[#DC851F]">Hub</span>
              </h1>
              <h2 className="md:w-[60%] w-[80%] md:text-2xl text-xl text-center text-[#b9b9b8] leading-loose">
                Effortlessly manage all your hostel needs and stay in touch with
                instant notifications and updates.
              </h2>
              <button className="text-white bg-[#DC851F] p-3 px-5 rounded-lg font-semibold hover:bg-[#eea756] transition-all duration-200">
                Profile
              </button>
            </div>
          </div>
        </CCarouselItem>
        <CCarouselItem>
          <div className="h-[88vh] relative flex">
            <div
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${image2})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="h-full w-full brightness-75"
            ></div>
            <div className="absolute z-40 h-full bg-transparent flex w-full items-center flex-col">
              <h1 className="text-white md:text-5xl text-2xl md:pt-5 pt-4">
                Why Choose <span className="text-[#DC851F]">Hostel Hub?</span>
              </h1>
              <div className="w-full flex h-full justify-around pb-4 md:flex-row flex-col items-center md:items-start">
                <div className="md:w-[30%] w-[90%] h-full flex flex-col md:justify-around md:gap-0 gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="text-[#DC851F] font-semibold md:text-2xl text-xm">
                      01.
                    </div>
                    <div className="text-white md:text-3xl text-xm font-bold">
                      Easy Gate Pass Application
                    </div>
                    <div className="md:text-2xl text-xm text-neutral-400 text-justify">
                      Simplified process for students to apply for gate passes
                      online.Real-time updates and notifications about the
                      status of the applications.
                    </div>
                  </div>
                  <div className="h-[1px] bg-neutral-400"></div>
                  <div className="flex flex-col gap-2">
                    <div className="text-[#DC851F] font-semibold md:text-2xl text-xm">
                      02.
                    </div>
                    <div className="text-white md:text-3xl font-bold text-xm">
                      Efficient Complaint Management
                    </div>
                    <div className="md:text-2xl text-neutral-400 text-justify text-xm">
                      Easy-to-use interface for raising and tracking complaints.
                      Ensure prompt resolution with automated alerts to the
                      concerned authorities.
                    </div>
                  </div>
                </div>
                <div className="md:w-[30%] w-[90%] h-full flex flex-col justify-around">
                  <div className="flex flex-col gap-2">
                    <div className="text-[#DC851F] font-semibold md:text-2xl text-xm">
                      03.
                    </div>
                    <div className="text-white md:text-3xl font-bold text-xm">
                      Secure and Reliable
                    </div>
                    <div className="md:text-2xl text-xm text-neutral-400 text-justify">
                      Data security and privacy are our top priorities. Robust
                      infrastructure to ensure uninterrupted service.Regular
                      updates and maintenance to keep your data safe.
                    </div>
                  </div>
                  <div className="h-[1px] bg-neutral-400"></div>
                  <div className="flex flex-col gap-2">
                    <div className="text-[#DC851F] font-semibold md:text-2xl text-xm">
                      04.
                    </div>
                    <div className="text-white md:text-3xl font-bold text-xm">
                      User-Friendly Dashboard
                    </div>
                    <div className="md:text-2xl text-xm text-neutral-400 text-justify">
                      Intuitive dashboard for students to manage all their
                      hostel-related activities. Access important information
                      and updates at a glance.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CCarouselItem>
      </CCarousel>
    </div>
  );
}
