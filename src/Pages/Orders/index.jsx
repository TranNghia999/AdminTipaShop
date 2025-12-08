import React, { useState, useContext, useEffect } from 'react'
import Button from "@mui/material/Button";

// Icon
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import SearchBox from '../../Components/SearchBox';
import { editData, fetchDataFromApi, formatCurrency } from '../../utils/api';

// Trạng thái đơn hàng
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// lọc trang hàng
import Pagination from "@mui/material/Pagination";

// kết nối context API sử dụng dữ liệu toàn cục
import { MyContext } from '../../App';

const Orders = () => {

  const context = useContext(MyContext);

  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orders, setOrders] = useState([]);          // chứa totalPages
  const [ordersData, setOrdersData] = useState([]);  // danh sách của 1 page
  const [totalOrdersData, setTotalOrdersData] = useState([]); // tất cả đơn (để search)
  const [pageOrder, setPageOrder] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const LIMIT = 5;

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
  }, [pageOrder, orderStatus]);


  // Tìm kiếm theo: id, email, tên người nhận, ngày tạo đơn
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



  return (
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
                        <Select labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={order?.order_status !== null ? order?.order_status : orderStatus}
                          label="Status"
                          size='small'
                          className='w-full'
                          onChange={(e) => handleChange(e, order?._id)}
                        >
                          <MenuItem value={'pending'}>Chờ xác nhận</MenuItem>
                          <MenuItem value={'confirm'}>Đang giao hàng</MenuItem>
                          <MenuItem value={'delivered'}>Đã giao hàng</MenuItem>
                        </Select>
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
  )
}

export default Orders;
