import React from 'react'
import Paragraph from '../Paragraph'
import Header from '../Header'

const ProfileCard = (props) => {
    const {isLast, data} = props;
  return (
    <>
        <div className='flex flex-col md:flex-row items-center gap-y-3 md:gap-y-0 gap-x-3 md:gap-x-5 py-2'>
            <div className="avatar">
                <div className="w-48 rounded">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
            </div>
            <div className='flex flex-col items-center md:items-start'>
                <Header size = 'text-2xl'>{data.name}</Header>
                <Paragraph size = 'text-lg'>{data.role}</Paragraph>
            </div>
        </div>
        {!isLast ? (
            <div className='divider'></div>
        ) : <></>}
    </>
  )
}

export default ProfileCard