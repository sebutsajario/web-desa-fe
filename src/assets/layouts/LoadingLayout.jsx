import React from 'react'
import Paragraph from '../components/Paragraph'

const LoadingLayout = () => {
  return (
    <div className='w-screen h-screen flex flex-col gap-y-3 justify-center items-center'>
      <img className='h-2/5' src="/images/Logo-Luwu.png" alt="" />
      <Paragraph size = 'text-xl' weight = 'font-extrabold'>Website Resmi Desa Mappetajang</Paragraph>
      <Paragraph size = 'text-lg'>Sedang memuat halaman. Harap menunggu.</Paragraph>
      <span className="loading loading-dots w-20 text-black"></span>
    </div>
  )
}

export default LoadingLayout