import React from 'react'

const DashboardSection = (props) => {
    const {children, width = 'w-fit', height = 'h-fit'} = props;
  return (
    <div className={`flex flex-col px-5 py-3 gap-y-2 bg-white rounded-md shadow-lg ${width} ${height}`}>{children}</div>
  )
}

export default DashboardSection