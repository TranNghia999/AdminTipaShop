import React, { useState } from 'react'

import UploadBox from '../../Components/UploadBox';
// Mã [ Hình ảnh chỉ được tải khi cần thiết (người dùng cuộn tới) ]
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
// Mã Tùy chọn sản phẩm có sẵn của thanh
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// Đánh giá sao sản phẩm
import Rating from '@mui/material/Rating';
// Icon
import CircularProgress from '@mui/material/CircularProgress';
import { IoClose } from "react-icons/io5";
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from '../../App';
import { useContext } from 'react';
import { deleteImages, editData, fetchDataFromApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Nút Switch ở banner images
import Switch from '@mui/material/Switch';
const label = { inputProps: { 'aria-label': 'Switch demo' } };

// Hàm Tạo Nội Dung Nội Dung Chi tiết
import JoditEditor from "jodit-react";
import { useRef } from "react";


const EditProduct = () => {

    // Code Tùy chọn sản phẩm có sẵn của thanh

    const [productCat, setProductCat] = React.useState('');
    const [productSubCat, setProductSubCat] = React.useState('');
    const [productThirdLavelCat, setProductThirdLavelCat] = useState('');
    const [productFeatured, setProductFeatured] = React.useState(''); 

    const [productRams, setProductRams] = React.useState([]);
    const [productRamsData, setProductRamsData] = React.useState([]);
    
    const [productWeight, setProductWeight] = React.useState([]);
    const [productWeightData, setProductWeightData] = React.useState([]);
    
    const [productSize, setProductSize] = React.useState([]);
    const [productSizeData, setProductSizeData] = React.useState([]);

    // Danh mục chính
    const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
    formFields.catId=event.target.value
    formFields.category=event.target.value
  };
    const selectCatByName=(name)=>{
        formFields.catName=name
    }
    // Danh mục phụ
    const handleChangeProductSubCat = (event) => {
        setProductSubCat(event.target.value);
        formFields.subCatId=event.target.value
    };
    const selectSubCatByName=(name)=>{
        formFields.subCat=name
    }
    // Danh mục Phụ Của Phụ***
       const handleChangeProductThirdLavelCat = (event) => {
        setProductThirdLavelCat(event.target.value);
        formFields.thirdsubCatId=event.target.value
    };
    const selectSubCatThirdLavel=(name)=>{
        formFields.thirdsubCat=name
    }

    // Trạng thái Đúng Sai
    const handleChangeProductFeatured = (event) => {
    setProductFeatured(event.target.value);
    formFields.isFeatured = event.target.value
  };

    // Cấu hình Ram
  const handleChangeProductRams= (event) => {
    const {
                target: { value },
        } = event;
        setProductRams(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value,
        );

        formFields.productRam = value;
    };

        // cấu hình Cân Nặng
   const handleChangeProductWeight= (event) => {
    const {
                target: { value },
        } = event;
        setProductWeight(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value,
        );

        formFields.productWeight = value;
  };

    // Cấu hình Kích Thước
    const handleChangeProducSize= (event) => {
    setProductSize(event.target.value);
    const {
                target: { value },
        } = event;
        setProductSize(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value,
        );

        formFields.size = value;
  };

  // Hàm kết nối của Server
  const context = useContext(MyContext);
  // Hàm Lịch Sử
  const history = useNavigate();
  const [previews, setPreviews] = useState([]);

  // Của Banner Ảnh
  const [bannerPreviews, setBannerPreviews] = useState([]);
   
   // Của Viết Blog Nội dung
    const editor = useRef(null);

  // Biểu mẫu của Sản Phẩm [ Nguồn cấp dữ liệu của FE ]
  const [formFields, setFormFields] = useState({
    name: "",
    description: "",
    describe:"",
    images: [],
    brand1: "",
    brand: "",
    price: "",
    oldPrice: "",
    catName: "",
    catId: "",
    subCatId: "",
    subCat: "",
    thirdsubCat: "",
    thirdsubCatId: "",
    countInStock: "",
    rating: "",
    isFeatured: false,
    discount: "",
    productRam: [],
    size: [],
    productWeight: [],
    bannerTitleName:"",
    bannerimages:[],
    isDisplayOnHomeBanner:false
})

// Hàm nhập
    const onChangeInput=(e) => {
        const { name, value } = e.target;
        setFormFields(() => {
            return {
                ...formFields,
                [name]: value
            }
        })
    }

    // Hàm Đánh Giá
    const onChangeRating = (e) => {
        setFormFields((formFields) => (
            {
            ...formFields,
            rating: e.target.value
            }
        ))
    }

    const [isLoading, setIsLoading] = useState(false);
    const handleSubmitg=(e)=>{
        e.preventDefault();

        if(formFields.name === ""){
             context.alertBox("error", "Vui lòng nhập tên sản phẩm");
             return false;
        }

        if(formFields.description === ""){
             context.alertBox("error", "Vui lòng nhập mô tả sản phẩm");
             return false;
        }

        if(formFields.describe === ""){
             context.alertBox("error", "Vui lòng nhập mô tả chi tiết sản phẩm");
             return false;
        }

        if(formFields?.catId === ""){
             context.alertBox("error", "Vui lòng chọn danh mục ");
             return false;
        }

        if(formFields?.price === ""){
             context.alertBox("error", "Vui lòng nhập giá sản phẩm");
             return false;
        }

        if(formFields?.oldPrice === ""){
             context.alertBox("error", "Vui lòng nhập giá cũ sản phẩm");
             return false;
        }

        if(formFields?.countInStock === ""){
             context.alertBox("error", "Vui lòng nhập số lượng kho");
             return false;
        }

        if(formFields?.brand1 === ""){
             context.alertBox("error", "Vui lòng nhập mã sản phẩm");
             return false;
        }

        if(formFields?.brand === ""){
             context.alertBox("error", "Vui lòng nhập thương hiệu sản phẩm");
             return false;
        }

        

        if(formFields?.discount === ""){
             context.alertBox("error", "Vui lòng nhập giá giảm");
             return false;
        }

        if(formFields?.rating === ""){
             context.alertBox("error", "Vui lòng chọn số lượng đánh giá");
             return false;
        }

        if(previews?.length === 0){
            context.alertBox("error", "Vui lòng chọn hình ảnh sản phẩm");
            return false;
        }

        setIsLoading(true);

        editData(`/api/product/updateProduct/${context?.isOpenFullScreenPanel?.id}`, formFields).then((res) => {
        
        if (res?.data?.error === false) {
            context.alertBox("success", res?.data?.message);
            setTimeout(() => {
                setIsLoading(false);
                context.setIsOpenFullScreenPanel({
                    open: false,
                })
                history("/products");
            }, 1000);
        }else{
            setIsLoading(false);
            context.alertBox("error", res?.data?.message);
        }
        })

    }

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

      // Cập Nhật ảnh của Ảnh Banner
    const setBannerImagesFun = (previewsArr) => {
        const imgArr = bannerPreviews;
        for (let i = 0; i < previewsArr.length; i++) {
            imgArr.push(previewsArr[i])
        }
        setBannerPreviews([])
            setTimeout(() => {
                setBannerPreviews(imgArr)
                formFields.bannerPreviews = imgArr
            }, 10);
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
              formFields.images = imageArr
            }, 100);
          })
        } 

       // ✅ Xoá ảnh Banner ra khỏi UI & gọi API
        const removeBannerImg = (image,index) => {
            var imageArr = [];
                imageArr = bannerPreviews;
            deleteImages(`/api/category/deleteImage?img=${image}`).then((res)=>{
            imageArr.splice(index,1);
        
            setBannerPreviews([]);
              setTimeout(() => {
                  setBannerPreviews(imageArr);
                  formFields.bannerPreviews = imageArr
                }, 100);
              })
            } 

            // Của Switch
    const [checkedSwitch, setCheckedSwitch] = useState(false);
    
         const handleChangeSwitch=(event)=>{
        setCheckedSwitch(event.target.checked);
            formFields.isDisplayOnHomeBanner = event.target.checked;
    }


        // Code chỉnh Sửa Lại Sản Phẩm

        useEffect((() => {

             fetchDataFromApi("/api/product/productRAMS/get").then((res) => {
                        if (res?.error === false) {
                                setProductRamsData(res?.data);
                            }
                        });
            
                    fetchDataFromApi("/api/product/productWeight/get").then((res) => {
                        if (res?.error === false) {
                                setProductWeightData(res?.data);
                            }
                        });
            
                    fetchDataFromApi("/api/product/productSize/get").then((res) => {
                        if (res?.error === false) {
                                setProductSizeData(res?.data);
                            }
                        });

            fetchDataFromApi(`/api/product/${context?.isOpenFullScreenPanel?.id}`).then((res) => {
                
                setFormFields({
                                name: res?.product?.name,
                                description: res?.product?.description,
                                describe: res?.product?.describe,
                                images: res?.product?.images,
                                brand1: res?.product?.brand1,
                                brand: res?.product?.brand,
                                price: res?.product?.price,
                                oldPrice: res?.product?.oldPrice,
                                category: res?.product?.category,
                                catName: res?.product?.catName,
                                catId: res?.product?.catId,
                                subCatId: res?.product?.subCatId,
                                subCat: res?.product?.subCat,
                                thirdsubCat: res?.product?.thirdsubCat,
                                thirdsubCatId: res?.product?.thirdsubCatId,
                                countInStock: res?.product?.countInStock,
                                rating: res?.product?.rating,
                                isFeatured: res?.product?.isFeatured,
                                discount: res?.product?.discount,
                                productRam: res?.product?.productRam,
                                size: res?.product?.size,
                                productWeight: res?.product?.productWeight,
                                bannerTitleName: res?.product?.bannerTitleName,
                                bannerimages: res?.product?.bannerimages,
                                isDisplayOnHomeBanner: res?.product?.isDisplayOnHomeBanner
                                })

                                setProductCat(res?.product?.catId);
                                setProductSubCat(res?.product?.subCatId);
                                setProductThirdLavelCat(res?.product?.thirdsubCatId);
                                setProductFeatured(res?.product?.isFeatured)
                                setProductRams(res?.product?.productRam)
                                setProductSize(res?.product?.size)
                                setProductWeight(res?.product?.productWeight)

                                setPreviews(res?.product?.images);
                                setBannerPreviews(res?.product?.bannerimages);
            })
        }), []);


  return (
    <section className='p-5 bg-gray-200'>
        <form className='form py-1 p-1 md:p-8 md:py-1' onSubmit={handleSubmitg}>

        <div className='scroll max-h-[72vh] overflow-y-scroll pr-4'>

            <div className='grid grid-cols-1 mb-3'>
                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Tên Sản Phẩm</h3>
                    <input  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            type='text'
                            name="name" 
                            value={formFields.name}
                            onChange={onChangeInput} 
                        />
                </div>
            </div>

            <div className='grid grid-cols-1 mb-3'>
                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Mô Tả Sản Phẩm</h3>
                   
                    <JoditEditor
                    config={{
                    height: 330, // chiều cao (px) bạn muốn, ví dụ 400px
                    placeholder: "Nhập nội dung mô tả sản phẩm tại đây. (Lưu ý: Giới hạn 500 ký tự, tính cả khoảng trắng và dấu câu).",
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
                   
                    {/* <textarea   className='w-full h-[140px] border !bg-[#fff] border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                                type='text'
                                name="description" 
                                value={formFields.description}
                                onChange={onChangeInput}
                    /> */}
                </div>
            </div>

            <div className='grid grid-cols-1 mb-3'>
                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Mô Tả Chi Tiết Sản Phẩm</h3>
                   
                    <JoditEditor
                config={{
                  height: 430, // chiều cao (px) bạn muốn, ví dụ 400px
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
                value={formFields.describe}
                onBlur={(newContent) =>
                  setFormFields({ ...formFields, describe: newContent })
                }
              />
                   
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-3 gap-4'>
                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Danh Mục Chính </h3>
                        {/* Danh mục hàng  */}
                    {
                        context?.catData?.length !== 0 &&
                        
                         <Select
                        labelId="demo-simple-select-label"
                        id="productCatDrop"
                        size='small'
                        className='w-full'
                        value={productCat}
                        label="Category"
                        onChange={handleChangeProductCat}
                        >

                        {
                            context?.catData?.map(((cat,index)=>{
                            return(
                                <MenuItem   value={cat?._id} key={index}
                                            onClick={() => selectCatByName(cat?.name)}
                                    >{cat?.name}</MenuItem>
                            )
                            }))
                        }
                            
                        </Select>
                    }
                  
                </div>

                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Danh Mục Phụ</h3>
                        {/* Danh mục phụ */}
                      {
                        context?.catData?.length !== 0 &&
                        
                         <Select
                        labelId="demo-simple-select-label"
                        id="productCatDrop"
                        size='small'
                        className='w-full'
                        value={productSubCat}
                        label="Sub Category"
                        onChange={handleChangeProductSubCat}
                        >

                        {
                            context?.catData?.map(((cat,index)=>{
                            return(
                                    cat?.children?.length !== 0 && cat?.children?.
                                        map((subCat, index_) => {
                                        return (
                                                <MenuItem   value={subCat?._id} key={index}
                                                            onClick={() => selectSubCatByName(subCat?.name)}
                                                >
                                                {subCat?.name}</MenuItem>
                                            )
                                        })
                                    )
                            }))
                        }
                            
                        </Select>
                    }
                  
                </div>

                 <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Danh Mục Con </h3>
                        {/* Danh mục phụ của DANH MỤC PHỤ */}
                      {
                        context?.catData?.length !== 0 &&
                        
                         <Select
                        labelId="demo-simple-select-label"
                        id="productCatDrop"
                        size='small'
                        className='w-full'
                        value={productThirdLavelCat}
                        label="Sub Category"
                        onChange={handleChangeProductThirdLavelCat}
                        >

                        {
                            context?.catData?.map(((cat)=>{
                            return(
                                    cat?.children?.length !== 0 && cat?.children?.
                                        map((subCat) => {
                                        return (
                                                subCat?.children?.length!==0 && subCat?.children?.map(((thirdLavelCat, index)=>
                                                        {
                                                            return (
                                                                    <MenuItem   value={thirdLavelCat?._id} 
                                                                                key={index}
                                                                                 onClick={() => selectSubCatThirdLavel(thirdLavelCat?.name)}>
                                                                        {thirdLavelCat?.name}
                                                                    </MenuItem>
                                                                    )
                                                        }))
                                                
                                                )
                                        })
                                    )
                            }))
                        }
                            
                        </Select>
                    }
                  
                </div>

                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Giá Sản Phẩm</h3>
                    <input  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            type='number'
                            name="price" 
                            value={formFields.price}
                            onChange={onChangeInput}
                        />
                </div>

                  <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Giá cũ Sản phẩm </h3>
                    <input  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            type='number'
                            name="oldPrice" 
                            value={formFields.oldPrice}
                            onChange={onChangeInput}
                    />
                </div>

                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Kho Sản Phẩm</h3>
                    <input  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            type='number'
                            name="countInStock" 
                            value={formFields.countInStock}
                            onChange={onChangeInput}
                    />
                </div>

                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Thương Hiệu Sản Phẩm</h3>
                    <input  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            type='text'
                            name="brand" 
                            value={formFields.brand}
                            onChange={onChangeInput}
                    />
                </div>

                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Mã hàng hoá (Bắt buộc)</h3>
                    <input  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            type='text'
                            name="brand1" 
                            value={formFields.brand1}
                            onChange={onChangeInput}
                    />
                </div>

                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Giảm Giá Sản Phẩm</h3>
                    <input  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            type='number'
                            name="discount" 
                            value={formFields.discount}
                            onChange={onChangeInput}
                        />
                </div> 

                 <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>RAM Sản Phẩm SmartPhone</h3>
                    {
                        productRamsData?.length !== 0 &&
                            <Select
                               multiple
                               labelId="demo-simple-select-label"
                               id="productCatDrop"
                               size='small'
                               className='w-full'
                               value={productRams}
                               label="Category"
                               onChange={handleChangeProductRams}
                                   >
                            {
                                productRamsData?.map((item, index) => {
                                    return <MenuItem key={index} value={item?.name}>{item?.name}</MenuItem>
                                   })
                            }                   
                            </Select>
                       }
                </div>

              <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Trọng Lượng Sản Phẩm</h3>
                    {
                      productWeightData?.length !== 0 &&  
                          <Select
                        multiple
                        labelId="demo-simple-select-label"
                        id="productCatDrop"
                        size='small'
                        className='w-full'
                        value={productWeight}
                        label="Category"
                        onChange={handleChangeProductWeight}
                        >
                    {
                         productWeightData?.map((item, index) => {
                            return <MenuItem key={index} value={item?.name}>{item?.name}</MenuItem>
                        })
                    }
                    </Select>
                    }
                </div>

                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Kích Thước Sản Phẩm</h3>
                    {
                        productSizeData?.length !== 0 &&  
                        <Select
                        multiple
                        labelId="demo-simple-select-label"
                        id="productCatDrop"
                        size='small'
                        className='w-full'
                        value={productSize}
                        label="Category"
                        onChange={handleChangeProducSize}
                        >
                      
                    {
                        productSizeData?.map((item, index) => {
                            return <MenuItem key={index} value={item?.name}>{item?.name}</MenuItem>
                        })
                    }
                       
                        </Select>
                    }
                </div>

                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Trạng Thái Nổi Bật</h3>
                   <Select
                        labelId="demo-simple-select-label"
                        id="productCatDrop"
                        size='small'
                        className='w-full'
                        value={productFeatured}
                        label="Category"
                        onChange={handleChangeProductFeatured}
                        >
                        <MenuItem value={true}>True</MenuItem>
                        <MenuItem value={false}>False</MenuItem>
                       
                    </Select>
                </div>

            </div>

             <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-3'>

                 {/* Đánh giá Sản Phẩm */}
                     <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Lượt Đánh giá</h3>
                    <Rating name="rating" value={formFields.rating}
                            onChange={onChangeRating}
                    />
                </div>
             </div>


            <div className='col w-full p-5 px-0 '>
                  <h3 className='font-[700] text-[18px] mb-3'>Hình Ảnh Sản Phẩm</h3>

                   <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
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
                            url="/api/product/uploadImages" 
                            setPreviewsFun={setPreviewsFun}
                />
          </div>

            </div>  

                <div className='col w-full p-5 px-0 '>
                            <div className='shadow-mg bg-white p-4 w-full mb-3'>
                        <div className='flex items-center gap-8'>
                                <h3 className='font-[700] text-[18px] mb-3'>Hình Ảnh Banner</h3>
                            <Switch {...label} onChange={handleChangeSwitch}  checked={checkedSwitch} />
                           
                        </div>
                            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                      {/* Hiển thị hình ảnh tại đây */}
                       {
                            bannerPreviews?.length !== 0 && bannerPreviews?.map((image,index)=>{
                              return(
                            <div className="uploadBoxWrapper relative"
                                      key={index}>
                          <span className="absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                                onClick={()=>removeBannerImg(image,index)}>
                            <IoClose className="text-white text-[17px]" />
                          </span>
                          <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                            
                            <img src={image} className="w-[100px]"/>
                          </div>
                          
                        </div>
                        )
                          })
                          }
                        
            
                            <UploadBox  multiple={true} 
                                        name="bannerimages" 
                                        url="/api/product/uploadBannerImages" 
                                         setPreviewsFun={setBannerImagesFun}
                            />
            
                             </div>
            
                            <br/>
            
                            <h3 className='font-[700] text-[18px] mb-3'>Tiêu Đề Banner</h3>
                            <input  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                                        type='text'
                                        name="bannerTitleName" 
                                        value={formFields.bannerTitleName}
                                        onChange={onChangeInput} 
                                    />
            
                            
                            </div>
            
                            
                        </div> 
            
            </div>

                <hr />
                <br />

                <Button type='submit' className='btn-blue btn-lg w-full flex gap-2'>
                    {
                        isLoading === true ? <CircularProgress color="inherit" /> : 
                        <>
                      <FaCloudUploadAlt className="text-[25px] text-white" /> Publish and View
                        </>
                    }
                </Button>

        </form>
    </section>
  )
}

export default EditProduct;
