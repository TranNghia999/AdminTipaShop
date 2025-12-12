import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
// icon
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
// checkbox
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// API kết nối
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';
import { MyContext } from '../../App';



const SignUp = () => {

const [loadingGoogle, setLoadingGoogle] = React.useState(false);
const [loadingFb, setLoadingFb] = React.useState(false);
 function handleClickGoogle() {
    setLoadingGoogle(true);
  }
function handleClickFb() {
    setLoadingFb(true);
  }
// ẩn hiện mat khẩu
const [isPasswordShow, setIsPasswordShow] = useState(false);

// Kết nối API với server
const context = useContext(MyContext)
const history = useNavigate();

const [isLoading, setIsLoading] = useState(false);

const [formFields, setFormFields] = useState({
            name: "",
            email: "",
            password: ""
        })

    const onChangeInput = (e) => {
            const { name, value } = e.target;
                setFormFields(() => {
                    return {
                    ...formFields,
                    [name]: value
                }
        })
    }

    const valideValue = Object.values(formFields).every(el => el)

      // Hàm kết nối API data
        const handleSubmit = (e) => {
            e.preventDefault();

        if(formFields.name==="") {
            context.alertBox("error", "Vui lòng nhập tên đầy đủ");
                return false
            }
        if(formFields.email==="") {
            context.alertBox("error", "Vui lòng nhập id email");
            return false
            }

                // Đã Thêm Mật khẩu nâng cao tại đây
     const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

            if (!strongPasswordRegex.test(formFields.password)) {
                context.alertBox(
                "error",
                "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
            );
            return false;
        }

        setIsLoading(true);

        postData("/api/user/register", formFields).then((res) => {
           

        if (res?.error !== true) {
            setIsLoading(false);
            context.alertBox("success", res?.message);
            localStorage.setItem("userEmail", formFields.email)
            setFormFields({
            name: "",
            email: "",
            password: ""
            })

            history("/verify-account")
        } else {
            context.alertBox("error", res?.message);
             setIsLoading(false);
        }   
    })
}


  return (
    <section className=' bg-white w-full '>
        <header className='w-full static lg:fixed top-0 left-0 px-4 py-3 flex items-center justify-center sm:justify-between z-50'>
            <Link to='/'>
               <img src='logo.png'
                    className='w-[200px]'/>
            </Link>

            <div className='hidden sm:flex items-center gap-0'>
             <NavLink  to="/login" exact={true} activeClassName={"isActive"}>
                <Button className='!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1'>
                    <CgLogIn className='text-[18px]'/> Đăng nhập
                </Button>
            </NavLink>

            <NavLink  to="/sign-up" exact={true} activeClassName={"isActive"}>
                <Button className='!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1'>
                    <FaRegUser className='text-[15px]'/> Đăng ký 
                </Button>
            </NavLink>
            </div>

        </header>
       <img src='/pexels-photo.jpeg'
            className='w-full h-full fixed top-0 left-0 opacity-20'/>

            <div className='loginBox card w-full sm:w-[600px] h-auto pb-20 mx-auto pt-5 lg:pt-20 relative z-50'>
                <div className='text-center'>
                    <img  src='/logo-primary.svg'
                        className='m-auto'/>
                </div>
                    <h1 className='text-center text-[18px] sm:text-[35px] font-[800] mt-4'>
                        Tạo Tài khoản Quản trị
                        <br/>Vui lòng nhập thông tin để đăng ký.
                    </h1>


                <div className='flex items-center justify-center w-full mt-5 gap-4'>
                     <Button
                            size="small"
                            onClick={handleClickGoogle}
                            endIcon={<FcGoogle />}
                            loading={loadingGoogle}
                            loadingPosition="end"
                            variant="outlined"
                            className='!bg-none !py-2 !text-[15px] !capitalize !px-5 !text-[rgba(0,0,0,0.7)] '>
                         Đăng nhập bằng Google
                        </Button>

                      {/* <Button
                            size="small"
                            onClick={handleClickFb}
                            endIcon={<BsFacebook className='!text-[#1877F2]' />}
                            loading={loadingFb}
                            loadingPosition="end"
                            variant="outlined"
                            className='!bg-none !py-2 !text-[15px] !capitalize !px-5 !text-[rgba(0,0,0,0.7)] '>
                         Signin With Facebook
                        </Button> */}
                </div>

                <br/>   

                <div className='w-full flex items-center justify-center gap-3'>
                    <span className='flex items-center w-[90px] h-[1px] bg-[rgba(0,0,0,0.2)]'></span>
                    <span className=' text-[10px] lg:text-[14px] font-[500]'>
                        Hoặc, Đăng nhập bằng email
                    </span>
                     <span className='flex items-center w-[90px] h-[1px] bg-[rgba(0,0,0,0.2)]'></span>

                </div>

                <form className='w-full px-8 mt-3' onSubmit={handleSubmit}>
                    <div className='form-group mb-4 w-full'>
                        <h4 className='text-[14px] font-[500] mb-1'>Full Name</h4>
                        <input type='text' placeholder='Nhập tên đầy đủ Admin' 
                            className='w-full h-[50px] px-3 border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none'
                                name='name'
                                onChange={onChangeInput} 
                                value={formFields.name} 
                                disabled={isLoading===true ? true : false}
                            />
                    </div>

                     <div className='form-group mb-4 w-full'>
                        <h4 className='text-[14px] font-[500] mb-1'>Email</h4>
                        <input type='email' placeholder='Nhập tài khoản Admin'
                            className='w-full h-[50px] px-3 border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none'
                                name='email'
                                onChange={onChangeInput} 
                                value={formFields.email} 
                                disabled={isLoading===true ? true : false}
                            />
                    </div>

                     <div className='form-group mb-4 w-full'>
                        <h4 className='text-[14px] font-[500] mb-1'>Password</h4>
                        <div className='relative w-full'>
                            <input type={isPasswordShow === false ? 'password' : 'text'} placeholder='Vui lòng nhập mật khẩu'
                            className='w-full h-[50px] px-3 border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none'
                                name='password'
                                onChange={onChangeInput} 
                                value={formFields.password} 
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


                    <div className='form-group mb-4 w-full flex items-center justify-between'>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Nhớ tài khoản"/>

                        <Link to='/forgot-password' 
                            className='text-primary text-[15px] font-[700] hover:underline hover:text-gray-700'>
                            Quên mật khẩu?
                        </Link>
                    </div>
                     <div className="flex items-center gap-2 mb-4">
                        <span className='text-[14px]' >Bạn đã có tài khoản?</span>
                        <Link to='/login' 
                            className='text-primary text-[15px] font-[700] hover:underline hover:text-gray-700 cursor-pointer'>
                            Đăng nhập
                        </Link>
                    </div>

                        <Button type='submit' disabled={!valideValue} 
                                className='btn-blue btn-lg w-full'>
                           {
                                isLoading === true ? <CircularProgress color="inherit" /> : 'Đăng ký'
                            }
                          </Button>
                </form>

                
            </div>
    </section>
  )
}

export default SignUp;
