import React, {useContext, useState} from 'react'
import Button from '@mui/material/Button';
import { RiMenu2Line } from "react-icons/ri";
// code UI Thông Báo
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
// Biểu tượng Thông báo
import { FaRegBell } from "react-icons/fa";
// Hộp Thoại Hiển thị
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { IoMdClose } from "react-icons/io";
// Hiển Thị Trang Sản phẩm
import AddProduct from '../../Pages/Products/addProduct';
import AddHomeSlide from '../../Pages/HomeSliderBanners/addHomeSlide.jsx';
import AddCategory from '../../Pages/Categegory/addCategory.jsx';
import AddSubCategory from '../../Pages/Categegory/addSubCategory.jsx';
import AddAddress from '../../Pages/Address/addAddress.jsx';
import EditCategory from '../../Pages/Categegory/editCategory.jsx';
import AddBannerV1 from '../../Pages/Banners/addBannerV1.jsx';
// Hiệu ứng chuyển của UI
import Slide from '@mui/material/Slide';

// code UI profile
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { FaRegUser } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";

import { MyContext } from '../../App';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';
import EditProduct from '../../Pages/Products/editProduct.jsx';
import EditBannerV1 from '../../Pages/Banners/editBannerV1.jsx';
import AddBlog from '../../Pages/Blog/addBlog.jsx';
import EditBlog from '../../Pages/Blog/editBlog.jsx';
import AddBannerV2 from '../../Pages/Banners/addBannerV2.jsx';
import EditBannerV2 from '../../Pages/Banners/editBannerV2.jsx';


// Hộp Thoại hiên thị
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));



const Header = () => {

  // code profile
  const [anchorMyAcc, setAnchorMyAcc] = React.useState(null);
  const openMyAcc = Boolean(anchorMyAcc);
  const handleClickMyAcc = (event) => {
    setAnchorMyAcc(event.currentTarget);
  };
  const handleCloseMyAcc = () => {
    setAnchorMyAcc(null);
  };

  // Hết nối API tới server

  const context = useContext(MyContext)
  const history = useNavigate();
  

  const logout=()=> {
      setAnchorMyAcc(null);
      
      fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accessToken')}`, { 
          withCredentials: true }).then((res) => {
             if (res?.error === false) {
                  context.setIsLogin(false);
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  history("/login")
              }
          })
      }

  return (
    <>
    <header className={`w-full h-[auto] py-2 ${context.isSidebarOpen===true ? 'pl-64' : 'pl-5'} pr-7 bg-[#fff] shadow-md flex items-center justify-between transition-all fixed top-0 left-0 z-[50]`}>
        <div className='part1'>
            <Button className='!w-[40px] !min-w-[40px] !h-[40px] !rounded-full !text-[rgba(0,0,0,0.8)]'
                    onClick={() => context.setIsSidebarOpen(!context.isSidebarOpen)}>
                <RiMenu2Line className='text-[18px] text-[rgba(0,0,0,0.8)]'/>
            </Button>
        </div>


         <div className='part2 w-[40%] flex items-center justify-end gap-5'>
              <IconButton aria-label="cart">
              <StyledBadge badgeContent={9} color="secondary">
                <FaRegBell />
              </StyledBadge>
            </IconButton>
            {
              context.isLogin === true ? (
               <div className='relative'>
            <div className='w-[35px]  h-[35px] rounded-full overflow-hidden cursor-pointer'
                onClick={handleClickMyAcc}>
              <img src='https://media.loveitopcdn.com/54/091609-thumb-15222092411420-ds-770.jpg' 
                  className='w-full h-full object-cover'/>
            </div>

             <Menu
        anchorEl={anchorMyAcc}
        id="account-menu"
        open={openMyAcc}
        onClose={handleCloseMyAcc}
        onClick={handleCloseMyAcc}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} >
        <MenuItem onClick={handleCloseMyAcc} className='!bg-white'>
          <div className='flex items-center gap-3'>
            <div className='w-[35px]  h-[35px] rounded-full overflow-hidden cursor-pointer'>
              <img src='https://media.loveitopcdn.com/54/091609-thumb-15222092411420-ds-770.jpg' 
                  className='w-full h-full object-cover'/>
            </div>
            <div className='info'>
              <h3 className='font-[500] text-[15px] leading-5'>{context?.userData?.name} </h3>
              <h6 className='font-[400] text-[12px] opacity-70'>{context?.userData?.email} </h6>
            
            </div>
          </div>
        </MenuItem>
          <Divider/>

          <Link to="/profile">
            <MenuItem onClick={handleCloseMyAcc} className='flex items-center gap-3'>
                <FaRegUser className=' text-[16px] '/> 
                <span className=' text-[14px] '>Profile</span>
            </MenuItem>
          </Link>

            <MenuItem onClick={logout} 
                      className='flex items-center gap-3'>
              <IoMdLogOut className=' text-[18px] '/> 
              <span className=' text-[14px] '>Sign Out </span>
           </MenuItem>
       
      </Menu>
         </div>

              ):(
              <NavLink  to="/login">
                <Button className='btn-blue btn-sm !rounded-full'>Sign In</Button>
              </NavLink>
           )}


      </div>

    </header>

    
      {/* phần thêm sản phẩm vào giỏ hàng - thêm toàn màn hình */}

      <Dialog fullScreen
              slots={{ transition: Transition, }}
              open={context?.isOpenFullScreenPanel.open}
              onClose={()=>context?.setIsOpenFullScreenPanel({ open: false })} >

        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="close"
              onClick={()=> context?.setIsOpenFullScreenPanel({ open: false })} >
            <IoMdClose  className='text-gray-800'/>
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span className='text-gray-800'>{ context?.isOpenFullScreenPanel?.model }</span>
            </Typography>
           
          </Toolbar>
        </AppBar>

          {
            context?.isOpenFullScreenPanel?.model === 'Thêm Địa Chỉ' && <AddAddress />
          }

          {
            context?.isOpenFullScreenPanel?.model === 'Thêm Sản Phẩm' && <AddProduct />
          }

          {
            context?.isOpenFullScreenPanel?.model === "Sửa Sản Phẩm" && <EditProduct />
          }

          {
            context?.isOpenFullScreenPanel?.model === 'Thêm Slider Trang Chủ' && <AddHomeSlide />
          }


          {
            context?.isOpenFullScreenPanel?.model === 'Thêm Danh Mục' && <AddCategory />
          }

          {
            context?.isOpenFullScreenPanel?.model === "Sửa Danh Mục" && <EditCategory />
          }

          {
            context?.isOpenFullScreenPanel?.model === 'Thêm Danh Mục Phụ' && <AddSubCategory />
          }

          {
            context?.isOpenFullScreenPanel?.model === "Thêm Banner QC" && <AddBannerV1 />
          }

          {
            context?.isOpenFullScreenPanel?.model === "Sửa Banner QC" && <EditBannerV1 />
          }

          {
            context?.isOpenFullScreenPanel?.model === "Thêm Banners Nổi Bật" && <AddBannerV2 />
          }

          {
            context?.isOpenFullScreenPanel?.model === "Sữa Banners Nổi Bật" && <EditBannerV2 />
          }

          {
            context?.isOpenFullScreenPanel?.model === "Thêm Tin Tức" && <AddBlog />
          }

          {
            context?.isOpenFullScreenPanel?.model === "Sửa Tin Tức" && <EditBlog />
          }
       
      </Dialog>
    </>
  )
}

export default Header;
