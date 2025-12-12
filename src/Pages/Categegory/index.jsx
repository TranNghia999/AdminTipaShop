import React, { useContext, useEffect } from "react";
import Button from "@mui/material/Button";

//icon
import { AiOutlineEdit } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { GoTrash } from "react-icons/go";

// check box
import { Link } from "react-router-dom";

// Bảng UI Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// Mã [ Hình ảnh chỉ được tải khi cần thiết (người dùng cuộn tới) ]
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// Hàm kết nối server
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
  { id: "image", label: "HÌNH ẢNH", minWidth: 150 },
  { id: "catName", label: "TÊN DANH MỤC", minWidth: 150 },
  { id: "action", label: "CHỨC NĂNG", minWidth: 100 },
];

const CategoryList = () => {
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
 
  const context = useContext(MyContext);
 // Hàm của server

 // Hiển thị danh mục tạo
 useEffect(() => {
       fetchDataFromApi("/api/category").then((res) => {
          context?.setCatData(res?.data)
       })
     }, [context?.isOpenFullScreenPanel])

     // Xóa danh mục tạo
  const deleteCat = (id)=>{
    deleteData(`/api/category/${id}`).then((res)=>{
    fetchDataFromApi("/api/category").then((res)=>{
      context?.setCatData(res?.data)
    })
  })
}
  return (
    <>
     
        <div className="flex items-center justify-between px-5 py-5">
          <h2 className="text-[18px] font-[600]">
           Danh Sách Danh Mục
          </h2>

          <div className="col w-[40%] ml-auto flex items-center justify-end gap-3">
            <Button
              className="btn-blue btn-sm !text-white"
              onClick={() =>
                context.setIsOpenFullScreenPanel({
                  open: true,
                  model: "Thêm Danh Mục",
                })
              }
            >
              Thêm Danh Mục
            </Button>
          </div>
        </div>

        <div className="card my-4 pt-5  shadow-md sm:rounded-lg bg-white">
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                
                  <TableRow>

                    <TableCell width={60}>
                     
                    </TableCell>

                      {columns.map((column) => (
                        <TableCell
                          width={column.minWidth}
                          key={column.id}
                          align={column.align}> 
                          {column.label}
                        </TableCell>
                      ))}
                  </TableRow>

                </TableHead>
              <TableBody>
                      {
                          context?.catData?.length!==0 && context?.catData?.map((item,index)=>{
                              return( 
                                <TableRow key={index}>
                                  {/* ô tích chọn */}
                        <TableCell>
                         
                        </TableCell>

                                  {/* Chứa ảnh */}
                        <TableCell width={100}>
                          <div className="flex items-center gap-4 w-[50px]">
                            <div className="img w-full rounded-md overflow-hidden group">
                              <Link to="/product/1752" data-discover="true">
                                  <LazyLoadImage
                                        className="w-full group-hover:scale-105 transition-all"
                                        alt={"image"}
                                        effect="blur"
                                        src={item.images[0]}
                                      />
                               
                              </Link>
                            </div>
                          </div>
                        </TableCell>

                                {/* Chứa tên danh mục */}
                        <TableCell width={100}>
                            {item?.name}
                        </TableCell> 


                                  {/* Các Công cụ Xóa, hiển thị */}
                          <TableCell width={100}>
                            <div className="flex items-center gap-1">
                              <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                      onClick={() => context.
                                        setIsOpenFullScreenPanel({
                                          open: true,
                                          model: 'Sửa Danh Mục',
                                          id:item?._id
                                        })}>
                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                              </Button>

                              <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                      onClick={()=>(deleteCat(item?._id))}>
                                <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                              </Button>
                            </div>
                          </TableCell>

                    </TableRow>)
                          })
                      }
               

              </TableBody>

            </Table>
           </TableContainer>



          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={10}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}

            labelRowsPerPage="Hiển thị:"
          labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} / ${count} danh mục`
          }
          />
        </div>
    </>
  );
};

export default CategoryList;
