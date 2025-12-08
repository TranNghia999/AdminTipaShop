import React from "react";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { MyContext } from "../../App";
// Icon
import { FaAngleDown } from "react-icons/fa6";
import { useState } from "react";
import EditSubCatBox from "./EditSubCatBox";


const SubCategoryList = () => {
  // Hàm kết nối
  const context = useContext(MyContext);

  const [isOpen, setIsOpen] = useState(0)

  const expend = (index) => {
    if (isOpen === index) {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(index);
    }
  }
 
  return (
    <>
     
      <div className="flex items-center justify-between px-5 py-5">
          <h2 className="text-[18px] font-[600]">
           Danh Sách Phụ
          </h2>

          <div className="col w-[30%] ml-auto flex items-center justify-end gap-3">
            <Button className="btn-blue btn-sm !text-white"
              onClick={() =>  context.setIsOpenFullScreenPanel({  open: true,
                                                                  model: "Thêm Danh Mục Phụ",
                                                                })
                                                              } >
              Thêm Danh Mục Phụ
            </Button>
          </div>
      </div>

    <div className="card my-4 pt-5 pb-5 px-5 shadow-md sm:rounded-lg bg-white">
    {
      context?.catData?.length !== 0 &&
        <ul className='w-full'>
          {
            context?.catData?.map((firstLavelCat, index) => {
              return(
                <li className="w-full mb-1" key={index}>
                    <div className='flex items-center w-full p-2 bg-[#f1f1f1] rounded-sm px-4'>
                          <span className='font-[500] flex items-center gap-4 text-[14px]'>
                            {firstLavelCat?.name}
                          </span>

                          <Button className="!min-w-[35px] !w-[35px] !h- [35px] !rounded-full !text-black !ml-auto"
                                  onClick = {() => expend(index)} >
                              <FaAngleDown/>
                          </Button>
                    </div>
                          {/* Các thành phần con hiển thị ở đây */}
                      {
                        isOpen === index &&
                        <>
                            {firstLavelCat?.children?.length !== 0 &&
                                <ul className="w-full">
                                    {firstLavelCat?.children?.map((subCat, index_)=> {
                                        return(
                                          <li className='w-full py-1' key={index_}>

                                            <EditSubCatBox  name={subCat?.name} 
                                                            id={subCat?._id} 
                                                            catData={context?.catData} 
                                                            index={index_} 
                                                            selectedCat={subCat?.parentId}
                                                            selectedCatName={subCat?.parentCatName}
                                                           />
                                                {/* Thư mục con của thư mục con */}
                                            {
                                              subCat?.children?.length !== 0 &&
                                                 <ul className="pl-4">
                                                        {
                                                            subCat?.children?.map((thirdLevel, index_) => {
                                                                  return (
                                                                  <li className="w-full hover:bg-[#f1f1f1]"
                                                                      key={index_} >
                                                                        <EditSubCatBox
                                                                            name={thirdLevel?.name}
                                                                            catData={firstLavelCat?.children}
                                                                            index={index_}
                                                                            selectedCat={thirdLevel?.parentId}
                                                                            selectedCatName={thirdLevel?.parentCatName}
                                                                            id={thirdLevel?._id} />
                                                                  </li>
                                                            )
                                                          })
                                                        }
                                                 </ul>
                                            }
                                          </li>

                                              )
                                      })
                                    }

                                </ul>
                            
                            }
                        </>
                      }

                </li>
              )
            })
          }
        </ul>
    }
    </div>

       
    </>
  );
};

export default SubCategoryList;
