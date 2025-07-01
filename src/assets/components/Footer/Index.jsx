import React, { useEffect, useState } from 'react'
import Paragraph from '../Paragraph'
import axios from 'axios';

const Footer = () => {
  const [footerData, setFooterData] = useState({phone: '', address: ''});
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    axios.get(`${apiUrl}/v1/asset/get/portal-asset`)
      .then(res => {
        const data = res.data.data;
        setFooterData({phone: data.phone, address: data.address});
      })
  }, []);
  return (
    <footer className="footer footer-horizontal footer-center bg-base-content text-white p-10">
        <aside className='gap-y-1'>
            <img className='w-20' src="/images/Logo-Luwu.png" alt="" />
            <p className="font-bold">
            Portal Resmi
            <br />
            Desa Mappetajang
            </p>
            <Paragraph color = 'text-white' weight = 'font-bold'>{footerData.address}</Paragraph>
            <Paragraph color = 'text-white' weight = 'font-bold'>{footerData.phone}</Paragraph>
            <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
    </footer>
  )
}

export default Footer