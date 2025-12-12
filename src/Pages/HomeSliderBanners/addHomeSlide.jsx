import React from "react";
import UploadBox from "../../Components/UploadBox";
// Mã [ Hình ảnh chỉ được tải khi cần thiết (người dùng cuộn tới) ]
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// Icon
import { IoClose } from "react-icons/io5";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';

import { useState } from "react";
import { useContext } from "react";
import { MyContext } from "../../App";
import { deleteImages, postData } from "../../utils/api";
import { useNavigate} from "react-router-dom"

const AddHomeSlide = () => {
  // Hàm hiển thị, kết nối từ server

  const [formFields, setFormFields] = useState({
    images: [],
  });

  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();

      // ✅ Cập nhật ảnh khi Upload thành công
    const setPreviewsFun = (previewsArr) => {
        // Gộp ảnh cũ và ảnh mới
        const updatedImages = [...formFields.images, ...previewsArr];

        // Cập nhật ảnh preview
        setPreviews(updatedImages);

        // Cập nhật vào formFields
        setFormFields(prev => ({
            ...prev,
            images: updatedImages
        }));
    };

   // ✅ Xoá ảnh ra khỏi UI & gọi API
   const removeImg = (image,index) => {
     var imageArr = [];
         imageArr = previews;
     deleteImages(`/api/homeSlides/deleteImage?img=${image}`).then((res)=>{
     imageArr.splice(index,1);
 
     setPreviews([]);
       setTimeout(() => {
           setPreviews(imageArr);
           formFields.images = imageArr
         }, 100);
       })
    }

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (previews?.length === 0) {
      context.alertBox("error", "Vui lòng chọn hình ảnh cho Slider");
      setIsLoading(false);
      return false;
    }

   postData("/api/homeSlides/add", formFields).then((res) => {
    
    setIsLoading(false);
    context?.alertBox?.('success', res?.message);
    
    context?.setIsOpenFullScreenPanel?.({
            open: false,
        });
    history("/homeSlider/list");
    // Code gốc
    // setTimeout(() => {
    //     setIsLoading(false);
    //     context?.setIsopenFullScreenPanel({
    //         open: false,
    //     });
    //     history("/homeSlider/list");
    // }, 1500);
    

})
  };

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {
              previews?.length !== 0 && previews?.map((image, index) => {
                return (
                  <div className="uploadBoxWrapper mr-3 relative" key={index}>

                    <span
                      className="absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                      onClick={() => removeImg(image, index)}>
                      <IoClose className="text-white text-[17px]" />
                    </span>

                  <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                    <img src={image} className="w-full"/>
                  </div>

                  </div>
                );
              })}

            <UploadBox
              multiple={false}
              name="images"
              url="/api/homeSlides/uploadImages"
              setPreviewsFun={setPreviewsFun}
            />
          </div>
        </div>
        <br /> <br />
        <div className="w-[250px]">
          <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
            {isLoading === true ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                <FaCloudUploadAlt className="text-[25px] text-white" /> Publish
                and View
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddHomeSlide;
