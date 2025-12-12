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
import { editData, fetchDataFromApi, formatCurrency } from "../../utils/api";
import Products from "../Products";

const Dashboard = () => {

// Sử dụng context
const context = useContext(MyContext);
// Các kết nối API server đến Admin
const [productData, setProductData] = useState([]);
// Code Của Sản Phẩm [ Chức Năng ]
const [isLoading, setIsLoading] = useState(false);
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
      <div className="w-full py-5 px-5 border border-[rgba(0,0,0,0.1)] bg-[#f1faff] flex items-center gap-8 mb-5 justify-between rounded-md">
        <div className="info">
          <h1 className="text-[25px] sm:text-[35px] font-bold leading-10 mb-3">
            {greet} <br /> <spam className="text-[25px] sm:text-[35px] text-[#3872FA]">Admin</spam> 
          </h1>
          <p>{desc}</p>
          <br />
          <Button className="btn-blue !capitalize gap-1"
           onClick={()=>context.setIsOpenFullScreenPanel({ open: true,
                                                          model: 'Thêm Sản Phẩm'})}>
            <MdAddCircle className="text-[20px]" /> Thêm Sản Phẩm
          </Button>
        </div>
        <img src="/shop.png" className="w-[250px] hidden lg:block"/>
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
        <Products/>    
{/* Thành Phần Lịch sử đơn hàng*/}

      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 px-5 py-5 flex-col sm:flex-row">
        <h2 className="text-[18px] font-[600] w-[75%] text-left mb-2 lg:mb-0 ">Đơn Hàng Gần Đây</h2>

        <div className="w-full ml-auto lg:w-1/2 ">
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
                            width={context?.windowWidth > 920 ? (context?.windowWidth - 300 ) : (context?.windowWidth - 50) }
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
