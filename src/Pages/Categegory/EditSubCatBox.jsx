import React from 'react'
// Icon
import CircularProgress from '@mui/material/CircularProgress';
import { MdOutlineModeEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { useContext } from 'react';
import { MyContext } from '../../App';
import { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useEffect } from 'react';
import { deleteData, editData } from '../../utils/api';


const EditSubCatBox = (props) => {

    // Hàm kết nối
  const context = useContext(MyContext);

  const [isLoading, setIsLoading] = useState(false);
    // Biểu mẫu
    const [formFields, setFormFields] = useState({
        name: "",
        parentCatName: null,
        parentId: null
    })

     const [selectVal, setSelectVal] = useState('');

    const handleChange = (event) => {
        setSelectVal(event.target.value);
        formFields.parentId = event.target.value;
    };

    const onChangeInput = (e) => {
        const { name, value } = e.target;

        const catId = selectVal
        setSelectVal(catId);

        setFormFields(() => {
            return {
            ...formFields,
            [name]: value
            }
        })
    }

    // Code chỉnh sửa
    const [editMode, setEditMode] = useState(false);

   
    useEffect(() => {
        formFields.name = props?.name;
        formFields.parentCatName = props?.selectedCatName;
        formFields.parentId = props?.selectedCat;
        setSelectVal(props?.selectedCat)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (formFields.name === "") {
            context.alertBox("error", "Please enter category name");
            return false
        }

        editData(`/api/category/${props?.id}`, formFields).then((res) => {
            setTimeout(() => {
                context.alertBox("success", res?.data?.message || "Cập nhật thành công!");
                context?.getCat();
                setIsLoading(false);
            }, 1000);
        });
    }

    // Hàm Xóa
    const deleteCat = (id) => {
        deleteData(`/api/category/${id}`).then((res) => {
            context?.getCat();
        })
        }
  

  return (
    <form className="w-full flex items-center gap-3 p-0 px-4"  onSubmit={handleSubmit}>
           
            {
                editMode === true &&
                <>
                <div className="flex items-center justify-between py-2 gap-4">
                    <div className="w-[150px]">
                        <Select className="w-full"
                                style={{ zoom: '75%' }}
                                size="small"
                                value={selectVal}
                                onChange={handleChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }} >

                                {
                                    props?.catData?.length !== 0 && props?.catData?.map((item, index) => {
                                        return (
                                            <MenuItem value={item?._id} key={index} 
                                                    onClick={() => { formFields.parentCatName = item?.name }}>
                                                        {item?.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                    </div>
                            <input  type="text" className='w-full h-[30px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                                    name="name" 
                                    value={formFields?.name} 
                                    onChange={onChangeInput} />

                                <div className="flex items-center gap-2">
                                    <Button size="small" className="btn-sml" type="submit" variant="contained">
                                        {
                                        isLoading === true ? <CircularProgress color="inherit" /> :
                                        <>
                                            Edit
                                        </>
                                        }
                                    </Button>
                                    <Button size="small" variant="outlined" 
                                            onClick={() => setEditMode(false)}>Cancel

                                    </Button>
                                </div>
                </div>
                </>
            }

            {
                editMode === false &&
                <>
                    <span className="font-[500] text-[14px]">{props?.name}</span>
                <div className="flex items-center ml-auto gap-2">
                    <Button className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black "
                            onClick={() => {
                                    setEditMode(true);
                                    }}>
                        <MdOutlineModeEdit />
                    </Button>

                    <Button className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black "
                            onClick={() => deleteCat(props?.id)}>
                        <FaRegTrashAlt />
                    </Button>
                </div>

                </>
            }
        
    
    </form>
  )
}

export default EditSubCatBox
