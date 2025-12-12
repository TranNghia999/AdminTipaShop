import React, { useEffect, useState, useContext } from "react";
import UploadBox from "../../Components/UploadBox";
import { IoClose } from "react-icons/io5";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";
import { deleteImages, editData, fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const EditHomeSlide = () => {
  const context = useContext(MyContext);
  const history = useNavigate();

  const [formFields, setFormFields] = useState({
    images: [],
  });

  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const slideId = context?.isOpenFullScreenPanel?.id;

  // -------------------------------------------------------
  // 1. LOAD DATA
  // -------------------------------------------------------
  useEffect(() => {
    if (!slideId) return;

    fetchDataFromApi(`/api/homeSlides/${slideId}`).then((res) => {
      const slide = res?.slide ?? res?.banner;

      if (slide) {
        setPreviews(slide.images);
        setFormFields({
          images: slide.images,
        });
      }
    });
  }, [slideId]);

  // -------------------------------------------------------
  // 2. ADD IMAGE
  // -------------------------------------------------------
  const setPreviewsFun = (newImgs) => {
    const updated = [...formFields.images, ...newImgs];

    setPreviews(updated);
    setFormFields((prev) => ({
      ...prev,
      images: updated,
    }));
  };

  // -------------------------------------------------------
  // 3. REMOVE IMAGE
  // -------------------------------------------------------
  const removeImg = (image, index) => {
    const arr = [...previews];

    deleteImages(`/api/homeSlides/deleteImage?img=${image}`).then(() => {
      arr.splice(index, 1);

      setPreviews([]);
      setTimeout(() => {
        setPreviews(arr);
        setFormFields((prev) => ({
          ...prev,
          images: arr,
        }));
      }, 50);
    });
  };

  // -------------------------------------------------------
  // 4. SUBMIT UPDATE
  // -------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (previews.length === 0) {
      context.alertBox("error", "Vui lòng chọn hình");
      return;
    }

    setIsLoading(true);

    editData(`/api/homeSlides/${slideId}`, formFields).then(() => {
      setIsLoading(false);

      context.alertBox("success", "Cập nhật slider thành công!");

      context.setIsOpenFullScreenPanel({ open: false });

      history("/homeSlider/list");
    });
  };

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">

          <h3 className="text-[16px] font-[600] mb-3 text-black">
            Hình Ảnh Slider (W:1170 x H:450)
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">

            {previews?.length !== 0 &&
              previews.map((image, index) => {
                return(
              <div className="uploadBoxWrapper relative" key={index}>

                {/* nút xóa */}
                <span
                  className="absolute w-[22px] h-[22px] rounded-full bg-red-600 -top-[6px] -right-[6px] flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100 z-50"
                  onClick={() => removeImg(image, index)}
                >
                  <IoClose className="text-white text-[17px]" />
                </span>

                {/* khung ảnh */}
                <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">

                  {/* ảnh giữ nguyên tỉ lệ, không méo */}
                   <img src={image} className="w-[100px]" />
                </div>
              </div>
              )
            })}

            {/* Upload thêm ảnh */}
            <UploadBox
              multiple={false}
              name="images"
              url="/api/homeSlides/uploadImages"
              setPreviewsFun={setPreviewsFun}
            />
          </div>
        </div>

        <br /><br />

        <div className="w-[250px]">
          <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
            {isLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                <FaCloudUploadAlt className="text-[25px] text-white" /> 
                Publish and View
              </>
            )}
          </Button>
        </div>

      </form>
    </section>
  );
};

export default EditHomeSlide;
