import React from 'react'
import { useState } from 'react';
// Phóng to ảnh trong sản phẩm
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

// Thanh trược Silder
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchDataFromApi } from '../../utils/api';

// Icon
import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdFilterVintage } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
// Icon Đánh Giá
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';


const ProductDetails = () => {

        const [slideIndex, setSlideIndex] = useState(0);
        const zoomSliderBig = useRef();
        const zoomSliderSml = useRef();
    
        const goto = (index) => {
            setSlideIndex(index);
            zoomSliderSml.current.swiper.slideTo(index);
            zoomSliderBig.current.swiper.slideTo(index);
        }

        // Code Backend kết nối Server với Admin
        const [product, setProduct] = useState();

        const {id} = useParams();
        useEffect(()=>{
            fetchDataFromApi(`/api/product/${id}`).then((res)=>{
                if(res?.error===false){
                    setTimeout(() => {
                        setProduct(res?.product)
                    }, 1500);
                }
            })
        },[]);


  return (
    <>
        <div className="flex items-center justify-between px-2 py-0 mt-3">
            <h2 className="text-[18px] font-[600]">Chi tiết sản phẩm</h2>
        </div>
        <br/>

        {
           product?._id !== "" && product?._id !== undefined && product?._id !== null ?
            <>
             <div className='productDetails flex gap-8'>
            <div className='w-[40%]'>
            {
                product?.images?.length!==0 &&

                 <div className='flex gap-3'>
                            <div className=" slider w-[15%] ">
                                <Swiper 
                                        ref={zoomSliderSml}
                                        direction={'vertical'}
                                        slidesPerView={5}
                                        spaceBetween={8}
                                        navigation={true}
                                        modules={[Navigation]}
                                        className={`zoomProductSliderThumbs h-[470px] !overflow-hidden ${product?.images?.length > 5 && 'space'} `}>
                                        {
                                            
                                            product?.images?.map((item,index)=>{
                                                return(
                                                    <SwiperSlide>
                                                <div className={`item rounded-md overflow-hidden cursor-pointer group
                                                      ${slideIndex === index ? 'opacity-100': 'opacity-30'}`}  
                                                        onClick={()=> goto(index)}>
                                                      
                                                    <img src={item}
                                                     className='w-full transition-all group-hover:scale-105'/>
                                                </div>
                                            </SwiperSlide>
                                                )
                                            })
                                        }
                                            
                                           
                                            <SwiperSlide></SwiperSlide>
                
                                            
                                </Swiper>
                            </div>
                                 <div className='zoomContainer w-[85%] h-[500px] !overflow-hidden rounded-md'>
                
                                    <Swiper 
                                            ref={zoomSliderBig} 
                                            slidesPerView={1} 
                                            spaceBetween={0} 
                                            navigation={false}>
                                            {
                                                 product?.images?.map((item,index)=>{
                                                return(
                                                <SwiperSlide key={index}>
                                                    <InnerImageZoom zoomType='hover' zoomScale={1} src={item} />
                                                </SwiperSlide>   
                                                )})
                                            }

                                    </Swiper>
                
                                       
                                 </div>
                        </div>
            }
                

            </div>

            <div className='w-[60%]'>
                <h1 className="text-[25px] font-[500]">{product?.name}</h1>

                <div className="flex items-center py-1">
                    <span className='w-[20%] font-[500] flex items-center gap-2 text-[14px]'>
                     <MdBrandingWatermark className='opacity-50'/> Thương hiệu : </span>
                    <span className='text-[14px]'>{product?.brand}</span>
                </div>

                <div className="flex items-center py-1">
                    <span className='w-[20%] font-[500] flex items-center gap-2 text-[14px]'>
                     <BiSolidCategoryAlt className='opacity-50'/> Thể loại : </span>
                    <span className='text-[14px]'>{product?.catName}</span>
                </div>

                {
                    product?.productRam?.length!==0 && 

                     <div className="flex items-center py-1">
                        <span className='w-[20%] font-[500] flex items-center gap-2 text-[14px]'>
                        <MdFilterVintage className='opacity-50'/> Dung lượng : </span>

                        <div className="flex items-center gap-2">
                            {
                                product?.productRam?.map(((ram, index) => {
                                    return(
                                         <span className='text-[12px] inline-block p-1 shadow-sm bg-[#fff] font-[500]' key={index}>{ram} </span>
                                    )
                                }))

                            }
                        </div>
                       
                       
                    </div>
                }

                {
                    product?.size?.length!==0 && 

                     <div className="flex items-center py-1">
                        <span className='w-[20%] font-[500] flex items-center gap-2 text-[14px]'>
                        <MdFilterVintage className='opacity-50'/> Kích thước : </span>

                        <div className="flex items-center gap-2">
                            {
                                product?.size?.map(((size, index) => {
                                    return(
                                         <span className='text-[12px] inline-block p-1 shadow-sm bg-[#fff] font-[500]' key={index}>{size} </span>
                                    )
                                }))

                            }
                        </div>
                       
                       
                    </div>
                }

                {
                    product?.productWeight?.length!==0 && 

                     <div className="flex items-center py-1">
                        <span className='w-[20%] font-[500] flex items-center gap-2 text-[14px]'>
                        <MdFilterVintage className='opacity-50'/> Trọng lượng : </span>

                        <div className="flex items-center gap-2">
                            {
                                product?.productWeight?.map(((weight, index) => {
                                    return(
                                         <span className='text-[12px] inline-block p-1 shadow-sm bg-[#fff] font-[500]' key={index}>{weight} </span>
                                    )
                                }))

                            }
                        </div>
                       
                       
                    </div>
                }

                <div className="flex items-center py-1">
                    <span className='w-[20%] font-[500] flex items-center gap-2 text-[14px]'>
                     <MdRateReview className='opacity-50'/> Lượt đánh giá : </span>
                    <span className='text-[14px]'>({product?.reviews?.length> 0 ? product?.reviews?.length : 0})</span>
                </div>

                <div className="flex items-center py-1">
                    <span className='w-[20%] font-[500] flex items-center gap-2 text-[14px]'>
                     <BsPatchCheckFill className='opacity-50'/> Ngày đăng : </span>
                    <span className='text-[14px]'>{product?.createdAt?.split("T")[0]}</span>
                </div>

                 <br/>
                    <h2 className="text-[20px] font-[500]">Mô tả sản phẩm</h2>
                    {
                        product?.description &&  <div
    className="text-[14px]"
    dangerouslySetInnerHTML={{
      __html: product?.description.substring(0, 400) 
    }}
  />
                        
                    }
            </div>
        </div>

        {/* Đánh giá của khách hàng */}

        <br />
            <h2 className="text-[18px] font-[500]">Đánh Giá Sản Phẩm</h2>

            <div className="reviewsWrap mt-3">
                <div className="reviews w-full h-auto mb-3 p-4 bg-white rounded-sm shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-8">
                                {/* Ảnh đại diện người đánh giá */}
                        <div className="img w-[85px] h-[85px] rounded-full overflow-hidden">
                            <img src="https://media.loveitopcdn.com/54/091609-thumb-15222092411420-ds-770.jpg" className="w-full h-full object-cover" />
                        </div>
                                {/* Tên người đánh giá */}
                        <div className="info w-[80%]">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[16px] font-[500]">Nguyễn Huỳnh</h4>
                                <Rating name="read-only" value={4} readOnly  size='small'/>
                            </div>
                            <span className="text-[13px]">2025-01-08</span>
                            <p className='text-[13px] mt-2'>Thiết kế cạp cao: Giúp tôn dáng, tạo hiệu ứng đôi chân dài và thon gọn hơn, đồng thời mang lại sự thoải mái tối đa khi vận động.
                                    Kiểu dáng ống rộng: Phù hợp với nhiều dáng người, che đi khuyết điểm và tạo cảm giác thoải mái, tự do trong mọi hoạt động.
                                    Chất liệu co giãn cao cấp: Vải denim pha spandex mềm mại, co giãn tốt, ôm vừa vặn mà không gây gò bó, giúp bạn tự tin di chuyển cả ngày dài.
                                    Hiệu ứng phai màu thời thượng: Công nghệ wash phai màu độc đáo tạo nên vẻ ngoài bụi bặm, cá tính và vô cùng ấn tượng, dễ dàng phối hợp với các loại áo thun, áo kiểu hay sơ mi.
                                    Đa năng và dễ phối đồ: Dù đi làm, đi học, đi chơi hay dạo phố, chiếc quần 
                                    jeans này đều có thể biến hóa linh hoạt cùng nhiều phong cách khác nhau.!</p>
                        </div>


                    </div>
                </div>

                 <div className="reviews w-full h-auto mb-3 p-4 bg-white rounded-sm shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-8">
                                {/* Ảnh đại diện người đánh giá */}
                        <div className="img w-[85px] h-[85px] rounded-full overflow-hidden">
                            <img src="https://media.loveitopcdn.com/54/091609-thumb-15222092411420-ds-770.jpg" className="w-full h-full object-cover" />
                        </div>
                                {/* Tên người đánh giá */}
                        <div className="info w-[80%]">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[16px] font-[500]">Nguyễn Huỳnh</h4>
                                <Rating name="read-only" value={4} readOnly  size='small'/>
                            </div>
                            <span className="text-[13px]">2025-01-08</span>
                            <p className='text-[13px] mt-2'>Thiết kế cạp cao: Giúp tôn dáng, tạo hiệu ứng đôi chân dài và thon gọn hơn, đồng thời mang lại sự thoải mái tối đa khi vận động.
                                    Kiểu dáng ống rộng: Phù hợp với nhiều dáng người, che đi khuyết điểm và tạo cảm giác thoải mái, tự do trong mọi hoạt động.
                                    Chất liệu co giãn cao cấp: Vải denim pha spandex mềm mại, co giãn tốt, ôm vừa vặn mà không gây gò bó, giúp bạn tự tin di chuyển cả ngày dài.
                                    Hiệu ứng phai màu thời thượng: Công nghệ wash phai màu độc đáo tạo nên vẻ ngoài bụi bặm, cá tính và vô cùng ấn tượng, dễ dàng phối hợp với các loại áo thun, áo kiểu hay sơ mi.
                                    Đa năng và dễ phối đồ: Dù đi làm, đi học, đi chơi hay dạo phố, chiếc quần 
                                    jeans này đều có thể biến hóa linh hoạt cùng nhiều phong cách khác nhau.!</p>
                        </div>


                    </div>
                </div>

            </div>
            
            </>

        :

        <div className='flex items-center justify-center'>
            <CircularProgress color="inherit" />
        </div>


        }

        

        

       
        
      
    </>
  )
}

export default ProductDetails
