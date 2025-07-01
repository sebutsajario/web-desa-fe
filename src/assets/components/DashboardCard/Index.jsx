import React from 'react'
import Paragraph from '../Paragraph';

const DashboardCard = (props) => {
    const {image, width = '', children} = props;
  return (
      <div className={`${width} py-3 px-5 gap-x-2 items-center flex relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900`}>
        {image && (
          <img className='w-12 h-fit' src={image} alt="" />
        )}
        <div className='w-full h-full flex flex-col justify-center gap-y-2 z-10'>
            {children}
        </div>
    </div>
  )
}

export default DashboardCard