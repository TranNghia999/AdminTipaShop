import React, { useState } from "react";

// Icon
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
// Thêm định danh số đt
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
//  Các lựa chọn trong mục
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// Dữ liệu server
import {  fetchDataFromApi, postData } from "../../utils/api";
import { useContext } from "react";
import { MyContext } from "../../App";
import { useEffect } from "react";


const AddAddress = () => {

      const context = useContext(MyContext)

        // code định danh số điện thoại
       const [phone, setPhone] = useState('');

        const [isLoading, setIsLoading] = useState(false);

        // code các lựa chọn trong mục
        const [status, setStatus] = React.useState(false);

       

        const onChangeInput = (e) => {
            const { name, value } = e.target;
                setFormFields(() => {
                    return{
                    ...formFields,
                    [name]: value

                    }
                });
            }

         const [formFields, setFormFields ] = useState({
                address_line1 :'',
                city:'',
                state:'',
                pincode:'',
                country:'',
                mobile:'',
                status:'',
                userId: '',
                selected: false
            });

           useEffect(()=>{
                  setFormFields((prevState) => ({
                    ...prevState,
                    userId: context?.userData?._id
                }))
            }, [context?.userData])


            const handleChangeStatus = (event) => {
                setStatus(event.target.value);
                setFormFields((prevState) => ({
                    ...prevState,
                    status: event.target.value
                }))
            };
                    
                    // Hàm kết nối API data
            const handleSubmit = (e) => {
                            e.preventDefault();
            
                        if(formFields.address_line1==="") {
                            context.alertBox("error", "Vui lòng nhập địa chỉ 1 ");
                            return false
                        }
                
                        if (formFields.city==="") {
                        context.alertBox("error", "Vui lòng nhập tên thành phố ");
                        return false;
                        }
        
                        if (formFields.state==="") {
                        context.alertBox("error", "Vui lòng nhập tiểu bang");
                        return false;
                        }

                        if (formFields.pincode==="") {
                        context.alertBox("error", "Vui lòng nhập mã code");
                        return false;
                        }

                        if (formFields.country==="") {
                        context.alertBox("error", "Vui lòng nhập quốc gia");
                        return false;
                        }

                         if (formFields.mobile==="") {
                        context.alertBox("error", "Vui lòng nhập số điện thoại");
                        return false;
                        }
                      
                
                      setIsLoading(true);

                       // ✅ Làm sạch số điện thoại
                    const cleanedPhone = phone
                        .replace(/^(\+84|84)0/, '+84') // +840xxxx → +84xxxx
                        .replace(/^0/, '+84');         // 0xxxx → +84xxxx

                    // ✅ Cập nhật lại vào formFields (không đổi biến gốc)
                    formFields.mobile = cleanedPhone;
        

                        postData(`/api/address/add`, formFields, { withCredentials: true }).then((res) => {
                           console.log(res)
                           
            
                        if (res?.error !== true) {
                            setIsLoading(false);
                            context.alertBox("success", res?.message);
                            context?.setIsOpenFullScreenPanel({
                                open: false
                            })

                            fetchDataFromApi(`/api/address/get?userId=${context?.userData?._id}`).then((res)=>{
                                        context?.setAddress(res.address)
                                })
                          
        
        
                        } else {
                            context.alertBox("error", res?.data?.message);
                             setIsLoading(false);
                        }   
                    })
                }

            
          


  return (
    <section className="p-5 bg-gray-200">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">

            <div className='grid grid-cols-2 mb-3 gap-4'>
                <div className='col w-full md:w-[100%]'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Address line 1</h3>
                    <input type='text'
                        className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            name="address_line1" onChange={onChangeInput} value={formFields.address_line1}
                        />
                </div>

                <div className='col w-full md:w-[100%]'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>City</h3>
                    <input type='text'
                        className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            name="city" onChange={onChangeInput} value={formFields.city}
                        />
                </div>

            </div>

            <div className='grid grid-cols-3 mb-3 gap-4'>
                <div className='col w-full md:w-[100%]'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>State</h3>
                    <input type='text'
                        className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            name="state" onChange={onChangeInput} value={formFields.state}
                        />
                </div>

                <div className='col w-full md:w-[100%]'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Pincode</h3>
                    <input type='number'
                        className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            name="pincode" onChange={onChangeInput} value={formFields.pincode}
                        />
                </div>

                <div className='col w-full md:w-[100%]'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Country</h3>
                    <input type='text'
                        className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                            name="country" onChange={onChangeInput} value={formFields.country}
                        />
                </div>

                <div className='col w-full md:w-[100%]'>
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Mobile</h3>
                        {/* Sử dụng định danh số điện thoại */}
                            <PhoneInput
                                defaultCountry="vn"
                                value={phone}
                                disabled={isLoading===true ? true : false}
                                onChange={(phone) =>    {
                                    setPhone(phone);{
                                        setFormFields((prevState)=>({
                                            ...prevState,
                                            mobile : phone
                                        }))
                                    }
                                }}
                                forceDialCode={true}
                                disableDialCodePrefill={false}
                            />
                </div>

                <div className="col w-[100%]">
                    <h3 className='text-[14px] font-[500] mb-1 text-black'>Status</h3>
                        <Select
                            value={status}
                            onChange={handleChangeStatus}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            size="small"
                            className="w-[100%]"
                        >
                            
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </Select>
                </div>

            </div>
            <br />
 
        </div>
        <br /> <br />
        <div className="w-[250px]">
          <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
            <FaCloudUploadAlt className="text-[25px] text-white" />
            Publish and View
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddAddress;
