import React from 'react';
// thanh trượt Silders
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
// icon
import { FaUsers } from "react-icons/fa";
import { SiSoundcharts } from "react-icons/si";
import { LuPackageCheck } from "react-icons/lu";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { VscPackage } from "react-icons/vsc";
import { FaChartPie } from "react-icons/fa6";
import { MdOutlineFeedback } from "react-icons/md";
import { TfiBarChart } from "react-icons/tfi";




const DashboardBoxes = (props) => {
  return (
    <>
     <Swiper
        slidesPerView={4}
        spaceBetween={30}
        navigation={true}
        modules={[Navigation]}
        className="dashboardBoxesSlider">
        
        <SwiperSlide>
           <div className='box bg-[#3872fa] p-5 py-6 cursor-pointer hover:bg-[#346ae8] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
           <FaUsers className='text-[50px] text-[#fff]'/>
             <div className='info w-[70%]'>
                <h3 className='text-white'>Tổng người dùng</h3>
                <b className='text-white text-[20px]'>{props?.users}</b>
             </div>
                <SiSoundcharts className='text-[70px] text-[#fff]'/>
           </div>
        </SwiperSlide>

         <SwiperSlide>
           <div className='box bg-[#10b981] p-5 py-6  cursor-pointer hover:bg-[#289974] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
           <LuPackageCheck className='text-[50px] text-[#fff]'/>
             <div className='info w-[80%]'>
                <h3 className='text-white'>Tổng số đơn hàng</h3>
                <b className='text-white text-[20px]'>{props?.orders}</b>
             </div>
                <LuChartNoAxesCombined className='text-[70px] text-[#fff]'/>
           </div>
        </SwiperSlide>

         <SwiperSlide>
           <div className='box p-5  bg-[#f22c61]  py-6 cursor-pointer hover:bg-[#d52c59] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
           <VscPackage className='text-[50px] text-white'/>
             <div className='info w-[70%]'>
                <h3 className='text-white'>Tổng số sản phẩm</h3>
                <b className='text-white text-[20px]'>{props?.products}</b>
             </div>
                <FaChartPie className='text-[70px] text-[#fff]'/>
           </div>
        </SwiperSlide>

         <SwiperSlide>
           <div className='box p-5 bg-[#312be1d8]  py-6  cursor-pointer hover:bg-[#423eadd8] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4'>
           <MdOutlineFeedback className='text-[50px] text-white'/>
             <div className='info w-[70%]'>
                <h3 className='text-white'>Tổng các danh mục</h3>
                <b className='text-white text-[20px]'>{props.category}</b>
             </div>
                <TfiBarChart className='text-[70px] text-[#fff]'/>
           </div>
        </SwiperSlide>

      </Swiper>
      
    </>
  )
}

export default DashboardBoxes;
