import Navbar from "../component/Navbar";
import { AiFillAudio } from "react-icons/ai";
const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="relative top-16">
        <div className="flex justify-between max-w-[99%] mx-auto gap-2 h-[90vh]  rounded-[3px]">
          <div className="w-[20%] bg-[#121212] rounded-[10px] max-w-sm:w-[30%]">
            <section className="max-w-[95%] bg-[#1f1f1f] h-[30%] mx-auto mt-14 rounded-[14px] flex justify-center items-center">
                <div>
                    <AiFillAudio className="w-[40px] h-[40px] rounded-full bg-white" />
                </div>
            </section>
          </div>
          <div className="w-[80%] bg-[#121212] rounded-[10px] max-w-sm:w-[70%]"></div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
