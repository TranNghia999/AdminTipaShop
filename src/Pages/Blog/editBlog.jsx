import React, { useContext, useEffect } from "react";
import UploadBox from "../../Components/UploadBox";
// Icon
import CircularProgress from '@mui/material/CircularProgress';
import { IoClose } from "react-icons/io5";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
// hàm kết nối
import { useState } from "react";
import { deleteImages, editData, fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";

// Hàm Tạo Nội Dung Tin Tức
import JoditEditor from "jodit-react";
import { useRef } from "react";

const EditBlog = () => {

  const context = useContext(MyContext);

  // Hàm Lịch Sử
  const history = useNavigate();

  const [previews, setPreviews] = useState([]);
  const [formFields, setFormFields] = useState({
    title: "",
    images: [],
    description: ""

  })

  // Của Viết Blog Nội dung
  const editor = useRef(null);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value
      }
    })
  }

  // ✅ Cập nhật ảnh khi Upload thành công
const setPreviewsFun = (previewsArr) => {
  setPreviews(previewsArr);
  setFormFields((prev) => ({
    ...prev,
    images: previewsArr
  }));
};

  // ✅ Xoá ảnh ra khỏi UI & gọi API
  const removeImg = (image, index) => {
    var imageArr = [];
    imageArr = previews;
    deleteImages(`/api/category/deleteImage?img=${image}`).then((res) => {
      imageArr.splice(index, 1);

      setPreviews([]);
      setTimeout(() => {
        setPreviews(imageArr);
        formFields.images = imageArr
      }, 100);
    })
  }

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.title === "") {
      context.alertBox("error", "Vui lòng nhập tiêu đề");
      setIsLoading(false);
      return false
    }

    if (formFields.description === "") {
      context.alertBox("error", "Vui lòng nhập nội dung");
      setIsLoading(false);
      return false
    }

    if (previews?.length === 0) {
      context.alertBox("error", "Vui lòng chọn hình ảnh ");
      setIsLoading(false);
      return false
    }
    // Nếu hợp lệ thì mới loading

    editData(`/api/blog/${context?.isOpenFullScreenPanel?.id}`, formFields).then((res) => {
      setTimeout(() => {
        setIsLoading(false);

        // Tự động đóng khi tải ảnh lên
        context.setIsOpenFullScreenPanel({
          open: false,
        })
        context?.getCat();
        history("/blog/list")
      }, 2500);
    })
  }

    // Hàm chỉnh sửa nội dung
      useEffect(()=>{
          const id = context?.isOpenFullScreenPanel?.id;
  
          fetchDataFromApi(`/api/blog/${id}`).then((res)=>{
              formFields.title=res?.blog?.title
              formFields.description=res?.blog?.description
              formFields.images = res?.blog?.images;   // ✅ giữ ảnh cũ
              setPreviews(res?.blog?.images)
              setHtml(res?.blog?.description)

                        // ép React render lại
              setFormFields({ ...formFields });
          })
  },[]);


  return (
    <section className="p-5 bg-gray-200">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">

          <div className='grid grid-cols-1 mb-3'>
            <div className='col w-full md:w-[100%]'>
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Tiêu Đề</h3>
              <input type='text'
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                name="title"
                value={formFields.title}
                onChange={onChangeInput}
              />
            </div>
          </div>


          {/* 🟢 Thêm phần Editor */}
          <div className="grid grid-cols-1 mb-3">
            <div className="col w-full md:w-[100%]">
              <h3 className="text-[14px] font-[500] mb-1 text-black">Nội Dung</h3>
              <JoditEditor
                config={{
                  height: 300, // chiều cao (px) bạn muốn, ví dụ 400px
                  placeholder: "Nhập nội dung tại đây...",
                  disablePlugins: ["hotkeys"],  // Tắt toàn bộ phím tắt
                  // Cho phép copy/paste chữ và hình ảnh
                  askBeforePasteHTML: false,
                  askBeforePasteFromWord: false,
                  pasteHTMLAction: "insert", // dán thẳng vào
                  defaultActionOnPaste: "insert_clear_html", // dán văn bản có format cơ bản
                  processPasteHTML: true,
                  processPasteFromWord: true,
                  allowPasteImages: true, // ⚡ quan trọng: cho phép dán ảnh

                 
                }}
                ref={editor}
                value={formFields.description}
                onBlur={(newContent) =>
                  setFormFields({ ...formFields, description: newContent })
                }
              />
            </div>
          </div>


          <h3 className='text-[14px] font-[500] mb-2 text-black'>Hình Ảnh </h3>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {/* Hiển thị hình ảnh tại đây */}
            {
              previews?.length !== 0 && previews?.map((image, index) => {
                return (
                  <div className="uploadBoxWrapper relative"
                    key={index}>
                    <span className="absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                      onClick={() => removeImg(image, index)}>
                      <IoClose className="text-white text-[17px]" />
                    </span>
                    <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">

                      <img src={image} className="w-[100px]" />
                    </div>
                  </div>)
              })
            }


            <UploadBox multiple={true}
              name="images"
              url="/api/blog/uploadImages"
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

export default EditBlog;
