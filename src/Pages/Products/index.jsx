import Button from '@mui/material/Button';
import React, { useContext, useState } from 'react'

// Icons
import { AiOutlineEdit } from "react-icons/ai";
import { LuEye } from "react-icons/lu";
import { GoTrash } from "react-icons/go";
// Mã [ Hình ảnh chỉ được tải khi cần thiết (người dùng cuộn tới) ]
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
// Nút loading
import CircularProgress from '@mui/material/CircularProgress';
// Đánh giá sao sản phẩm
import Rating from '@mui/material/Rating';
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
// check box
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";
import SearchBox from '../../Components/SearchBox';
// Kết nối 
import { MyContext } from '../../App';
import { useEffect } from 'react';
import { deleteData, deleteMultipleData, fetchDataFromApi, formatCurrency } from '../../utils/api';

// của check box
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
    label: 'ĐƠN GIÁ',
    minWidth: 100,
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

const Products = () => {

  const context = useContext(MyContext)
  const [isLoading, setIsLoading] = useState(false);
// Trang hiện tại
    const [page, setPage] = React.useState(0);
// Số hàng mỗi trang
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

// Lọc Danh Mục Chính
  const [productCat, setProductCat] = React.useState('');
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
  const [productSubCat, setProductSubCat] = React.useState('');
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
  const [productThirdLavelCat, setProductThirdLavelCat] = useState('');
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

  // Các kết nối API server đến Admin
  const [productData, setProductData] = useState([]);

    useEffect((()=>{
      getProducts();
    }),[context?.isOpenFullScreenPanel])

    // Của Thanh tìm kiếm
    const [productTotalData, setproductTotalData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
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

const [sortedIds, setSortedIds] = useState([]);

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



  return (
    <>
          <div className="flex items-center justify-between px-2 py-0 mt-3">
  <h2 className="text-[18px] font-[600]">
    Danh Sách Sản Phẩm
    <span className="font-[400] text-14px"></span>
  </h2>

  <div className="col w-[75%] ml-auto flex items-center justify-end gap-3">

    {/* --- MOBILE: chỉ hiện XÓA khi có chọn sản phẩm --- */}
    {context?.windowWidth < 992 && sortedIds?.length > 0 && (
      <Button
        variant="contained"
        className="btn-sm"
        size="small"
        color="error"
        onClick={deleteMultipleProduct}
      >
        Xóa Vĩnh Viễn
      </Button>
    )}

    {/* --- MOBILE: khi KHÔNG chọn thì hiện Thêm Sản Phẩm --- */}
    {context?.windowWidth < 992 && sortedIds?.length === 0 && (
      <Button
        className="btn-blue btn-sm !text-white"
        onClick={() =>
          context.setIsOpenFullScreenPanel({ open: true, model: 'Thêm Sản Phẩm' })
        }
      >
        Thêm Sản Phẩm
      </Button>
    )}

    {/* --- DESKTOP: luôn hiện cả 2 nút như cũ --- */}
    {context?.windowWidth >= 992 && (
      <>
        {sortedIds?.length > 0 && (
          <Button
            variant="contained"
            className="btn-sm"
            size="small"
            color="error"
            onClick={deleteMultipleProduct}
          >
            Xóa Vĩnh Viễn
          </Button>
        )}

        <Button
          className="btn-blue btn-sm !text-white"
          onClick={() =>
            context.setIsOpenFullScreenPanel({ open: true, model: 'Thêm Sản Phẩm' })
          }
        >
          Thêm Sản Phẩm
        </Button>
      </>
    )}
  </div>
</div>



  <div className="card my-4 pt-5  shadow-md sm:rounded-lg bg-white">
          
      {/* Bộ lọc */}
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 w-full px-5 justify-between gap-4">
            
            {/* Bộ lọc danh mục chính */}
            <div className="col ">
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
              <div className="col ">
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
            
              <div className="col ">
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

          {/* <div className="col w-[20%] ml-auto">

              <SearchBox
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                />
          </div> */}
          <div className="col w-full ml-auto flex items-center">
            <div style={{ alignSelf: 'end' }} className="w-full">
              <SearchBox
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                //setPageOrder={setPageOrder}
              />
            </div>
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
                         <span className='price text-primary font-[600] text-[14px]'>{formatCurrency(product?.price)} </span>
                              <span className='oldPrice line-through leading-3 font-[500] text-gray-500 text-[14px]'> {formatCurrency(product?.oldPrice)} </span>
                             
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
      labelRowsPerPage="Hiển thị:"
        labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} / ${count} sản phẩm`
        }
      />
    
  </div>
    </>

  )
}

export default Products;
