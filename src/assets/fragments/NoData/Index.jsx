import React from 'react'
import Paragraph from '../../components/Paragraph'

const NoData = () => {
  return (
    <div className='w-full flex items-center justify-center p-10 flex-col gap-y-2'>
        <img className='w-40 h-40' src="/images/no-data.svg" alt="" />
        <Paragraph>Data tidak ditemukan</Paragraph>
    </div>
  )
}

export default NoData