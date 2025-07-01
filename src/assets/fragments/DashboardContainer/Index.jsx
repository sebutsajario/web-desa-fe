import React from 'react'

const DashboardContainer = (props) => {
    const {children} = props;
  return (
    <div className='w-full h-full flex-col md:flex-row flex flex-wrap p-10 gap-y-5 gap-x-5 relative bg-slate-200'>
      {/* <div className='h-14 w-full sticky top-0 left-0 z-20 bg-white border-b'></div> */}
      {/* <div className='flex-row flex flex-wrap p-10 gap-y-5 gap-x-5'> */}
        {children}
      {/* </div> */}
    </div>
  )
}

export default DashboardContainer