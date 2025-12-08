import React, { useContext, useEffect } from "react";
import UploadBox from "../../Components/UploadBox";
// Mã [ Hình ảnh chỉ được tải khi cần thiết (người dùng cuộn tới) ]
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// Icon
import CircularProgress from '@mui/material/CircularProgress';
import { IoClose } from "react-icons/io5";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
// hàm kết nối
import { useState } from "react";
import { deleteImages, editData, fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";

const EditCategory = () => {

  const context = useContext(MyContext);
  const [previews, setPreviews] = useState([]);
  const [formFields, setFormFields] = useState({
      name:"",
      images:[]
     
  })

  const onChangeInput=(e) => {
    const { name, value } = e.target;
      setFormFields(() => {
          return {
              ...formFields,
              [name]: value
          }
      })
      formFields.images = previews
  }

   // ✅ Cập nhật ảnh khi Upload thành công
const setPreviewsFun = (previewsArr) => {
  setPreviews(previewsArr)
  formFields.images = previewsArr
}

    // ✅ Xoá ảnh ra khỏi UI & gọi API
  const removeImg = (image,index) => {
    var imageArr = [];
        imageArr = previews;
    deleteImages(`/api/category/deleteImage?img=${image}`).then((res)=>{
    imageArr.splice(index,1);

    setPreviews([]);
      setTimeout(() => {
          setPreviews(imageArr);
          formFields.images = previewsArr
        }, 100);
      })
    }

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit=(e)=>{
      e.preventDefault();

      setIsLoading(true);

      if (formFields.name === "") {
        context.alertBox("error", "Vui lòng nhập tên danh mục");
        setIsLoading(false);
        return false
      }

      if (previews?.length === 0) {
        context.alertBox("error", "Vui lòng chọn hình ảnh danh mục");
         setIsLoading(false);
        return false
      }
      
      // Lưu ảnh khi sửa
      editData(`/api/category/${context?.isOpenFullScreenPanel?.id}`,formFields).then((res)=>{
        console.log(res)
        setTimeout(() => {
          setIsLoading(false);

           // Tự động đóng khi tải ảnh lên
            context.setIsOpenFullScreenPanel({
              open: false,
            })
        }, 1500);
      })
    }

    // Hàm chỉnh sửa nội dung
    useEffect(()=>{
        const id = context?.isOpenFullScreenPanel?.id;

        fetchDataFromApi(`/api/category/${id}`).then((res)=>{
            console.log(res?.category)
            formFields.name=res?.category?.name
            setPreviews(res?.category?.images)
        })
},[]);


  return (
    <section className="p-5 bg-gray-200">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">

          <div className='grid grid-cols-1 mb-3'>
                <div className='col w-full md:w-[25%]'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Tên Danh Mục</h3>
                    <input type='text'
                        className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                           name="name"
                           value={formFields.name}
                           onChange={onChangeInput}
                        />
                </div>
            </div>
            <br />

            <h3 className='text-[14px] font-[500] mb-2 text-black'>Hình Ảnh Danh Mục</h3>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {/* Hiển thị hình ảnh tại đây */}
           {
                previews?.length !== 0 && previews?.map((image,index)=>{
                  return(
                    <div className="uploadBoxWrapper relative"
                          key={index}>
              <span className="absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                    onClick={()=>removeImg(image,index)}>
                <IoClose className="text-white text-[17px]" />
              </span>
              <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                
                <img src={image} className="w-[100px]"/>
              </div>
            </div>)
              })
              }
            

            <UploadBox  multiple={true} 
                        name="images" 
                        url="/api/category/uploadImages" 
                        setPreviewsFun={setPreviewsFun}
            />
          </div>
        </div>
        <br /> <br />
        <div className="w-[250px]">
          <Button className="btn-blue btn-lg w-full flex gap-2"
                  type='submit'>
                  {
                    isLoading === true ? <CircularProgress color="inherit" /> : 
                    <>
                      <FaCloudUploadAlt className="text-[25px] text-white" /> Publish and View
                    </>
                  }
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditCategory;
