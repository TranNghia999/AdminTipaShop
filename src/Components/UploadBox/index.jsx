import React, { useRef, useState, useContext } from "react";
import { FaRegImages } from "react-icons/fa";
import { uploadImages } from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";

const UploadBox = (props) => {

    const context = useContext(MyContext);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            const formdata = new FormData();

            for (let i = 0; i < files.length; i++) {
                if (
                    files[i] &&
                    ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files[i].type)
                ) {
                    formdata.append(props.name, files[i], files[i].name);
                  } else {
                    context.alertBox(
                        "error",
                        "Vui lòng chọn tệp JPG, PNG hoặc WEBP hợp lệ"
                    );
                    return;
                }
            }

            setUploading(true);

            uploadImages(apiEndPoint, formdata).then((res) => {
                setUploading(false);

                props.setPreviewsFun(res?.data?.images || []);

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            });

        } catch (error) {
            console.log(error);
            setUploading(false);
        }
    };

    return (
        <div className="uploadBox p-3 rounded-md overflow-hidden border border-dashed h-[150px] w-full bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
            {uploading ? (
                <>
                    <CircularProgress />
                    <h4 className="text-center">Uploading...</h4>
                </>
            ) : (
                <>
                    <FaRegImages className="text-[40px] opacity-35 pointer-events-none" />
                    <h4 className="text-[14px] pointer-events-none">Image Upload</h4>

                    <input
                        ref={fileInputRef}
                        className="absolute top-0 left-0 w-full h-full z-50 opacity-0"
                        type="file"
                        accept="image/*"
                        multiple={props.multiple}
                        name={props.name}
                        onChange={(e) => onChangeFile(e, props.url)}
                    />
                </>
            )}
        </div>
    );
};

export default UploadBox;
