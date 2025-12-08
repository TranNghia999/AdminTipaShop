import Button from "@mui/material/Button";
import React, { useContext } from "react";

// Icons
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
// Nút loading
import CircularProgress from '@mui/material/CircularProgress';

// Bảng UI Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

// check box
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import SearchBox from "../../Components/SearchBox";
// Kết nối
import { MyContext } from "../../App";
import { useState } from "react";
import { useEffect } from "react";
import { deleteMultipleData, fetchDataFromApi } from "../../utils/api";

// của check box
const label = { inputProps: { "aria-label": "Checkbox demo" } };

// các cột
const columns = [
  { id: "userImg", label: "ẢNH ĐẠI DIỆN", minWidth: 80 },
  { id: "userName", label: "TÊN NGƯỜI DÙNG", minWidth: 100 },
  {
    id: "userEmail",
    label: "EMAIL",
    minWidth: 150,
  },
  {
    id: "userPh",
    label: "SỐ ĐIỆN THOẠI",
    minWidth: 130,
  },
  {
    id: "verifyemail",
    label: "TRẠNG THÁI",
    minWidth: 130,
  },
   {
    id: "createdDate",
    label: "NGÀY TẠO",
    minWidth: 130,
  },
];

const Users = () => {
  const context = useContext(MyContext);
 
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Của thanh tìm kiếm 
  const [userTotalData, setUserTotalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getUsers();
}, []);

 const getUsers = () => {
    setIsLoading(true)
    fetchDataFromApi('/api/user/getAllUsers').then((res) => {
        setUserData(res?.users);
        setUserTotalData(res?.users);
        setIsLoading(false)
      });
 }

  useEffect(() => {
    // Filter orders based on search query
    if (searchQuery != "") {
      const filteredItems = userTotalData?.filter((user) =>
        user._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.createdAt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUserData(filteredItems)
    } else {
          fetchDataFromApi('/api/user/getAllUsers').then((res) => {
              if (res?.error == false) {
                  setUserData(res?.users)
                  setIsLoading(false)
              }
          })
      }
}, [searchQuery]);

const [sortedIds, setSortedIds] = useState([]);

   //Trình xử lý để chuyển đổi tất cả các hộp kiểm
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;

        // Cập nhật trạng thái đã kiểm tra của tất cả các mục
        const updatedItems = userData.map((item) => ({
            ...item,
            checked: isChecked,
        }));
        setUserData(updatedItems);

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

      const updatedItems = userData.map((item) =>
        item._id === id ? { ...item, checked: !item.checked } : item
      );
      setUserData(updatedItems);

      // Cập nhật trạng thái ID đã sắp xếp
      const selectedIds = updatedItems.filter((item) => 
                                      item.checked).map((item) => item._id).sort((a, b) => a - b);
                                      setSortedIds(selectedIds);

     // console.log(selectedIds)
    };

      // Xóa nhiều sản phẩm
  const deleteMultiple = () => {
    if (sortedIds.length === 0) {
        context.alertBox('error', 'Vui lòng chọn các mục để xóa.');
          return;
    }
    try {
        deleteMultipleData(`/api/user/deleteMultiple`, {
          data: { ids: sortedIds }, }).then((res) => {
          getUsers();
            context.alertBox("success", "Đã xóa người dùng");
          setSortedIds([]);
          })
        } catch (error) {
          context.alertBox('error', 'Lỗi xóa mục');
        }
      }


  return (
    <>
      <div className="card my-2 pt-5 shadow-md sm:rounded-lg bg-white">
        {/* Bộ lọc */}
        <div className="flex items-center w-full  px-5 justify-between">
          <div className="col w-[40%]">
            <h2 className="text-[18px] font-[600]"> Quản Lý Khách Hàng </h2>
          </div>

          <div className="col w-[30%] ml-auto flex items-center gap-3">
            {
              sortedIds?.length !== 0 && <Button variant="contained" className="btn-sm" size="small"
                  color="error"
                  onClick={deleteMultiple}>Xóa</Button>
            }
            <SearchBox
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                  />
          </div>
        </div>
        <br />

        <TableContainer sx={{ maxHeight: 405}}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead className="">
              <TableRow>
                <TableCell> 
                    <Checkbox {...label} size="small"
                    onChange={handleSelectAll}
                    checked={ (userData?.length > 0 ? userData.every((item) => item.checked) : false)}
                  />
                </TableCell>

                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                        <span className="whitespace-normal">{column.label}</span> 
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                    
                  isLoading === false ? userData?.length !== 0 && userData?.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                          )?.reverse()?.map((user, index)=>{
                      return (
                            <TableRow key={index}>
                              <TableCell style={{ minWidth: columns.minWidth }}>
                                 <Checkbox {...label} size="small"
                                    // Chọn Tất cả sản phẩm
                                    checked={user.checked === true ? true : false}
                                    // Chọn 1 sản phẩm
                                    onChange={(e) => handleCheckboxChange(e, user._id, index)}
                                    />
                              </TableCell>

                              {/* <TableCell style={{ minWidth: columns.minWidth }}>
                                <div className="flex items-center gap-4 w-[70px]">
                                  <div className="flex items-center gap-4 w-[300px]">
                                      <div className="img w-[45px] h-[45px] rounded-md overflow-hidden group">
                                          <Link data-discover="true">
                                            <img
                                              src={user?.avatar !=="" && user?.avatar !==undefined ? user?.avatar : '/user.jpg'}
                                              className="w-full group-hover:scale-105 transition-all"
                                            />
                                          </Link>
                                      </div>
                                    <div className="info flex flex-col gap-1">
                                           <span className="font-[500]">{user?.name}</span>
                                          <div className="flex items-center gap-1">
                                               <MdOutlineMarkEmailRead />
                                            <span className="flex items-center gap-2 w-[200px]"> {user?.email}</span>
                                          </div>
                                    </div>

                                  </div>
                                 
                                </div>
                              </TableCell> */}

                              <TableCell style={{ minWidth: columns.minWidth }}>
                                <div className="flex items-center gap-4 w-[70px]">
                                  <div className="img w-[45px] h-[45px] rounded-md overflow-hidden group">
                                    <Link  data-discover="true">
                                      <img
                                        src={user?.avatar !=="" && user?.avatar !==undefined ? user?.avatar : '/user.jpg'}
                                        className="w-full group-hover:scale-105 transition-all"
                                      />
                                    </Link>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell style={{ minWidth: columns.minWidth }}>
                                <span style={{ color: "#111827", fontWeight: 500 }}>
                                  {user?.name}
                                </span>
                              </TableCell>

                              <TableCell style={{ minWidth: columns.minWidth }}>
                                {/* <span className="flex items-center gap-2">
                                    <MdOutlineMarkEmailRead />
                                    {user?.email}
                                </span> */}
                                 <span className="flex items-center gap-2" 
                                      style={{ color: "#2563eb", fontWeight: 400 }}>
                                  <MdOutlineMarkEmailRead className="text-[16px]" />
                                  {user?.email}
                                </span>
                                
                              </TableCell>

                              <TableCell style={{ minWidth: columns.minWidth }}>
                                  <span className="flex items-center gap-2">
                                    <MdLocalPhone />
                                     {/* { user?.mobile === null ? 'Chưa Cập Nhật' : user?.mobile} */}
                                      <span className={
                                            !user?.mobile
                                              ? "font-semibold text-gray-500"
                                              : "font-normal text-black"
                                          } >
                                          {user?.mobile ? user.mobile : "Chưa cập nhật"}
                                        </span>
                                </span>
                              </TableCell>

                              <TableCell style={{ minWidth: columns.minWidth }}>
                                {
                                  user?.verify_email === false ?
                                  <span className={`inline-block py-2 px-4 rounded-full text-[12px] capitalize bg-red-500 text-white font-[500]`}> 
                                  Chưa Xác Thực
                                  </span>
                                  :
                                  <span className={`inline-block py-2 px-4 rounded-full text-[12px] capitalize bg-green-500 text-white font-[500] `}> 
                                  Đã Xác Thực
                                  </span>
                                }
                              </TableCell>

                              <TableCell style={{ minWidth: columns.minWidth }}>
                                 <span  className="flex items-center gap-2" 
                                        style={{ color: "#374151", fontWeight: 500 }}>
                                  <FaRegCalendarAlt />
                                  {user?.createdAt?.split("T")[0]}
                                </span>
                              </TableCell>


                            </TableRow>
                      )
                  })

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
          count={userData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}

          labelRowsPerPage="Hiển thị:"
          labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} / ${count} người dùng`
          }/>
      </div>
    </>
  );
};

export default Users;
