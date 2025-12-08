import React, { useState } from "react";
// Mã Tùy chọn sản phẩm có sẵn của thanh
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useContext } from "react";
import { MyContext } from "../../App";
import UploadBox from "../../Components/UploadBox";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import { IoClose } from "react-icons/io5";
import { deleteImages, postData } from "../../utils/api";

const AddBannerV1 = () => {
  // Hàm kết nối của Server
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  // Hàm Lịch Sử
  const history = useNavigate();

  // Các Danh Mục : Chính => Phụ => Con
  const [productCat, setProductCat] = useState("");
  const [productSubCat, setProductSubCat] = React.useState("");
  const [productThirdLavelCat, setProductThirdLavelCat] = useState("");
  // Chọn bên trái phải
  const [alignInfo, setAlignInfo] = useState("");

  // Của hiển thị hình ảnh dữ liệu
  const [previews, setPreviews] = useState([]);

  // Danh mục chính
  const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
    formFields.catId = event.target.value;
  };

  // Danh mục phụ
  const handleChangeProductSubCat = (event) => {
    setProductSubCat(event.target.value);
    formFields.subCatId = event.target.value;
  };

  // Danh mục Phụ Của Phụ***
  const handleChangeProductThirdLavelCat = (event) => {
    setProductThirdLavelCat(event.target.value);
    formFields.thirdsubCatId = event.target.value;
  };

  // Của Chọn Trái - Phải
  const handleChangeAlignInfo = (event) => {
    setAlignInfo(event.target.value);
    formFields.alignInfo = event.target.value;
  };

  const [formFields, setFormFields] = useState({
    images: [],
    catId: "",
    bannerTitle: "",
    subCatId: "",
    thirdsubCatId: "",
    price: "",
    alignInfo: "",
  });

  // Hàm nhập
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  // ✅ Cập nhật ảnh khi Upload thành công
  const setPreviewsFun = (previewsArr) => {
    // Gộp ảnh cũ và ảnh mới
    const updatedImages = [...formFields.images, ...previewsArr];

    // Cập nhật ảnh preview
    setPreviews(updatedImages);

    // Cập nhật vào formFields
    setFormFields((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  // ✅ Xoá ảnh ra khỏi UI & gọi API
  const removeImg = (image, index) => {
    var imageArr = [];
    imageArr = previews;
    deleteImages(`/api/bannerV1/deleteImage?img=${image}`).then((res) => {
      imageArr.splice(index, 1);

      setPreviews([]);
      setTimeout(() => {
        setPreviews(imageArr);
        formFields.images = imageArr;
      }, 100);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.bannerTitle === "") {
      context.alertBox("error", "Vui lòng nhập tiêu đề");
      setIsLoading(false);
      return false;
    }

    if (formFields.price === "") {
      context.alertBox("error", "Vui lòng nhập giá");
      setIsLoading(false);
      return false;
    }

    if (previews?.length === 0) {
      context.alertBox("error", "Vui lòng chọn hình ảnh danh mục");
      setIsLoading(false);
      return false;
    }
    // Nếu hợp lệ thì mới loading
    postData("/api/bannerV1/add", formFields).then((res) => {
      setTimeout(() => {
        setIsLoading(false);

        // Tự động đóng khi tải ảnh lên
        context.setIsOpenFullScreenPanel({
          open: false,
        });
        context?.getCat();
        history("/bannerV1/list");
      }, 2500);
    });
  };

  return (
    <section className="p-5 bg-gray-200">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
          <div className="grid grid-cols-5 mb-3 gap-5">
            <div className="col w-full ">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Tiêu Đề Banner
              </h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="bannerTitle"
                value={formFields.bannerTitle}
                onChange={onChangeInput}
              />
            </div>
            {/* Danh mục Chính */}
            <div className="col w-full">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Danh Mục Chính
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  size="small"
                  className="w-full"
                  value={productCat}
                  label="Category"
                  onChange={handleChangeProductCat}
                >
                  {context?.catData?.map((cat, index) => {
                    return (
                      <MenuItem value={cat?._id} key={index}>
                        {cat?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            </div>
            {/* Danh mục Phụ */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Danh Mục Phụ
              </h3>
              {/* Danh mục phụ */}
              {context?.catData?.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  size="small"
                  className="w-full"
                  value={productSubCat}
                  label="Sub Category"
                  onChange={handleChangeProductSubCat}
                >
                  {context?.catData?.map((cat, index) => {
                    return (
                      cat?.children?.length !== 0 &&
                      cat?.children?.map((subCat, index_) => {
                        return (
                          <MenuItem value={subCat?._id} key={index}>
                            {subCat?.name}
                          </MenuItem>
                        );
                      })
                    );
                  })}
                </Select>
              )}
            </div>
            {/* Danh mục Con */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Danh Mục Con{" "}
              </h3>
              {/* Danh mục phụ của DANH MỤC PHỤ */}
              {context?.catData?.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  size="small"
                  className="w-full"
                  value={productThirdLavelCat}
                  label="Sub Category"
                  onChange={handleChangeProductThirdLavelCat}
                >
                  {context?.catData?.map((cat) => {
                    return (
                      cat?.children?.length !== 0 &&
                      cat?.children?.map((subCat) => {
                        return (
                          subCat?.children?.length !== 0 &&
                          subCat?.children?.map((thirdLavelCat, index) => {
                            return (
                              <MenuItem value={thirdLavelCat?._id} key={index}>
                                {thirdLavelCat?.name}
                              </MenuItem>
                            );
                          })
                        );
                      })
                    );
                  })}
                </Select>
              )}
            </div>

            {/* Giá */}
            <div className="col w-full ">
              <h3 className="text-[14px] font-[500] mb-1 text-black">Giá</h3>
              <input
                type="text"
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                name="price"
                value={formFields.price}
                onChange={onChangeInput}
              />
            </div>

            {/* Chọn Trái Phải */}
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Vị Trí Hiển Thị
              </h3>
              {/* Danh mục phụ của DANH MỤC PHỤ */}
              {context?.catData?.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  size="small"
                  className="w-full"
                  value={alignInfo}
                  label="Sub Category"
                  onChange={handleChangeAlignInfo}
                >
                  <MenuItem value={"left"}>Trái</MenuItem>
                  <MenuItem value={"right"}>Phải</MenuItem>
                </Select>
              )}
            </div>
          </div>

          <br />

          <h3 className="text-[14px] font-[500] mb-3 text-black">
            Hình Ảnh Banner
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {/* Hiển thị hình ảnh tại đây */}
            {previews?.length !== 0 &&
              previews?.map((image, index) => {
                return (
                  <div className="uploadBoxWrapper relative" key={index}>
                    <span
                      className="absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                      onClick={() => removeImg(image, index)}
                    >
                      <IoClose className="text-white text-[17px]" />
                    </span>
                    <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                      <img src={image} className="w-[100px]" />
                    </div>
                  </div>
                );
              })}

            <UploadBox
              multiple={true}
              name="images"
              url="/api/bannerV1/uploadImages"
              setPreviewsFun={setPreviewsFun}
            />
          </div>
        </div>
        <br />

        <div className="w-[250px]">
          <Button className="btn-blue btn-lg w-full flex gap-2" type="submit">
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

export default AddBannerV1;
