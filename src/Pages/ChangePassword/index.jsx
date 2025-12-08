import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
// icon
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
// Hàm kết nối API server
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';


const ChangePassword = () => {

// ẩn hiện mat khẩu
const [isPasswordShow, setIsPasswordShow] = useState(false);

const [isPasswordShow2, setIsPasswordShow2] = useState(false);

// Kết nối API đến server
   // Code kết nối server
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields ] = useState({
            email:localStorage.getItem("userEmail"), 
            newPassword:'',
            confirmPassword:''
        });
    
    const context = useContext(MyContext);
    const history = useNavigate();

      // Xác nhận mật khẩu
        const onChangeInput = (e) => {
            const { name, value } = e.target;
                setFormFields(() => {
                    return {
                    ...formFields,
                    [name]: value
                }
        })
    }

    // Xác thực
    const valideValue = Object.values(formFields).every(el => el)

           // Hàm kết nối API data
                const handleSubmit = (e) => {
                    e.preventDefault();
    
                if(formFields.newPassword==="") {
                    context.alertBox("error", "Nhập lại mật khẩu mới");
                        setIsLoading(false);
                    return false
                }
        
                if (formFields.confirmPassword==="") {
                    context.alertBox("error", "Nhập lại mật khẩu mới");
                        setIsLoading(false);
                    return false;
                }

                  if (formFields.confirmPassword !== formFields.newPassword) {
                context.alertBox("error", "Mật khẩu chưa trùng khớp");
                        setIsLoading(false);
                    return false;
                }

                // Đã thêm để nâng cao bảo mật
                const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                    if (!strongPasswordRegex.test(formFields.newPassword)) {
                        context.alertBox("error", "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt");
                        return false;
                    }
        
              setIsLoading(true);

            postData(`/api/user/reset-password`, formFields).then((res) => {
                console.log(res)
                if(res?.error === false){
                    localStorage.removeItem("userEmail")
                    localStorage.removeItem("actionType")
                    context.alertBox("success", res?.message);
                    setIsLoading(false);
                    history("/login")    
                }
                else {
                    context.alertBox("error", res?.message);
                }
            })
        }

  return (
    <section className=' bg-white w-full '>
        <header className='w-full fixed top-0 left-0 px-4 py-3 flex items-center justify-between z-50'>
            <Link to='/'>
                <img src='https://ecme-react.themenate.net/img/logo/logo-light-full.png'
                    className='w-[200px]'/>
            </Link>

            <div className='flex items-center gap-0'>
             <NavLink  to="/login" exact={true} activeClassName={"isActive"}>
                <Button className='!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1'>
                    <CgLogIn className='text-[18px]'/> Login
                </Button>
            </NavLink>

             <NavLink  to="/sign-up" exact={true} activeClassName={"isActive"}>
                <Button className='!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1'>
                    <FaRegUser className='text-[15px]'/> Sign In
                </Button>
            </NavLink>
            </div>

        </header>
       <img src='https://images.pexels.com/photos/242616/pexels-photo-242616.jpeg' 
            className='w-full fixed top-0 left-0 opacity-10'/>

            <div className='loginBox card w-[600px] h-auto pb-20 mx-auto pt-20 relative z-50'>
                <div className='text-center'>
                    <img src='https://isomorphic-furyroad.vercel.app/_next/static/media/logo-short.18ca02a8.svg'
                        className='m-auto'/>
                </div>
                  <h1 className='text-center text-[35px] font-[800] mt-4'>Welcome Back! <br/> You can change your password <br/> from here</h1>

                <br/>   

                <form className='w-full px-8 mt-3' onSubmit={handleSubmit}>
                  
                     <div className='form-group mb-4 w-full'>
                        <h4 className='text-[14px] font-[500] mb-1'>New Password</h4>
                        <div className='relative w-full'>
                            <input type={isPasswordShow === false ? 'password' : 'text'} placeholder='Nhập mật khẩu Admin'
                            className='w-full h-[50px] px-3 border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none'
                                name='newPassword'
                                onChange={onChangeInput} 
                                value={formFields.newPassword} 
                                disabled={isLoading===true ? true : false}
                            />
                                <Button className='!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600'
                                        onClick={() => setIsPasswordShow(!isPasswordShow)}>
                                {
                                    isPasswordShow === false ? (
                                         <FaRegEye className='text-[18px]'/>

                                    ) : (
                                        <FaEyeSlash className='text-[18px]'/>
                                )}
                                </Button>
                    </div>
                    </div>

                     <div className='form-group mb-4 w-full'>
                        <h4 className='text-[14px] font-[500] mb-1'>Confirm Password</h4>
                        <div className='relative w-full'>
                            <input type={isPasswordShow2 === false ? 'password' : 'text'} placeholder='Nhập mật khẩu Admin'
                            className='w-full h-[50px] px-3 border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none'
                                name='confirmPassword'
                                onChange={onChangeInput} 
                                value={formFields.confirmPassword} 
                                disabled={isLoading===true ? true : false}
                            />
                                <Button className='!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600'
                                        onClick={() => setIsPasswordShow2(!isPasswordShow2)}>
                                {
                                    isPasswordShow2 === false ? (
                                         <FaRegEye className='text-[18px]'/>

                                    ) : (
                                        <FaEyeSlash className='text-[18px]'/>
                                )}
                                </Button>
                        </div>
                    </div>

                          <Button   type='submit' disabled={!valideValue}
                                    className='btn-blue btn-lg w-full'>
                            {
                                isLoading === true ? <CircularProgress color="inherit" /> : 'Change Password'
                            }
                        </Button>
                </form>

                 


            </div>
    </section>
  )
}

export default ChangePassword;
