import React, { useState, useContext, useEffect } from "react";
import DashboardBoxes from "../../Components/DashboardBoxes";
import Button from "@mui/material/Button";
 
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";

//icon
import { AiOutlineEdit } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { GoTrash } from "react-icons/go";
import { MdAddCircle } from "react-icons/md";

// check box
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";

import Badge from '../../Components/Badge'

// code số thứ tự trang
import Pagination from '@mui/material/Pagination';
// Bảng UI Table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
// thanh lọc
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// Mã [ Hình ảnh chỉ được tải khi cần thiết (người dùng cuộn tới) ]
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
// Nút loading
import CircularProgress from '@mui/material/CircularProgress';
// Đánh giá sao sản phẩm
import Rating from '@mui/material/Rating';
// Biểu đồ
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { MyContext } from "../../App";
import SearchBox from "../../Components/SearchBox";
import { deleteData, deleteMultipleData, editData, fetchDataFromApi, formatCurrency } from "../../utils/api";


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

// các cột
const columns = [
  { id: 'product', label: 'TÊN SẢN PHẨM', minWidth: 150 },
  { id: 'category', label: 'DANH MỤC CHÍNH', minWidth: 160 },
  {
    id: 'subCategory',
    label: 'DANH MỤC PHỤ',
    minWidth: 150,
  },
  {
    id: 'price',
    label: 'GIÁ',
    minWidth: 130,
  },
  {
    id: 'sales',
    label: 'GIẢM GIÁ',
    minWidth: 100,
  },
  {
    id: 'rating',
    label: 'ĐÁNH GIÁ',
    minWidth: 100,
  },
  {
    id: 'action',
    label: 'CHỨC NĂNG',
    minWidth: 100,
  },
];


