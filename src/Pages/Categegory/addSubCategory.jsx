import React, { useContext, useState } from "react";
// Mã Tùy chọn sản phẩm có sẵn của thanh
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// Icon
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const AddSubCategory = () => {

  
      // Code Tùy chọn sản phẩm có sẵn của thanh
  
    const [productCat, setProductCat] = useState('');

    const handleChangeProductCat = (event) => {
        setProductCat(event.target.value);

        formFields.parentId = event.target.value;
      };

      // Phần của backend
    const context = useContext(MyContext);
      // Hàm Lịch Sử
      const history = useNavigate();

      // Biểu mẫu của form 1
     const [formFields, setFormFields] = useState({
      name:"",
      parentCatName: null,
      parentId: null
    })

    const selecteCatFun=(catName)=>{
      formFields.parentCatName = catName
    }

    const onChangeInput=(e) => {
      const { name, value } = e.target;

      const catId = productCat
      setProductCat(catId);

          setFormFields(() => {
              return {
                  ...formFields,
                  [name]: value
              }
          })
      }

    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit=(e)=>{
          e.preventDefault();
    
          setIsLoading(true);

          if (productCat==="") {
            context.alertBox("error", "Vui lòng chọn danh mục gốc");
             setIsLoading(false);
            return false
          }
    
          if (formFields.name === "") {
            context.alertBox("error", "Vui lòng nhập tên danh mục");
            setIsLoading(false);
            return false
          }
    
          
          // Nếu hợp lệ thì mới loading
          
          postData("/api/category/create",formFields).then((res)=>{
            console.log(res)
            setTimeout(() => {
              setIsLoading(false);
    
               // Tự động đóng khi tải ảnh lên
                context.setIsOpenFullScreenPanel({
                  open: false,
                })
                context?.getCat();
                history("/subCategory/list")
            }, 2500);
          })
        }

        // Bản 2: form2 Thêm danh mục Lavel thứ ba
    const [isLoading2, setIsLoading2] = useState(false);
    const [productCat2, setProductCat2] = useState('');
    const [formFields2, setFormFields2] = useState({
      name:"",
      parentCatName: null,
      parentId: null
    })


     const onChangeInput2=(e) => {
      const { name, value } = e.target;

      const catId = productCat2
      setProductCat2(catId);

          setFormFields2(() => {
              return {
                  ...formFields2,
                  [name]: value
              }
          })
      }

      const selecteCatFun2=(catName)=>{
        formFields2.parentCatName = catName
      }

    const handleChangeProductCat2 = (event) => {
        setProductCat2(event.target.value);

        formFields2.parentId = event.target.value;
      };

      const handleSubmit2=(e)=>{
          e.preventDefault();
    
          setIsLoading2(true);

          if (productCat2==="") {
            context.alertBox("error", "Vui lòng chọn danh mục gốc");
             setIsLoading2(false);
            return false
          }
    
          if (formFields2.name === "") {
            context.alertBox("error", "Vui lòng nhập tên danh mục");
            setIsLoading2(false);
            return false
          }
    
          
          // Nếu hợp lệ thì mới loading
          
          postData("/api/category/create",formFields2).then((res)=>{
            console.log(res)
            setTimeout(() => {
              setIsLoading2(false);
    
               // Tự động đóng khi tải ảnh lên
                context.setIsOpenFullScreenPanel({
                  open: false,
                })
                context?.getCat();
            }, 2500);
          })
        }

  return (
    <section className="p-5 bg-gray-200 grid grid-cols-2 gap-10">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
            <h4 className="font-[600]">Danh Mục Phụ</h4>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">

          <div className='grid grid-cols-2 mb-3 gap-5'>
                  <div className='col '>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Danh mục sản phẩm</h3>
                   <Select
                        labelId="demo-simple-select-label"
                        id="productCatDrop"
                        size='small'
                        className='w-full'
                        value={productCat}
                        label="Category"
                        onChange={handleChangeProductCat}
                        >
                              {/* Lấy dữ liệu của CategoryList để hiển thị ở đây */}
                        {
                           context?.catData?.length!==0 && context?.catData?.map((item,index)=>{
                              return( 
                                      <MenuItem key={index} value={item?._id} onClick={selecteCatFun(item?.name)} > 
                                                {item?.name}
                                      </MenuItem>
                              )
                            })
                        }
                    </Select>
                </div>

                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Tên danh mục phụ</h3>
                  <input type='text'
                        className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                          name="name"
                          value={formFields.name}
                          onChange={onChangeInput}
                        />
                </div>
            </div>
            <br />

           
        </div>
        
        <div className="w-[250px]">
          <Button className="btn-blue btn-lg w-full flex gap-2"
                  type="submit">
                 {
                    isLoading === true ? <CircularProgress color="inherit" /> : 
                  <>
                    <FaCloudUploadAlt className="text-[25px] text-white" /> Publish and View
                  </>
                }
          </Button>
        </div>
      </form>

      {/* Bản 2 Thêm danh mục thứ ba*/}

       <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit2}>
                   <h4 className="font-[600]">Danh Mục Con</h4>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">

          <div className='grid grid-cols-2 mb-3 gap-5'>
                  <div className='col '>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Danh mục phụ</h3>
                   <Select
                        labelId="demo-simple-select-label"
                        id="productCatDrop"
                        size='small'
                        className='w-full'
                        value={productCat2}
                        label="Category"
                        onChange={handleChangeProductCat2}
                        >
                              {/* Lấy dữ liệu của CategoryList để hiển thị ở đây */}
                        {
                           context?.catData?.length != 0 && context?.catData?.map( (item, index) => {
                                return(
                                  item?.children?.length != 0 && item?.children?.map( (item2, index) => {
                                      return (
                                        <MenuItem key={index} value={item2?._id}  onClick={selecteCatFun2(item2?.name)}>
                                              {item2?.name}
                                        </MenuItem>
                                      )
                                    })
                                )
                              })
                        }
                    </Select>
                </div>

                <div className='col'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Tên danh mục con</h3>
                  <input type='text'
                        className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                          name="name"
                          value={formFields2.name}
                          onChange={onChangeInput2}
                        />
                </div>
            </div>
            <br />

           
        </div>
        
        <div className="w-[250px]">
          <Button className="btn-blue btn-lg w-full flex gap-2"
                  type="submit">
                 {
                    isLoading2 === true ? <CircularProgress color="inherit" /> : 
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

export default AddSubCategory;
