import React from 'react'


// code Xử lý đơn hàng
const Badge = (props) => {
  return (
    <span className={`inline-block py-1 px-4 rounded-full text-[11px] capitalize
        ${props.status === "pending" && "bg-[#ff5252] text-white"}
        ${props.status === "confirm" && "bg-green-500 text-white"}
        ${props.status === "delivered" && "bg-green-700 text-white"}`}> {props.status}
    </span>
  )
}

export default Badge;
