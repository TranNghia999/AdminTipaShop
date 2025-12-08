import React, { useContext, useEffect, useState } from 'react'
// Nút
import  Button  from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
// Icon
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
// Thêm định danh số đt
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

// Thanh thay đổi trạng thái mật khẩu
import {Collapse} from 'react-collapse'; 

// Kết nối API với server
import { MyContext } from '../../App';
import { editData, fetchDataFromApi, postData, uploadImage } from '../../utils/api';
import { useNavigate } from 'react-router-dom';


    // Nút checkbox
    const label = { inputProps: { 'aria-label': 'Địa chỉ' } };

const Profile = () => {

    // code kết nối API với server
    const context = useContext(MyContext)

    // code định danh số điện thoại
    const [phone, setPhone] = useState("");

    // Tải lên hình ảnh
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const userAvtar = [];
        if (context?.userData?.avatar !== "" && context?.userData?.avatar !== undefined){
            userAvtar.push(context?.userData?.avatar);
            setPreviews(userAvtar)
        }
     
        }, [context?.userData])
       
    let selectedImages = [];
    
    const formdata = new FormData();


    const onChangeFile = async (e, apiEndPoint) => {
         try {
             setPreviews([]);
             const files = e.target.files;
             setUploading(true)
     
             for (var i = 0; i < files.length; i++) {
                if ( files[i] && (files[i].type === "image/jpeg" || files[i].type === "image/jpg" ||
                                   files[i].type === "image/png" || files[i].type === "image/webp")
             ) {
                 const file = files[i];
     
                 selectedImages.push(file);
                 formdata.append('avatar', file);
      
     
             }else {
                  context.alertBox("error", " Vui lòng chọn tệp hình ảnh JPG, PNG hoặc webp hợp lệ.");
                   setUploading(false)
                 return false;
                 }
             }
     
             uploadImage("/api/user/user-avatar", formdata).then((res) => {
                 setUploading(false);
                 let avatar = [];
                 console.log(res?.data?.avtar)
                 avatar.push(res?.data?.avtar);
                 setPreviews(avatar);     
                
             })
     
     
     } catch (error) {
                 console.log(error);
             }
         }
    // Code Mật khẩu với đổi mật khẩu

    const [isLoading, setIsLoading] = useState(false);
    // Đặt lại mật khẩu
    const [isLoading2, setIsLoading2] = useState(false);

    const [isChangePasswordFormShow, setIsChangePasswordFormShow] = useState(false);
    // hiển thị Địa chỉ
    const [address, setAddress] = useState([]);

    const [userId, setUserId] = useState("");
    const [formFields, setFormFields ] = useState({
            name:'',
            email:'',
            mobile:''
        });

    const [changePassword, setChangePassword] = useState({
            email:"",
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

    const history = useNavigate();

    const onChangeInput = (e) => {
        const { name, value } = e.target;

    if (["oldPassword", "newPassword", "confirmPassword"].includes(name)) {
        setChangePassword(prev => ({
        ...prev,
        [name]: value
        }));
    } else {
        setFormFields(prev => ({
        ...prev,
        [name]: value
        }));
    }
    };

   const valideValue = Object.values(formFields).every(el => el)
        
            // Hàm kết nối API data
    const handleSubmit = (e) => {
                    e.preventDefault();
    
                if(formFields.name==="") {
                    context.alertBox("error", "Vui lòng nhập tên ");
                    return false
                }
        
                if (formFields.email==="") {
                context.alertBox("error", "Vui lòng nhập email của bạn");
                return false;
                }

                 if (formFields.mobile==="") {
                context.alertBox("error", "Vui lòng nhập số điện thoại của bạn");
                return false;
                }
        
              setIsLoading(true);

             // ✅ Làm sạch số điện thoại
                const cleanedPhone = phone
                    .replace(/^(\+84|84)0/, '+84') // +840xxxx → +84xxxx
                    .replace(/^0/, '+84');         // 0xxxx → +84xxxx

                // ✅ Cập nhật lại vào formFields (không đổi biến gốc)
                formFields.mobile = cleanedPhone;
        
                editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then((res) => {
                   console.log(res)
    
                if (res?.error !== true) {
                    setIsLoading(false);
                    context.alertBox("success", res?.data?.message);
                    


                } else {
                    context.alertBox("error", res?.data?.message);
                     setIsLoading(false);
                }   
            })
        }

    const valideValue2 = Object.values(changePassword).every(el => el)

        // Hàm kết nối API data
    const handleSubmitChangePassword = (e) => {
                    e.preventDefault();
    
                if(changePassword.oldPassword==="") {
                    context.alertBox("error", "Nhập mật khẩu hiện tại");
                    return false
                }
        
                if (changePassword.newPassword==="") {
                context.alertBox("error", "Nhập mật khẩu mới");
                return false;
                }

                 if (changePassword.confirmPassword==="") {
                context.alertBox("error", "Nhập lại mật khẩu mới");
                return false;
                }

                if (changePassword.confirmPassword !== changePassword.newPassword) {
                context.alertBox("error", "Mật khẩu chưa trùng khớp");
                return false;
                }
        
              setIsLoading2(true);
        
                postData(`/api/user/reset-password`, changePassword, { withCredentials: true }).then((res) => {
                   console.log(res)
    
                if (res?.error !== true) {
                    setIsLoading2(false);
                    context.alertBox("success", res?.message);
                    


                } else {
                    context.alertBox("error", res?.message);
                     setIsLoading2(false);
                }   
            })
        }

        // Của dịa chỉ
    useEffect(() => {
        if (context?.userData?._id !== "" && context?.userData?._id !== undefined){

            fetchDataFromApi(`/api/address/get?userId=${context?.userData?._id}`).then((res)=>{
                setAddress(res.address)
                context?.setAddress(res.address)
            })

            setUserId(context?.userData?._id);
              
            const rawPhone = String(context.userData.mobile || '');
            // Nếu bắt đầu bằng '0', thay bằng +84 (hoặc giữ nguyên nếu đã có mã quốc tế)
            const formattedPhone = rawPhone.startsWith('0')
                ? '+84' + rawPhone.slice(1)
                : rawPhone;

            setFormFields({
                name: context.userData.name,
                email: context.userData.email,
                mobile: formattedPhone
            });

            setPhone(formattedPhone);

            setChangePassword({
            email: context?.userData?.email
        
            })
        }
    
        }, [context?.userData, context.address]) // ✅ thêm context.address vào

        // Của đăng nhập
    useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token === null) {
        history("/login");
    }
    }, [context?.isLogin])

    // Nút Radio
    const [selectedValue, setSelectedValue] = useState('');
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };


  return (
    <>
      <div className="card my-4 pt-5 w-[65%]  shadow-md sm:rounded-lg bg-white px-5 pb-5">
            <div className='flex items-center justify-between'>
                <h2 className="text-[18px] font-[600]"> Users Profile </h2>

                <Button className='!ml-auto' 
                        onClick={() => setIsChangePasswordFormShow (!isChangePasswordFormShow)}>
                            Change Password
                </Button>
            </div>
            

            <br />
            {/* Đoạn chứa Ảnh của tài khoản */}
                <div className='w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group flex items-center justify-center bg-gray-200'>
                           
                            {
                                uploading === true ? <CircularProgress color="inherit" /> :

                                <>
                                    {
                                        previews?.length !== 0 ? previews?.map((img, index) => {
                                            return(
                                                <img 
                                                    src= {img}
                                                    key= {index}
                                                    className='w-full h-full object-cover'/>
                                                )
                                        }):
                                        <img 
                                            src= {"/user.png"}
                                            className='w-full h-full object-cover'/>
                                    }
                                </>
                            }
                           
                                 <div className='overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100'>
                                    <FaCloudUploadAlt className='text-[#fff] text-[25px]'/>
                                    <input type='file' className='absolute top-0 left-0 w-full h-full opacity-0'
                                            // Đã thêm code cập nhật ảnh tại đây
                                            accept='image/*'
                                            onChange={(e) =>
                                                onChangeFile(e, "/api/user/user-avatar") 
                                            } 
                                            name='avatar' />
                                 </div>
                </div>

            {/* Đoạn mã Thay đổi mật khẩu mới cũ */}

            <form className='form mt-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-5'>
                        <div className='w-[50%]'>
                            <input  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                                    type='text'
                                    name='name' 
                                    onChange={onChangeInput} 
                                    value={formFields.name} 
                                    disabled={isLoading===true ? true : false}
                                    />

                        </div>
                        <div className='w-[50%]'>
                             <input  className='w-full h-[40px]  border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                                    type='email'
                                    name='email' 
                                    onChange={onChangeInput} 
                                    value={formFields.email} 
                                    disabled={true}
                                    />
                          
                        </div>
                                        
                    </div>
            
                    <div className='flex items-center mt-4 gap-5'>
                        <div className='w-[50%]'>
                            {/* Sử dụng định danh số điện thoại */}
                           <PhoneInput
                                defaultCountry="vn"
                                value={phone}
                                disabled={isLoading}
                                onChange={(phone) => {
                                    setPhone(phone);
                                    setFormFields((prev) => ({
                                    ...prev,
                                    mobile: phone
                                    }));
                                }}
                                // ✅ Không cho người dùng xóa mã quốc gia bằng bàn phím
                                forceDialCode={true}
                                disableDialCodePrefill={false}
                                />
                           
                        </div>
                        
                    </div>
            
                       <br/>

                       <div className='flex items-center justify-center p-5 border rounded-md border-dashed border-[rgba(0,0,0,0.2)] bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer'
                        onClick={()=>context.setIsOpenFullScreenPanel({ open: true,
                                                          model: 'Thêm Địa Chỉ'})}>
                                <span className='text-[14px] font-[500]'>Thêm Địa Chỉ</span>
                        </div>
                                {/* Thiết lập địa chỉ */}
                            <div className='flex gap-2 flex-col mt-4' >
                            {
                                address?.length > 0 && address?.map((address, index) => {
                                    return (
                                        <>
                                            <label className='border border-dashed border-[rgba(0,0,0,0.2)] addressBox bg-[#f1f1f1] p-3 rounded-md !w-full cursor-pointer flex items-center justify-center gap-2'>
                                                <Radio {...label} name='address' 
                                                        onChange={handleChange}
                                                        value={address?._id } 
                                                        checked={selectedValue === ( address?._id )}
                                                />
                                                    <span className="text-[12px]">
                                                        {
                                                            address?.address_line1 + ", " +
                                                            address?.city + ", " +
                                                            address?.country +  ", " +
                                                            address?.state + ", " +
                                                            address?.pincode 
                                                        }
                                                    </span>
                                            </label>
                                        </>
                                    )
                                })
                            }
                            </div>
                       

                        <br />
            
                    <div className='flex items-center gap-4'>
                            <Button type='submit' disabled={!valideValue}
                                    className='btn-blue btn-lg w-[100%]'>
                                    {
                                        isLoading === true ? <CircularProgress color="inherit" /> : 'Update Profile'
                                    }
                            </Button>
                    </div>
            
            </form>

            

      </div>

        <Collapse isOpened={isChangePasswordFormShow}>
      
                              <div className='card w-[65%] bg-white p-5 shadow-md rounded-md'>
                              <div className="flex items-center pb-3">
                                  <h2 className="text-[18px] font-[600] pb-0">Change Password</h2>
                              </div>
                              <hr/>
      
                              <form className='mt-8' onSubmit={handleSubmitChangePassword}>
                                  <div className='flex items-center gap-5'>
                                      <div className='w-[50%]'>
                                          <TextField label="Nhập mật khẩu hiện tại" variant="outlined" size='small' className='w-full'
                                                  name='oldPassword' 
                                                  onChange={onChangeInput}
                                                  value={changePassword.oldPassword}
                                                  disabled={isLoading2===true ? true : false}
                                          />
                                      </div>
      
                                      <div className='w-[50%]'>
                                          <TextField label="Nhập mật khẩu mới" variant="outlined" size='small' className='w-full'
                                                  type='text' 
                                                  name='newPassword' 
                                                  onChange={onChangeInput} 
                                                  value={changePassword.newPassword} 
                                          />
                                      </div>
                                      
                                  </div>
      
                                  <div className='flex items-center mt-4 gap-5'>
                                      <div className='w-[50%]'>
                                          <TextField label="Nhập lại mật khẩu" variant="outlined" size='small' className='w-full'
                                                  name='confirmPassword' 
                                                  onChange={onChangeInput} 
                                                  value={changePassword.confirmPassword} 
                                          />
                                      </div>
                                  </div>
      
                                  <br/>
      
                                  <div className='flex items-center gap-4'>
                                      <Button type='submit' disabled={!valideValue2}
                                              className='btn-blue btn-lg w-[100%]'>
                                              {
                                                  isLoading2 === true ? <CircularProgress color="inherit" /> : 'Change Password'
                                              }
                                      </Button>
                                  </div>
      
                              </form>
      
                              
                          </div>
      
                    </Collapse>
    </>
  )
}

export default Profile
