import React from 'react'
import { Link } from 'react-router-dom';

const NavItem = () => {
    const navItem = [
        {
            item: "Profil Desa",
            link: "/profile",
        },
        {
            item: "Pemerintah Desa",
            link: "/organization",
        },
        {
            item: "Berita",
            link: "/news",
        },
        {
            item: "Layanan",
            link: "/services",
        },
        {
            item: "Peta Desa",
            link: "/map",
        },
    ];
  return (
    <div className="flex-none">
        <div className="dropdown dropdown-end  md:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost rounded-field">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
            </div>
            <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm">
                {navItem.length && navItem.map((item, index) => (
                    <li key={index}><Link to = {item.link}>{item.item}</Link></li>
                ))}
            </ul>
        </div>
        <ul className="menu menu-horizontal bg-base-200 md:flex hidden">
            {navItem.length && navItem.map((item, index) => (
                <li key={index}><Link to = {item.link}>{item.item}</Link></li>
            ))}
        </ul>
    </div>
  )
}

export default NavItem;