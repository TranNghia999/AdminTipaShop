import './App.css'
import './responsive.css'
import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createContext, useState } from 'react';

// Các Pages &  Components
import Dashboard from './Pages/Dashboard';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Products from './Pages/Products';
import HomeSliderBanners from './Pages/HomeSliderBanners';
import CategoryList from './Pages/Categegory/index.jsx';
import SubCategoryList from './Pages/Categegory/subCatList.jsx';
import Users from './Pages/Users/index.jsx';
import Orders from './Pages/Orders/index.jsx';
import ForgotPassword from './Pages/ForgotPassword/index.jsx';
import VefifyAccount from './Pages/VefifyAccount/index.jsx';
import ChangePassword from './Pages/ChangePassword/index.jsx';
import Profile from './Pages/Profile/index.jsx';
import ProductDetails from './Pages/Products/productDetails.jsx';
import AddRAMS from './Pages/Products/addRAMS.jsx';
import AddWeight from './Pages/Products/addWeight.jsx';
import AddSize from './Pages/Products/addSize.jsx';
import BannerV1List from './Pages/Banners/bannerV1List.jsx';
import BlogList from './Pages/Blog/index.jsx';

// thông báo kết nối server
import toast, { Toaster } from 'react-hot-toast';

// API kết nối server với Admin
import { fetchDataFromApi } from './utils/api.js';
import BannerV2List from './Pages/Banners/bannerV2List.jsx';




const MyContext = createContext();

function App() {

  // Cấu hình màn hình
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // Cấu hình Slide Trang chủ
  const [sidebarWidth, setSidebarWidth] = useState(18);
  // code quản lý trạng thái mở/đóng sidebar
  const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);
  const [ isLogin, setIsLogin ] = useState(false);
  // Code của hồ sơ người dùng
  const [userData, setUserData] = useState(null);
  // hiển thị Địa chỉ
    const [address, setAddress] = useState([]);
  // Dữ hiển thị ở subcategory
  const [catData, setCatData] = useState([]);
  // mở trang thái thêm sản phẩm toàn màn hình
  const [ isOpenFullScreenPanel, setIsOpenFullScreenPanel ] = useState({
     open: false ,
     id: ''
  });

   const alertBox = (type, msg ) => {
      if (type === "success") {
        toast.success(msg)
      }
      if (type === "error") {
        toast.error(msg)
      }
    }

      // code của kết nối server api
  useEffect(()=>{

  const token = localStorage.getItem('accessToken');

  if(token!== undefined && token !== null && token !== ""){
        setIsLogin(true);

    fetchDataFromApi(`/api/user/user-details`).then((res) => {
      setUserData(res.data);
        if (res?.response?.data?.error === true) {
          if (res?.response?.data?.message === "Bạn chưa đăng nhập") {
            localStorage.removeItem("accessToken", res?.data?.accessToken);
            localStorage.removeItem("refreshToken", res?.data?.refreshToken);

            alertBox("error", "Tài khoản của bạn đã đóng, vui lòng đăng nhập lại")
            window.location.href = "/login";
        }}
    })
    }else{
        setIsLogin(false);
    }

  },[isLogin])

  useEffect(() => {
      getCat();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };

  }, [])

    const getCat = () => {
      fetchDataFromApi("/api/category").then((res) => {
        setCatData(res?.data)
      })
    }

  const values = {
    isSidebarOpen,
    setIsSidebarOpen,
    isLogin,
    setIsLogin,
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
    alertBox,
    userData,
    setUserData,
    address, 
    setAddress,
    catData, 
    setCatData,
    getCat,
    windowWidth,
    sidebarWidth, 
    setSidebarWidth
  }

  useEffect(() => {  
  if(windowWidth < 992) {
    setIsSidebarOpen(false);
    setSidebarWidth(100)
  }else{
    setSidebarWidth(18)
  }
}, [windowWidth])
 
 const router = createBrowserRouter([
    {
      path: "/",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? 
                              `w-[${sidebarWidth/1.5}%]`: `w-[${sidebarWidth}%]` : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>
              {/* Code mới */}
              {/* <div
                  className={`overflow-hidden sidebarWrapper transition-all duration-300`}
                  style={{
                    width: isSidebarOpen ? `${sidebarWidth}%` : "0px",
                    opacity: isSidebarOpen ? 1 : 0
                  }} >
                  <Sidebar />
                </div> */}

              <div className={`contentRight py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'} 
                              ${isSidebarOpen === false ? 'w-[100%]' : `w-[${100 - sidebarWidth}%]`} transition-all`}>
                    <Dashboard />
                  </div>
              {/* Code mới */}
              {/* <div className="contentRight py-4 px-5 transition-all duration-300"
                    style={{
                      width: isSidebarOpen ? `${100 - sidebarWidth}%` : "100%",
                      opacity: isSidebarOpen && windowWidth < 992 ? 0 : 1
                    }}
                >
                  <Dashboard />
                </div> */}
           </div>
      </section>
      </>
      )
    },

    {
      path: "/login",
      exact:true,
      element: (
      <>
      <Login />
      </>
      )
    },

    {
      path: "/sign-up",
      exact:true,
      element: (
      <>
      <SignUp />
      </>
      )
    },

    {
      path: "/forgot-password",
      exact:true,
      element: (
      <>
      <ForgotPassword />
      </>
      )
    },

    {
      path: "/verify-account",
      exact:true,
      element: (
      <>
      <VefifyAccount />
      </>
      )
    },

    {
      path: "/change-password",
      exact:true,
      element: (
      <>
      <ChangePassword />
      </>
      )
    },


    {
      path: "/products",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <Products />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

    {
      path: "/homeSlider/list",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <HomeSliderBanners />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

    {
      path: "/category/list",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <CategoryList />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

    {
      path: "/subCategory/list",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <SubCategoryList />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

    {
      path: "/users",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <Users />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

    {
      path: "/orders",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <Orders />
              </div>
           </div> 
      </section>
      
      </>
      )
    },
    
    {
      path: "/profile",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <Profile />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

    {
      path: "/product/:id",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <ProductDetails />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

     {
      path: "/product/addRams",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <AddRAMS />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

    
    {
      path: "/product/addWeight",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <AddWeight />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

    {
      path: "/product/addSize",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <AddSize />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

    {
      path: "/bannerV1/list",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <BannerV1List />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

    {
      path: "/bannerV2/list",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <BannerV2List />
              </div>
           </div> 
      </section>
      
      </>
      )
    },

    {
      path: "/blog/list",
      exact:true,
      element: (
      <>
      <section className='main'>
          <Header />
           <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
                <Sidebar/>
              </div>

              <div className={`contentRight py-4 px-5  ${isSidebarOpen===false ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
                <BlogList />
              </div>
           </div> 
      </section>
      
      </>
      )
    },
    


    
  ]);

  return (
    <>
    <MyContext.Provider value = {values}>
            <RouterProvider router={router}/>
       {/* thông báo */}
          <Toaster />

    </MyContext.Provider>
    </>
  )
}

export default App

export {MyContext}
