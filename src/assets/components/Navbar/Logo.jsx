import React from 'react'
import { Link } from 'react-router-dom'

const NavbarLogo = () => {
  return (
    <>
      <Link to='/' style={{display:'contents'}}>
        <div className="flex flex-row gap-x-2 items-center md:justify-start justify-center cursor-pointer">
          <img className='w-8' src="/images/Logo-Luwu.png" alt="" />
          <div className='flex flex-col md:flex-row gap-x-2 flex-wrap'>
            <div className="text-base md:text-xl font-roboto font-light">Portal Resmi</div>
            <div className="text-xl font-roboto font-bold">Desa Mappetajang</div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default NavbarLogo