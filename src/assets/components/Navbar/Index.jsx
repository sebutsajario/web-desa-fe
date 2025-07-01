import React from 'react'
import NavbarLogo from './Logo'
import NavItem from './Item'

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 justify-between shadow-md px-5 md:px-12 py-3 sticky top-0 z-[2000] motion-preset-slide-down-md">
        <NavbarLogo />
        <NavItem />
    </div>
  )
}

export default Navbar