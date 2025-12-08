import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import OtpBox from '../../Components/OtpBox';
// icon
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
// Kết nối api server
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';


const VefifyAccount = () => {

    // Xác minh OTP
     
    const [otp, setOtp] = useState('');
    const handleOtpChange = (value) => {
            setOtp(value);
        };

    // Kết nối  API server
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext)
    const history = useNavigate();
    const actionType = localStorage.getItem("actionType");

       const verifyOTP = (e) => {
        e.preventDefault();

        if(otp !==""){
            setIsLoading(true)
        const actionType = localStorage.getItem("actionType");

    if(actionType !== "forgot-password") {
      
        postData("/api/user/verifyEmail", {
            email: localStorage.getItem("userEmail"),
            otp: otp
        }).then((res) => {
            if (res?.error === false) {
                context.alertBox("success", res?.message);
                localStorage.removeItem("userEmail")
                setIsLoading(false)
                history("/login")
    } else {
            context.alertBox("error", res?.message);
            setIsLoading(false)
            }
        })
    }
    
    else{
        postData("/api/user/verify-forgot-password-otp", {
            email: localStorage.getItem("userEmail"),
            otp: otp
        }).then((res) => {
            if (res?.error === false) {
                context.alertBox("success", res?.message);
                history("/change-password")
                 setIsLoading(false)
        } else {
            context.alertBox("error", res?.message);
            }
        })
    }
    } else {
        context.alertBox("error", " Vui lòng nhập OTP ");

    }  
}


  return (
    <section className=' bg-white w-full h-[100vh] '>
        <header className='w-full fixed top-0 left-0 px-4 py-3 flex items-center justify-between z-50'>
            <Link to='/'>
                <img src='https://ecme-react.themenate.net/img/logo/logo-light-full.png'
                    className='w-[200px]'/>
            </Link>

            <div className=' hidden sm:flex items-center gap-0'>
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
                    <img src='/verify_4.png'
                        className='w-[100px] m-auto'/>
                </div>
                  <h1 className='text-center text-[35px] font-[800] mt-4'>Welcome Back! <br/> Please Verify your Email </h1>
                <br/>

                <p className='text-center text-[15px]'>OTP send to
                    <span className='text-primary font-bold'> {localStorage.getItem("userEmail")} </span>
                </p>
                <br/>
                <form onSubmit={verifyOTP}>
                    <div className='text-center flex items-center justify-center flex-col'>
                        <OtpBox length={6} onChange={handleOtpChange}/>
                    </div>
                
                 <br/>
                    <div className='w-[100%] px-3 sm:w-[300px] sm:px-0 m-auto'>
                        <Button type='submit' className='btn-blue w-full'>
                            {
                                isLoading === true ? <CircularProgress color="inherit" /> : 'Verify OTP'
                            }
                        </Button>
                    </div>
                </form>
               
            </div>
    </section>
  )
}

export default VefifyAccount;
