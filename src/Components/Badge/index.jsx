import React from 'react'


// code Xử lý đơn hàng
const Badge = ({ status }) => {
  let badgeClass = "bg-yellow-400 text-black";

  if (status === "Huỷ") {
    badgeClass = "bg-[#ff5252] text-white";
  } else if (
    status === "Đã Giao Hàng Toàn Bộ" 
  ) {
    badgeClass = "bg-green-600 text-white";
  }

  return (
    <span className={`inline-block py-1 px-4 rounded-full text-[11px] capitalize font-semibold ${badgeClass}`}>
      {status || "Đang xử lý"}
    </span>
  );
};

export default Badge;