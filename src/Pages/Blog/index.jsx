import React, { useState, PureComponent, useContext, useEffect } from "react";
import Button from "@mui/material/Button";

//icon
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";

// Bảng UI Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
    { id: "image", label: "HÌNH ẢNH", minWidth: 100 },
    { id: "title", label: "TIÊU ĐỀ", minWidth: 150 },
    { id: "description", label: "NỘI DUNG MÔ TẢ", minWidth: 300 },
    { id: "action", label: "CHỨC NĂNG", minWidth: 100 },
];


const BlogList = () => {

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

    // Của Server
    const [blogData, setBlogData] = useState([]);

    // Cập nhật
    const getData = () => {
        fetchDataFromApi("/api/blog").then((res) => {
            setBlogData(res?.blogs?.reverse());
        });
    }

    useEffect(() => {
        getData();
    }, [context?.isopenFullScreenPanel])

    // Code xóa bỏ sản phẩm
    const deleteSlide = (id) => {
        deleteData(`/api/blog/${id}`).then((res) => {
            context.alertBox("success", "Đã xóa thành công");
            getData();
        })
    }

    return (
        <>

            <div className="flex items-center justify-between px-5 py-5">
                <h2 className="text-[18px] font-[600]">
                    Danh Sách Tin Tức
                </h2>

                <div className="col w-[25%] ml-auto flex items-center justify-end gap-3">
                    <Button
                        className="btn-blue btn-sm !text-white"
                        onClick={() =>
                            context.setIsOpenFullScreenPanel({
                                open: true,
                                model: "Thêm Tin Tức",
                            })
                        }
                    >
                        Thêm Tin Tức
                    </Button>
                </div>
            </div>

            <div className="card my-4 pt-5  shadow-md sm:rounded-lg bg-white">
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>

                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        width={column.minWidth}
                                        key={column.id}
                                        align={column.align || "center"}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {

                                blogData?.length !== 0 && blogData?.map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            {/* Hình ảnh */}
                                            <TableCell width={100}>
                                                <div className="flex items-center gap-4 w-[300px]">
                                                    <div className="img w-full rounded-md overflow-hidden group">

                                                        <img
                                                            src={item?.images[0]}
                                                            className="w-full group-hover:scale-105 transition-all"
                                                        />

                                                    </div>
                                                </div>
                                            </TableCell>
                                            {/* Tiêu đề */}
                                            <TableCell width={150}>
                                                <span className='text-[15px] font-[500]'>{item?.title}</span>
                                            </TableCell>

                                            {/* Nội dung */}
                                            <TableCell width={300}>
                                                <div dangerouslySetInnerHTML={{ __html: item?.description?.substr(0, 400) + '...' }} />
                                            </TableCell>
                                            {/* Chức năng */}
                                            <TableCell width={100}>
                                                <div className="flex items-center gap-1">
                                                    <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                        onClick={() => context.
                                                            setIsOpenFullScreenPanel({
                                                                open: true,
                                                                model: 'Sửa Tin Tức',
                                                                id: item?._id
                                                            })}>
                                                        <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px]" />
                                                    </Button>

                                                    <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                        onClick={() => deleteSlide(item?._id)} >
                                                        <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }


                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    blogData?.totalPages > 1 && (
                        <div className="d-flex tableFooter">
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={blogData?.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage} />

                        </div>
                    )
                }

            </div>
        </>
    );
};

export default BlogList;
