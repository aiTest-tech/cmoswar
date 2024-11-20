import { AiOutlineSpotify } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { HiCollection } from "react-icons/hi";
import { AiTwotoneAudio } from "react-icons/ai";


import { NavLink } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <div className="bg-[#000000] w-full p-[8px] h-[48px] flex justify-between items-center fixed top-2 left-0 z-10">
        {/* left part logo */}
        <div className="ml-4">
          <AiTwotoneAudio className="text-[#ffffff] w-[40px] h-[40px]" />
        </div>
        {/* middle part */}
        <div className="hidden lg:block">
          <div className="flex justify-between items-center gap-2">
            <div className="bg-[#1f1f1f] w-[40px] h-[40px] rounded-full flex justify-center items-center">
              <div>
                <IoHomeOutline className="text-[#acacac] w-[25px] h-[25px]" />
              </div>
            </div>
            <div className="w-[474px] h-[40px] rounded-full bg-[#1f1f1f] flex justify-between items-center">
              <div>
                <CiSearch className="text-[#acacac] w-[30px] h-[25px]" />
              </div>
              <div>
                <span className="text-[#acacac]">
                  What do you want to play?
                </span>
              </div>
              <div className="text-[#acacac] w-[10px] h-[40px]" />
              <div>
                <HiCollection className="w-[35px] h-[35px] text-[#acacac]" />
              </div>
            </div>
          </div>
        </div>
        {/* right hand side button */}
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center rounded-full bg-black py-[8px] px-[32px] cursor-pointer">
            <NavLink to={"/"}>
              <span className="text-white">Sign Up</span>
            </NavLink>
          </div>
          <NavLink to={"/login"}>
            <div className="flex justify-center items-center rounded-full bg-white py-[8px] px-[32px] cursor-pointer">
              <span className="text-black">Login</span>
            </div>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Navbar;
