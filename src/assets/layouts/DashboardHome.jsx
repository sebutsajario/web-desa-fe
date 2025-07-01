import React, { useEffect, useState } from 'react'
import DashboardCard from '../components/DashboardCard/Index';
import Paragraph from '../components/Paragraph';
import DashboardSection from '../components/DashboardSection/Index';
import Table from '../components/Table/Index';
import TableData from '../components/Table/TableData';
import axios from 'axios';
import { dateConvert } from '../utilities/dateConvert';
import { Link } from 'react-router-dom';
import NoData from '../fragments/NoData/Index';

const DashboardHome = () => {
    const [articleList, setArticleList] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [complaintList, setComplaintList] = useState([]);
    const [unprocessedRequest,setUnprocessedRequest] = useState(0);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/v1/reqservice/getdata`, {withCredentials: true})
            .then(res => {
                const data = res.data.data;
                const unprocessed = data.filter(item => item.status === 1);

                setUnprocessedRequest(unprocessed.length); 
                setRequestList(data);
            })
            .catch(err => console.log(err));
        axios.get(`${apiUrl}/v1/complaint/getdata`, {withCredentials: true})
            .then(res => {
                const data = res.data.data;
                setComplaintList(data);
            })
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        axios.get(`${apiUrl}/v1/post/posts`)
            .then(res => {
                const data = res.data.data;
                setArticleList(data);
            })
            .catch(err => console.log(err))
    }, []);

    return (
    <>
        <DashboardCard width = 'w-full md:w-2/3' image = '/images/Logo-Luwu.png'>
            <Paragraph weight = 'font-semibold' size = 'text-md md:text-xl' color = 'text-white'>Selamat Datang di Portal Desa</Paragraph>
            <Paragraph size = 'text-[11px] md:text-xs' color = 'text-white'>Portal ini dirancang untuk menyediakan wadah digital yang memudahkan masyarakat dalam mengakses informasi terkait desa, mengajukan permintaan layanan, serta menyampaikan keluhan secara langsung kepada pemerintah desa.</Paragraph>
        </DashboardCard>
        <DashboardCard width = 'w-full md:flex-1'>
            <Paragraph weight = 'font-semibold' size = 'text-md md:text-xl' color = 'text-white'>Statistik Hari Ini</Paragraph>
            <Paragraph size = 'text-[11px] md:text-xs' color = 'text-white'>{unprocessedRequest} Permintaan Layanan Belum Diproses</Paragraph>
            <Paragraph size = 'text-[11px] md:text-xs' color = 'text-white'>3 Keluhan Masyarakat Baru</Paragraph>
        </DashboardCard>
        <div className='flex flex-col w-full md:w-2/3 gap-y-5'>
            <DashboardSection width = 'w-full'>
                <div className='flex flex-row justify-between items-end'>
                    <div className='flex flex-col gap-y-2'>
                        <Paragraph size = 'text-base md:text-lg' weight = 'font-bold'>Permintaan Layanan Masuk</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>Permintaan Layanan Masuk</Paragraph>
                    </div>
                    <Link to='services'>
                        <Paragraph size = 'text-[11px] md:text-xs' otherClass = 'px-3 self-end underline'>Selengkapnya</Paragraph>
                    </Link>
                </div>
                <Table tableHead = {['Nama', 'Permohonan Layanan', 'Tanggal Permohonan']}>
                {requestList.length ? requestList.map((item, i) => {
                        const date = dateConvert(item.updatedAt);
                        return (
                            <tr key={i}>
                                <th><Paragraph weight = 'font-medium' size = 'text-[11px] md:text-xs'>{i + 1}</Paragraph></th>
                                <TableData><Paragraph size = 'text-[11px] md:text-xs'>{item?.villagerData?.name}</Paragraph></TableData>
                                <TableData><Paragraph size = 'text-[11px] md:text-xs'>{item.service}</Paragraph></TableData>
                                <TableData><Paragraph size = 'text-[11px] md:text-xs'>{date}</Paragraph></TableData>
                            </tr>
                        )

                    }
                    
                    ) : <tr><td colSpan={4} className={`p-0 border-none leading-[0] bg-base-100`}><NoData /></td></tr>}
                </Table>
            </DashboardSection>
            <DashboardSection width = 'w-full'>
                <div className='flex flex-row justify-between items-end'>
                    <div className='flex flex-col gap-y-2'>
                        <Paragraph size = 'text-base md:text-lg' weight = 'font-bold'>Keluhan Masuk</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>Keluhan Masyarakat Masuk</Paragraph>
                    </div>
                    <Link to='complaints'>
                        <Paragraph size = 'text-[11px] sm:text-xs' otherClass = 'px-3 self-end underline'>Selengkapnya</Paragraph>
                    </Link>
                </div>
                <Table tableHead = {['Nama', 'Alamat', 'Tanggal Keluhan']}>
                    {complaintList.length ? complaintList.map((item, i) => {
                        const date = dateConvert(item.updatedAt);
                        return (
                            <tr key={i}>
                                <th><Paragraph weight = 'font-medium' size = 'text-[11px] md:text-xs'>{i + 1}</Paragraph></th>
                                <TableData><Paragraph size = 'text-[11px] md:text-xs'>{item?.villagerData?.name}</Paragraph></TableData>
                                <TableData><Paragraph size = 'text-[11px] md:text-xs' otherClass ='line-clamp-1'>{item?.villagerData?.address}</Paragraph></TableData>
                                <TableData><Paragraph size = 'text-[11px] md:text-xs'>{date}</Paragraph></TableData>
                            </tr>
                        )
                    }
                    ) : <tr><td colSpan={4} className={`p-0 border-none leading-[0] bg-base-100`}><NoData /></td></tr>}
                </Table>
            </DashboardSection>
        </div>
        <DashboardSection width = 'flex-1' height = 'h-fit'>
            <Paragraph size = 'text-base md:text-lg' weight = 'font-bold'>Berita Terakhir</Paragraph>
            {articleList.length && articleList.map((item, i) => (
                <div key={i} className='flex flex-row gap-x-5 md:gap-x-2 max-w-xs'>
                    <img className='w-12 h-12 object-cover' src={`${apiUrl}/${item.image}`} alt="" />
                    <div className='flex flex-col gap-x-1'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>{item.title}</Paragraph>
                        <Paragraph size = 'text-[11px] md:text-xs' otherClass = 'line-clamp-2 bg-blue-500 w-fit px-2 py-1 rounded-md mt-1' color = 'text-white' weight = 'font-medium'>{item.author}</Paragraph>
                    </div>
                </div>
            ))}
            <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer md:self-end'>Tambahkan Berita</Paragraph>
        </DashboardSection>
    </>
  )
}

export default DashboardHome