const Dashboard = () => {

// Sử dụng context
const context = useContext(MyContext);
// Code Của Sản Phẩm [ Chức Năng ]
const [isLoading, setIsLoading] = useState(false);
// Trang hiện tại
const [page, setPage] = React.useState(0);
// Số hàng mỗi trang
const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // Lọc Danh Mục Chính
const [productCat, setProductCat] = React.useState('');
  // Lọc danh mục phụ
const [productSubCat, setProductSubCat] = React.useState('');
// Lọc danh mục con
const [productThirdLavelCat, setProductThirdLavelCat] = useState('');
// Các kết nối API server đến Admin
const [productData, setProductData] = useState([]);
// Trạng thái ID đã sắp xếp
const [sortedIds, setSortedIds] = useState([]);

// Lọc danh mục chính
    const handleChangeProductCat = (event) => {
        setProductCat(event.target.value);
        setProductSubCat('');
        setProductThirdLavelCat('');
          setIsLoading(true)
        fetchDataFromApi(`/api/product/getAllProductsbyCatId/${event.target.value}`).then((res)=>{
          if (res?.error === false) {
              setProductData(res?.products)
              setTimeout(() => {
                  setIsLoading(false)
              }, 300);
          }
      })
   
  };
// Lọc danh mục phụ
    const handleChangeProductSubCat = (event) => {
        setProductSubCat(event.target.value);
         setProductCat('');
        setProductThirdLavelCat('');
            setIsLoading(true)
        fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${event.target.value}`).then((res)=>{
          if (res?.error === false) {
              setProductData(res?.products)
              setTimeout(() => {
                  setIsLoading(false)
              }, 500);
          }
      })
       
    };
// Lọc danh mục con 
    const handleChangeProductThirdLavelCat = (event) => {
        setProductThirdLavelCat(event.target.value);
        setProductCat('');
        setProductSubCat('');
       
             setIsLoading(true)
        fetchDataFromApi(`/api/product/getAllProductsByThirdLavelCat/${event.target.value}`).then((res)=>{
          if (res?.error === false) {
              setProductData(res?.products)
              setTimeout(() => {
                  setIsLoading(false)
              }, 500);
          }
      })
    };
// Thay đổi số hàng mỗi trang
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
// Thay đổi trang hiện tại
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
// Lấy tất cả sản phẩm
    useEffect((()=>{
      getProducts();
    }),[context?.isOpenFullScreenPanel])
// Hàm lấy tất cả sản phẩm
   const getProducts = async () => {
      setIsLoading(true)
      fetchDataFromApi("/api/product/getAllProducts").then((res) => {
        // lấy các sản phẩm
          setproductTotalData(res?.products);
          let productArr = [];
          if (res?.error === false) {
              for (let i = 0; i < res?.products?.length; i++) {
                  productArr[i] = res?.products[i];
                  productArr[i].checked = false;
                  // console.log(res?.products[i])
              }
              setTimeout(() => {
                setProductData(productArr.reverse())
                setIsLoading(false)
            }, 300);
              
          }
      })
  }

  // Code xóa bỏ sản phẩm
    const deleteProduct = (id) => {
      deleteData(`/api/product/${id}`).then((res) => {
          getProducts();
          context.alertBox("success", "Đã xóa thành công");
      })
    }

    // Xóa nhiều sản phẩm
    const deleteMultipleProduct = () => {
      if (sortedIds.length === 0) {
        context.alertBox('error', 'Vui lòng chọn các mục để xóa.');
        return;
      }

        try {
      deleteMultipleData(`/api/product/deleteMultiple`, {
        data: { ids: sortedIds }, }).then((res) => {
        getProducts();
        context.alertBox("success", "Đã xóa sản phẩm");
        setSortedIds([]);

      })
    } catch (error) {
      context.alertBox('error', 'Lỗi xóa mục');
    }
  }


//Trình xử lý để chuyển đổi tất cả các hộp kiểm
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;

        // Cập nhật trạng thái đã kiểm tra của tất cả các mục
        const updatedItems = productData.map((item) => ({
            ...item,
            checked: isChecked,
        }));
        setProductData(updatedItems);

        // Cập nhật trạng thái ID đã sắp xếp
        if (isChecked) {
            const ids = updatedItems.map((item) => item._id).sort((a, b) => a - b);
            console.log(ids)
            setSortedIds(ids);
        } else {
            setSortedIds([]);
      }
    };

    // Chọn 1 Sản phẩm ở checkbox
  const handleCheckboxChange = (e, id, index) => {

      const updatedItems = productData.map((item) =>
        item._id === id ? { ...item, checked: !item.checked } : item
      );
      setProductData(updatedItems);

      // Cập nhật trạng thái ID đã sắp xếp
      const selectedIds = updatedItems
        .filter((item) => item.checked)
        .map((item) => item._id)
        .sort((a, b) => a - b);
      setSortedIds(selectedIds);

      console.log(selectedIds)
    };

    // Dữ liệu biểu đồ
  const [chartData, setChartData] = useState([]);
  // Năm hiện tại
  const [year, setYear] = useState(new Date().getFullYear());

  // Lấy tổng số người dùng theo năm
  const getTotalUsersByYear = () => {
    fetchDataFromApi(`/api/order/users`).then((res) => {
        const users = [];
        res?.TotalUsers?.length !== 0 &&
          res?.TotalUsers?.map((item) => {
            users.push({
                name: item?.name,
                TotalUsers: parseInt(item?.TotalUsers),
            });
        });
        const uniqueArr = users.filter(
            (obj, index, self) =>
            index === self.findIndex((t) => t.name === obj.name)
        );
        setChartData(uniqueArr);
    });
}

  // Lấy tổng doanh số theo năm
  const getTotalSalesByYear = () => {
      fetchDataFromApi(`/api/order/sales`).then((res) => {
          const sales = [];
          res?.monthlySales?.length !== 0 &&
            res?.monthlySales?.map((item) => {
              sales.push({
                  name: item?.name,
                  TotalSales: parseInt(item?.TotalSales),
              });
          });

          const uniqueArr = sales.filter(
              (obj, index, self) =>
              index === self.findIndex((t) => t.name === obj.name)
          );

          setChartData(uniqueArr);
      });
  }
  // Lấy dữ liệu khi component được tải lần đầu
  const handleChangeYear = (event) => {
    getTotalSalesByYear(event.target.value)
    setYear(event.target.value);
};

// Lời chào Admin
const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return {
      greet: "Chào buổi sáng",
      desc: "Đây là những gì đang diễn ra tại cửa hàng của bạn sáng nay. Xem số liệu thống kê ngay."
    };
  }

  if (hour < 18) {
    return {
      greet: "Chào buổi chiều",
      desc: "Đây là những gì đang diễn ra tại cửa hàng của bạn chiều nay. Cập nhật số liệu kinh doanh ngay."
    };
  }

  return {
    greet: "Chào buổi tối",
    desc: "Đây là những gì đang diễn ra tại cửa hàng của bạn tối nay. Tổng hợp nhanh doanh thu và đơn hàng."
  };
};
// Lấy lời chào và mô tả - sáng/chiều/tối
const { greet, desc } = getGreeting();

// Lấy tất cả người dùng và đánh giá
const [users, setUsers] = useState([]);
const [allReviews, setAllReviews] = useState([]);

useEffect(() => {
    getTotalSalesByYear();

    fetchDataFromApi("/api/user/getAllUsers").then((res) => {
        if (res?.error === false) {
            setUsers(res?.users)
        }
    })
    fetchDataFromApi("/api/user/getAllReviews").then((res) => {
        if (res?.error === false) {
            setAllReviews(res?.reviews)
        }
    })
}, [])
  
  const [ordersCount, setOrdersCount] = useState(null);   // tổng số đơn hàng
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orders, setOrders] = useState([]);          // chứa totalPages
  const [ordersData, setOrdersData] = useState([]);  // danh sách của 1 page
  const [totalOrdersData, setTotalOrdersData] = useState([]); // tất cả đơn (để search)
  const [pageOrder, setPageOrder] = useState(1);
  const [orderStatus, setOrderStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const LIMIT = 5;
  // Của Thanh tìm kiếm sản phẩm
  const [productTotalData, setproductTotalData] = useState([]);

  // Gọi API - backend trả về toàn bộ orders (không phân trang), vì vậy tính phân trang phía client
  useEffect(() => {
    fetchDataFromApi("/api/order/order-list").then((res) => {
      if (res?.error === false) {
        const all = res?.data || [];
        setTotalOrdersData(all);

        const totalPages = Math.ceil((all?.length || 0) / LIMIT) || 1;
        // lưu vào orders object để component Pagination dùng
        setOrders({ ...res, totalPages });

        // slice data cho page hiện tại
        const start = (pageOrder - 1) * LIMIT;
        const pageData = all.slice(start, start + LIMIT);
        setOrdersData(pageData);
      }
    });

    fetchDataFromApi('/api/order/count').then((res) => {
        if (res?.error === false) {
              setOrdersCount(res?.count)
          }
      })
  }, [pageOrder, orderStatus]);

  // Tìm kiếm theo: id, email, tên người nhận, ngày tạo đơn - tìm kiếm theo đơn hàng
  useEffect(() => {
    if (!searchQuery.trim()) {
      // load lại page từ cached toàn bộ orders
      const all = totalOrdersData || [];
      const start = (pageOrder - 1) * LIMIT;
      const pageData = all.slice(start, start + LIMIT);
      setOrdersData(pageData);
      return;
    }
    const kw = searchQuery.toLowerCase();

    const filtered = totalOrdersData.filter((order) => {

      const mobileStr = String(order?.delivery_address?.mobile || "").toLowerCase();

      return (
        order?._id?.toLowerCase().includes(kw) ||                         // mã đơn
        order?.userId?.email?.toLowerCase().includes(kw) ||              // email
        order?.delivery_address?.name?.toLowerCase().includes(kw) ||     // tên người nhận
        mobileStr.includes(kw) ||                                        // ⭐ số điện thoại (đã fix)
        order?.createdAt?.toLowerCase().includes(kw)                     // ngày tạo
      );
    });

    setOrdersData(filtered);
  }, [searchQuery]);

  const isShowOrderdProduct = (index) =>
    setIsOpenOrderdProduct(isOpenOrderdProduct === index ? null : index);

  // Thay đổi trạng thái đơn hàng
  const handleChange = (event, id) => {
    const obj = {
      id: id,
      order_status: event.target.value
    };

    editData(`/api/order/order-status/${id}`, obj).then((res) => {
      if (res?.data?.error === false) {
        context.alertBox("success", res?.data?.message);
        setOrderStatus(event.target.value);
      }
    });
  };


    
      
      useEffect(() => {
      // Filter orders based on search query
      if (searchQuery != "") {
        const filteredOrders = productTotalData?.filter((product) =>
          product._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product?.catName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product?.subCat?.includes(searchQuery)
        );
        setProductData(filteredOrders)
      } else {
            fetchDataFromApi(`/api/product/getAllProducts`).then((res) => {
                if (res?.error == false) {
                    setProductData(res?.products)
                }
            })
        }
  }, [searchQuery]);


  return (
    <>
      <div className="w-full py-2 px-5 border border-[rgba(0,0,0,0.1)] bg-[#f1faff] flex items-center gap-8 mb-5 justify-between rounded-md">
        <div className="info">
          <h1 className="text-[35px] font-bold leading-10 mb-3">
            {greet} <br /> Admin 
          </h1>
          <p>{desc}</p>
          <br />
          <Button className="btn-blue !capitalize gap-1"
           onClick={()=>context.setIsOpenFullScreenPanel({ open: true,
                                                          model: 'Thêm Sản Phẩm'})}>
            <MdAddCircle className="text-[20px]" /> Thêm Sản Phẩm
          </Button>
        </div>
        <img
          src="/shop.png"
          className="w-[250px]"
        />
      </div>
      {/* Các mục tổng quan */}
      {
        productData?.length !== 0 && users?.length !== 0 && allReviews?.length !== 0 &&
          <DashboardBoxes orders={ordersCount} 
                          products={productData?.length}
                          users={users?.length} 
                          reviews={allReviews?.length}
                          category={context?.catData?.length} />

      }
{/* Thành phần Sản phẩm */}
     <div className="card my-4 pt-5  shadow-md sm:rounded-lg bg-white">
          
            {/* Bộ lọc */}
            <div className="flex items-center w-full  px-5 justify-between gap-4">
                 
                  {/* Bộ lọc danh mục chính */}
                  <div className="col w-[18%]">
                    <h4 className="text-[13px] font-[600] mb-2">Danh Mục Chính</h4>
                   {
                        context?.catData?.length !== 0 &&
                        
                         <Select
                        labelId="demo-simple-select-label"
                        id="productCatDrop"
                        size='small'
                        style={{ zoom: '80%' }}
                        className='w-full'
                        value={productCat}
                        label="Category"
                        onChange={handleChangeProductCat}
                        >

                        {
                            context?.catData?.map(((cat,index)=>{
                            return(
                                <MenuItem   value={cat?._id} >  {cat?.name}</MenuItem>
                            )
                            }))
                        }
                            
                        </Select>
                    }
         
                  </div>


                   {/* Bộ lọc danh mục phụ */}
                   <div className="col w-[18%]">
                    <h4 className="text-[13px] font-[600] mb-2">Danh Mục Phụ</h4>
                     {
                        context?.catData?.length !== 0 &&
                        
                         <Select
                        labelId="demo-simple-select-label"
                        id="productCatDrop"
                        size='small'
                        style={{ zoom: '80%' }}
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
                                                <MenuItem   value={subCat?._id}> {subCat?.name}</MenuItem>
                                            )
                                        })
                                    )
                            }))
                        }
                            
                        </Select>
                    }
         
                  </div>

                  {/* Bộ lọc danh mục con */}
                  
                   <div className="col w-[18%]">
                    <h4 className="text-[13px] font-[600] mb-2">Danh Mục Con</h4>
                       {
                        context?.catData?.length !== 0 &&
                        
                         <Select
                        labelId="demo-simple-select-label"
                        id="productCatDrop"
                        size='small'
                        style={{ zoom: '80%' }}
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
                                                                    <MenuItem   value={thirdLavelCat?._id} key={index}>
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
    
                <div className="col w-[25%] ml-auto flex items-center gap-3">
                  {
                      sortedIds?.length !== 0 && <Button variant="contained" className="btn-sm" size="small"
                          color="error"
                          onClick={deleteMultipleProduct}>Xóa</Button>
                  }

                     <SearchBox
                       searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                     setPageOrder={setPageOrder}
                  />
                </div>
               
            </div>
          <br/>
    
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead className="">
          <TableRow>  

              {/* Hộp kiểm tất cả sản phẩm  */}
                <TableCell> 
                    <Checkbox {...label} size="small"
                    onChange={handleSelectAll}
                    checked={ (productData?.length > 0 ? productData.every((item) => item.checked) : false)}
                  />
                </TableCell>
                    {
                      columns.map((column) => (
                      <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }} > 
                                {column.label} 
                      </TableCell>
                      ))
                    }
            </TableRow>
        </TableHead>
              
        <TableBody>

               {/* Hiển thị dữ liệu sản phẩm tại đây */}
        {
          isLoading=== false ? productData?.length !==0 && productData?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
            )
              ?.map(((product, index)=>{
                      return(

                <TableRow key={index} >

                          {/* Hộp kiểm của 1 sản phẩm */}
                    <TableCell style={{ minWidth: columns.minWidth }}> 
                          <Checkbox {...label} size="small"
                          // Chọn Tất cả sản phẩm
                          checked={product.checked === true ? true : false}
                          // Chọn 1 sản phẩm
                          onChange={(e) => handleCheckboxChange(e, product._id, index)}
                          />
                    </TableCell>
                    
                    {/* Hiển Thị Hình Ảnh */}
                    <TableCell style={{ minWidth: columns.minWidth }}>
                        <div className="flex items-center gap-4 w-[300px]">
                          <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group"> 
                      
                                <Link to={`/product/${product?._id}`} data-discover="true"> 
                                    <LazyLoadImage
                                        alt={"image"}
                                        effect="blur"
                                        className="w-full group-hover:scale-105 transition-all"
                                        src={product?.images[0]}
                                      />
                                </Link>
                          
                          </div>
                          <div className="info w-[75%]">
                              <h3 className="text-[12px] font-[600] leading-4 hover:text-[#3872fa]">
                                    <Link to={`/product/${product?._id}`} > {product?.name}</Link>
                              </h3>
                                    <span className="text-[12px]">  {product?.brand} </span>
                          </div>
                        </div>
      
                    </TableCell>

                    <TableCell style={{ minWidth: columns.minWidth }}> {product?.catName} </TableCell>
              
                    <TableCell style={{ minWidth: columns.minWidth }}> {product?.subCat} </TableCell>
        
                    <TableCell style={{ minWidth: columns.minWidth }}> 
                          
                        <div className='flex items-center gap-1 flex-col'>
                              <span className='oldPrice line-through leading-3 font-[500] text-gray-500 text-[14px]'> {product?.price} &#8363; </span>
                              <span className='price text-primary font-[600] text-[14px] '>{product?.oldPrice}&#8363; </span>
                        </div>
                          
                    </TableCell>

                    <TableCell style={{ minWidth: columns.minWidth }}> 
                          
                            <p className="text-[14px] w-[100px]">
                                  <span className="font-[600]"> {product?.sale}  </span> sale
                            </p>
                    </TableCell>

                     <TableCell style={{ minWidth: columns.minWidth }}> 
                          
                            <p className="text-[14px] w-[100px]">
                                <Rating name="half-rating" defaultValue={product?.rating} size='small' readOnly />
                            </p>
                            
                    </TableCell>
                          
                    <TableCell style={{ minWidth: columns.minWidth }}> 
                          
                        <div className="flex items-center gap-1">
                            
                          <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                   onClick={()=>context.setIsOpenFullScreenPanel({ open: true, model: 'Sửa Sản Phẩm',id: product?._id})}>
                            <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]"/>
                          </Button>

                            <Link to={`/product/${product?._id}`}> 
                          <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                            <LuEye className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                          </Button>
                          </Link>
                          
                         
                          <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                  onClick={() => deleteProduct(product?._id)}>
                            <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px]"/>
                          </Button>
                         
                          
                        </div>
                          
                    </TableCell>
                </TableRow>

                )
            }))

            :
            <>
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex items-center justify-center w-full min-h-[400px]">
                    <CircularProgress color="inherit" /> 
                </div>
                </TableCell>
              </TableRow>
            </>
            
        }
                
          

        </TableBody>
      </Table>
    </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={productData?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage} 
               // ⭐ Chuyển toàn bộ sang tiếng Việt
              labelRowsPerPage="Hiển thị:"
              labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} / ${count} sản phẩm`
              }
              />
    
  </div>

       
{/* Thành Phần Lịch sử đơn hàng*/}
       <div className="card my-4 shadow-md sm:rounded-lg bg-white">
      <div className="flex items-center justify-between px-5 py-5">
        <h2 className="text-[18px] font-[600]">Đơn Hàng Gần Đây</h2>

        <div className="w-[25%]">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPageOrder={setPageOrder} />
        </div>

      </div>

      {/* Bảng danh sách hàng orders */}
      <div className="relative overflow-x-auto mt-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">  &nbsp; </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">  MÃ ĐƠN HÀNG  </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap"> PHƯƠNG THỨC THANH TOÁN </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap"> NGƯỜI NHẬN </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap"> SỐ ĐIỆN THOẠI </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap"> ĐỊA CHỈ </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap"> TỔNG TIỀN </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap"> Email</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap"> MÃ NGƯỜI DÙNG</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap"> TRẠNG THÁI</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap"> NGÀY ĐẶT</th>
            </tr>
          </thead>
          <tbody>

            {
              ordersData?.length !== 0 && ordersData?.map((order, index) => {
                return (
                  <>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 font-[500]">
                      <td className="px-6 py-4 font-[500]">
                        <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]'
                          onClick={() => isShowOrderdProduct(index)}>

                          {
                            isOpenOrderdProduct === index ? <FaAngleUp className='text-[16px] text-[rgba(0,0,0,0.7)]' /> :
                              <FaAngleDown className='text-[16px] text-[rgba(0,0,0,0.7)]' />
                          }

                        </Button>
                      </td>
                      <td className="px-6 py-4 font-[500]">
                        <span className='text-primary'>{order?._id}</span>
                      </td>
                      <td className="px-6 py-4 font-[500]">
                        <span className='text-primary whitespace-nowrap'>{order?.paymentId ? order?.paymentId : 'Thanh toán khi nhận hàng'}</span>
                      </td>

                      <td className="px-6 py-4 font-[500] whitespace-nowrap"> {order?.delivery_address?.name}</td>
                      <td className="px-6 py-4 font-[500]"> +{order?.delivery_address?.mobile} </td>

                      <td className="px-6 py-4 font-[500]">
                        <span className='block w-[400px]'>
                          {
                            order?.delivery_address?.address_line1 + order?.delivery_address?.landmark + ', '
                            + order?.delivery_address?.district + ', '
                            + order?.delivery_address?.city + ', '
                            + order?.delivery_address?.state + ', '
                            + order?.delivery_address?.country
                          }
                        </span>
                      </td>

                      <td className="px-6 py-4 font-[500]">{formatCurrency(order?.totalAmt)}</td>
                      <td className="px-6 py-4 font-[500]">{order?.userId?.email}</td>

                      <td className="px-6 py-4 font-[500]">
                        <span className='text-primary'>{order?.userId?._id}</span>
                      </td>

                      <td className="px-6 py-4 font-[500]">
                        <Badge status={order?.order_status} />
                      </td>
                      <td className="px-6 py-4 font-[500] whitespace-nowrap">{order?.createdAt?.split("T")[0]}</td>
                    </tr>
                    {
                      isOpenOrderdProduct === index && (

                        <tr>
                          <td className='pl-20' colSpan="6">
                            <div className="relative overflow-x-auto mt-5">
                              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                  <tr>

                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">  MÃ SẢN PHẨM</th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap"> TÊN SẢN PHẨM</th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap"> HÌNH ẢNH </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap"> SỐ LƯỢNG </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap"> ĐƠN GIÁ </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap"> THÀNH TIỀN </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {
                                    order?.products?.map(((item, index) => {
                                      return (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 font-[500]" key={index}>

                                          <td className="px-6 py-4 font-[500]">
                                            <span className='text-gray-600'>{item?._id}</span>
                                          </td>
                                          <td className="px-6 py-4 font-[500]">
                                            <div className='w-[200px]'>
                                              {item?.productTitle}
                                            </div>
                                          </td>

                                          <td className="px-6 py-4 font-[500] ">
                                            <img src={item?.image}
                                              className='w-[40px] h-[40px] object-cover rounded-md'
                                            />
                                          </td>
                                          <td className="px-6 py-4 font-[500]"> {item?.quantity} </td>

                                          <td className="px-6 py-4 font-[500]">{formatCurrency(item?.price)}</td>
                                          <td className="px-6 py-4 font-[500]">{formatCurrency(item?.price * item?.quantity)}</td>

                                        </tr>
                                      )
                                    }))
                                  }



                                  <tr>
                                    <td className='bg-[#f1f1f1]' colSpan="12"></td>
                                  </tr>

                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                  </>
                )
})}
          </tbody>
        </table>
      </div>
      {orders?.totalPages > 1 && (
        <div className="flex items-center justify-center mt-10 pb-5">
          <Pagination
            showFirstButton
            showLastButton
            count={orders?.totalPages}
            page={pageOrder}
            onChange={(e, value) => setPageOrder(value)}
          />
        </div>
      )}
    </div>
{/* Thành phần biểu đồ */}
       <div className="card my-4 shadow-md sm:rounded-lg bg-white">
              <div className="flex items-center justify-between px-5 py-5">
                <h2 className="text-[18px] font-[600]">Tổng số người dùng và doanh số</h2>
              </div>

               <div className="flex items-center gap-5 px-5 py-5 pt-1">
                <Button className="flex items-center gap-1 text-[15px] cursor-pointer" onClick={getTotalUsersByYear}> 
                    <span className="block w-[9px] h-[9px] rounded-full bg-green-600"></span>Người Dùng
                </Button>

                 <Button className="flex items-center gap-1 text-[15px] cursor-pointer" onClick={getTotalSalesByYear}> 
                    <span className="block w-[9px] h-[9px] rounded-full bg-[#3872fa]"></span>Doanh Thu
                </Button>
                
              </div>
              {
                chartData?.length !== 0 &&
                  <BarChart
                            width={1000}
                            height={500}
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}>
                    <XAxis
                            dataKey="name"
                            scale="point"
                            padding={{ left: 10, right: 10 }}
                            tick={{ fontSize: 12 }}
                            label={{ position: "insideBottom", fontSize: 14 }}
                            style={{ fill: context?.theme === "dark" ? "white" : "#000" }}/>
                    <YAxis
                            tick={{ fontSize: 12, dy: 0  }}     // ⭐ Không cho dịch chuyển xuống dòng    
                            width={100}                        // ⭐ Tăng chiều rộng để tránh bị xuống dòng
                            interval={0}                      // ⭐ Bắt buộc tick hiển thị đúng 1 dòng
                            tickFormatter={(value, index) => {

                            // Nếu là dữ liệu Users (thường < 100000) → trả về số bình thường
                            if (value < 1_000_000) {
                              return value.toLocaleString("vi-VN");
                            }

                            // Nếu là doanh thu → format triệu / tỷ
                            return value >= 1_000_000_000
                              ? (value / 1_000_000_000).toFixed(0) + " tỷ"
                              : (value / 1_000_000).toFixed(0) + " triệu";
                          }}
                            label={{ position: "insideBottom", fontSize: 12 }} 
                            style={{ fill: context?.theme === "dark" ? "white" : "#000" }}/>
                    <Tooltip
                            formatter={(value, name) => {
                                  // Đổi key sang tiếng Việt
                                  if (name === "TotalSales") {
                                    // format tiền VNĐ: 34177000 → 34.177.000 ₫
                                    const vnd = value.toLocaleString("vi-VN") + " ₫";
                                    return [vnd, "Doanh thu"];
                                  }

                                  if (name === "TotalUsers") {
                                    return [value.toLocaleString("vi-VN"), "Khách hàng mới"];
                                  }

                                  return [value, name];
                                }}

                                labelFormatter={(label) => {
                                  // label đang là THÁNG 11 → giữ nguyên hoặc đổi format nếu muốn
                                  return label;
                                }}
                            contentStyle={{
                                backgroundColor: "#071739",
                                color: "white",
                            }} // Thiết lập Màu Nền và Màu Chữ cho Tooltip
                            labelStyle={{ color: "yellow" }} // Màu chữ Nhãn
                            itemStyle={{ color: "cyan" }} // Thiết lập màu cho từng mục trong Tooltip
                            cursor={{ fill: "white" }} // Tùy chỉnh Màu Nền Con Trỏ Tooltip khi Di Chuột
                          />
                    <Legend 
                        formatter={(value) => {
                          if (value === "TotalUsers") return "Người Dùng";
                          if (value === "TotalSales") return "Doanh Thu";
                          return value;
                        }}
                      />
                    <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            vertical={false}/>
                    <Bar dataKey="TotalUsers" stackId="a" fill="#16a34a" /> 
                    <Bar dataKey="TotalSales" stackId="b" fill="#0858f7" />

                  </BarChart>
              }
       </div>
    </>
  );
};

export default Dashboard;
