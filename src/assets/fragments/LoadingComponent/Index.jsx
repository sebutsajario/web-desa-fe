import React from 'react'

const LoadingComponent = (props) => {
    const {isLoading} = props;
  return (
    <div className={`h-full w-full bg-white absolute inset-0 rounded-box ${isLoading ? 'opacity-70 z-10' : 'opacity-0 z-0'} transition-all ease-in-out duration-300`}>
        <div className='flex items-center justify-center h-full'>
            <span className="loading loading-infinity w-20"></span>
        </div>
    </div>
  )
}

export default LoadingComponent