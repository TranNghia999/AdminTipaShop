import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import Button from '@mui/material/Button';
import { FaRegImage } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { PiNewspaper } from "react-icons/pi";
import { SiBloglovin } from "react-icons/si";
import { FaBuffer } from "react-icons/fa";

// Thanh trươc bên trái của trang quản trị
import { Collapse } from 'react-collapse';

import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';





const Sidebar = () => {

  const [submenuIndex, setSubmenuIndex] = useState(null);
  const isOpenSubMenu = (index) => {
    if (submenuIndex === index) {
      setSubmenuIndex(null);
    } else {
      setSubmenuIndex(index);
    }
  };

  const context = useContext(MyContext);

  // Đăng xuất tài khoản
  const logout = () => {
  context?.windowWidth < 992 && context?.setIsSidebarOpen(false);
  setSubmenuIndex(null)
  fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accessToken')}`, {
    withCredentials: true
  }).then((res) => {
    if (res?.error === false) {
      context.setIsLogin(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      history("/login");
    }
  });
};


  return (
    <>
      <div className={`sidebar fixed top-0 left-0 z-[52] bg-[#fff] h-full border-r border-[rgba(0,0,0,0.1)] py-2 px-4
                       w-[${context.isSidebarOpen === true ? ` ${context?.sidebarWidth/2}% ` : '0px'}]`}>
        <div className='py-2 w-full' 
              onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                    setSubmenuIndex(null)
              }}>
          <Link to="/">
            <img src='/logo.png'
              className='w-[200px]' />
          </Link>

        </div>

        <ul className='mt-4 overflow-y-scroll max-h-[80vh]'>
          <li>
            <Link to="/" onClick={()=>{
                                    context?.windowWidth < 992 && context?.setIsSideBarOpen(false) 
                                    setSubmenuIndex(null)}}>
              <Button className='w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500]  items-center !py-2 hover:!bg-[#f1f1f1]'>
                <RxDashboard className='text-[18px]' />
                <span >Trang Chủ</span>
              </Button>
            </Link>
          </li>

          <li>

            <Button className='w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500]  items-center !py-2 hover:!bg-[#f1f1f1]'
              onClick={() => isOpenSubMenu(1)}>
              <FaRegImage className='text-[20px]' />
              <span>Trang Slides</span>
              <span className='ml-auto w-[30px] h-[30px] flex items-center justify-center'>
                <FaAngleDown className={`transition-all ${submenuIndex === 1 ? 'rotate-180' : ''}`} /></span>
            </Button>


            <Collapse isOpened={submenuIndex === 1 ? true : false}>
              <ul className='w-full'>
                <li className='w-full'>
                  <Link to="/homeSlider/list" onClick={()=>{
                                              context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                                              setSubmenuIndex(null)
                                              }}>
                    <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'>
                      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>
                      Danh Sách Slide
                    </Button>
                  </Link>
                </li>
                <li className='w-full'>
                  <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'
                    onClick={() =>
                      {context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Thêm Slider Trang Chủ",
                      })
                      context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                      setSubmenuIndex(null)
                      }}>
                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>
                    Thêm Slider Trang Chủ
                  </Button>
                </li>
              </ul>
            </Collapse>
          </li>


          <li>
            <Link to="/users" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                              setSubmenuIndex(null)
            }}>
              <Button className='w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500]  items-center !py-2 hover:!bg-[#f1f1f1]'>
                <FiUsers className='text-[20px]' />
                <span>Người Dùng</span>
              </Button>
            </Link>
          </li>

          <li>
            <Button className='w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500]  items-center !py-2 hover:!bg-[#f1f1f1]'
              onClick={() => isOpenSubMenu(3)}>
              <RiProductHuntLine className='text-[18px]' />
              <span>Sản Phẩm</span>
              <span className='ml-auto w-[30px] h-[30px] flex items-center justify-center'>
                <FaAngleDown className={`transition-all ${submenuIndex === 3 ? 'rotate-180' : ''}`} /></span>
            </Button>

            <Collapse isOpened={submenuIndex === 3 ? true : false}>
              <ul className='w-full'>
                <li className='w-full'>
                  <Link to="/products" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                                       setSubmenuIndex(null)
                  }}>
                    <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'>
                      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>Danh sách SP
                    </Button>
                  </Link>
                </li>
                <li className='w-full'>

                  <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'
                    onClick={() => {context.setIsOpenFullScreenPanel({
                      open: true,
                      model: 'Thêm Sản Phẩm'
                    })
                    context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                    setSubmenuIndex(null)
                    }}>
                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>Cập nhật SP
                  </Button>
                </li>

                <li className='w-full'>
                  <Link to="/product/addRams" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                                              setSubmenuIndex(null)
                  }}>
                    <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'>
                      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>Thêm (GB) SmartPhone
                    </Button>
                  </Link>
                </li>

                <li className='w-full'>
                  <Link to="/product/addWeight" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                                                setSubmenuIndex(null)
                  }}>
                    <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'>
                      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>Thêm (KG) Trọng Lượng
                    </Button>
                  </Link>
                </li>

                <li className='w-full'>
                  <Link to="/product/addSize" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                                              setSubmenuIndex(null)
                  }}>
                    <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'>
                      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>Thêm (XL) Kích Thước
                    </Button>
                  </Link>
                </li>

              </ul>
            </Collapse>
          </li>

          <li>

            <Button className='w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500]  items-center !py-2 hover:!bg-[#f1f1f1]'
              onClick={() => isOpenSubMenu(4)}>
              <TbCategory className='text-[20px]' />
              <span>Thể Loại</span>
              <span className='ml-auto w-[30px] h-[30px] flex items-center justify-center'>
                <FaAngleDown className={`transition-all ${submenuIndex === 4 ? 'rotate-180' : ''}`} /></span>
            </Button>
            <Collapse isOpened={submenuIndex === 4 ? true : false}>
              <ul className='w-full'>
                <li className='w-full'>
                  <Link to="/category/list" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                                            setSubmenuIndex(null)
                  }}>
                    <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'>
                      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span> DS Mục Chính
                    </Button>
                  </Link>
                </li>

                <li className='w-full'>

                  <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'
                    onClick={() =>{
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Thêm Danh Mục",
                      })
                      context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                      setSubmenuIndex(null)
                    }}>
                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>Thêm Danh Mục Chính
                  </Button>

                </li>

                <li className='w-full'>
                  <Link to="/subCategory/list" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                                               setSubmenuIndex(null)
                  }}>
                    <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'>
                      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>
                      DS Mục Phụ
                    </Button>
                  </Link>
                </li>
                <li className='w-full'>

                  <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'
                    onClick={() =>{
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Thêm Danh Mục Phụ",
                      })
                      context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                      setSubmenuIndex(null)
                      }} >
                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>
                    Thêm Danh Mục Phụ
                  </Button>

                </li>
              </ul>
            </Collapse>
          </li>


          <li>
            <Link to="/orders" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                               setSubmenuIndex(null)
            }}>
              <Button className='w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500]  items-center !py-2 hover:!bg-[#f1f1f1]'>
                <IoBagCheckOutline className='text-[20px]' />
                <span>Đơn Đặt Hàng</span>
              </Button>
            </Link>
          </li>


          <li>
            <Button className='w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500]  items-center !py-2 hover:!bg-[#f1f1f1]'
              onClick={() => isOpenSubMenu(5)}>
              <PiNewspaper className='text-[20px]' />
              <span>Banner QC</span>
              <span className='ml-auto w-[30px] h-[30px] flex items-center justify-center'>
                <FaAngleDown className={`transition-all ${submenuIndex === 5 ? 'rotate-180' : ''}`} /></span>
            </Button>

            <Collapse isOpened={submenuIndex === 5 ? true : false}>
              <ul className='w-full'>
                {/* Banner V1 */}
                <li className='w-full'>
                  <Link to="/bannerV1/List" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                                            setSubmenuIndex(null)
                  }}>
                    <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'>
                      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>Danh Sách Banners
                    </Button>
                  </Link>
                </li>
                <li className='w-full'>

                  <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'
                    onClick={() => {context.setIsOpenFullScreenPanel({
                      open: true,
                      model: 'Thêm Banner QC'
                    })
                    context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                    setSubmenuIndex(null)
                    }}>
                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>Thêm Banners QC
                  </Button>

                </li>
                {/*  Banner V2 */}
                <li className='w-full'>
                  <Link to="/bannerV2/List" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                                            setSubmenuIndex(null)
                  }}>
                    <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'>
                      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>DS Banners Nổi Bật
                    </Button>
                  </Link>
                </li>
                <li className='w-full'>

                  <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'
                    onClick={() => {context.setIsOpenFullScreenPanel({
                      open: true,
                      model: 'Thêm Banners Nổi Bật'
                    })
                    context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                    setSubmenuIndex(null)
                    }}>
                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>Thêm Banners Nổi Bật
                  </Button>

                </li>



              </ul>
            </Collapse>
          </li>

          <li>
            <Button className='w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500]  items-center !py-2 hover:!bg-[#f1f1f1]'
              onClick={() => isOpenSubMenu(6)}>
              <SiBloglovin className='text-[16px]' />
              <span>Blog Tin Tức</span>
              <span className='ml-auto w-[30px] h-[30px] flex items-center justify-center'>
                <FaAngleDown className={`transition-all ${submenuIndex === 6 ? 'rotate-180' : ''}`} /></span>
            </Button>

            <Collapse isOpened={submenuIndex === 6 ? true : false}>
              <ul className='w-full'>
                <li className='w-full'>
                  <Link to="/blog/list" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                                        setSubmenuIndex(null)
                  }}>
                    <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'>
                      <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>Danh Sách Tin Tức
                    </Button>
                  </Link>
                </li>
                <li className='w-full'>

                  <Button className='!w-full !text-[rgba(0,0,0,0.7)] !capitalize !justify-start !text-[13px] !font-[500] !pl-9 flex gap-3'
                    onClick={() => {context.setIsOpenFullScreenPanel({
                      open: true,
                      model: 'Thêm Tin Tức'
                    })
                    context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                    setSubmenuIndex(null)
                    }}>
                    <span className='block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]'></span>Thêm Tin Tức
                  </Button>

                </li>



              </ul>
            </Collapse>
          </li>
                    {/* Thương hiệu, thay đổi logo */}
          <li>
            <Link to="/users" onClick={()=>{context?.windowWidth < 992 && context?.setIsSideBarOpen(false)
                              setSubmenuIndex(null)
            }}>
              <Button className='w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500]  items-center !py-2 hover:!bg-[#f1f1f1]'>
                <FaBuffer  className='text-[18px]' />
                <span>Thương Hiệu</span>
              </Button>
            </Link>
          </li>


          <li>
            <Link to="/" >
              <Button className='w-full !capitalize !justify-start flex gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500]  items-center !py-2 hover:!bg-[#f1f1f1]'
                      onClick={logout}>
                <IoMdLogOut className='text-[20px]' />
                <span>Đăng Xuất</span>
              </Button>
            </Link>
          </li>

        </ul>
      </div>

    {
      context?.windowWidth < 920 && context?.isSideBarOpen === true &&
      <div className="sidebarOverlay pointer-events-auto sm:pointer-events-none  block lg:hidden fixed top-0 left-0 bg-[rgba(0,0,0,0.3)] w-full h-full z-[30]"
          onClick={() => {context?.setIsSidebarOpen(false)
                          setSubmenuIndex(null)
          }}>
      </div>
    }
    </>
  )
}

export default Sidebar;
