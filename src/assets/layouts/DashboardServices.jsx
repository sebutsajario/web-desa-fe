import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index';
import Paragraph from '../components/Paragraph';
import Table from '../components/Table/Index';
import TableData from '../components/Table/TableData';
import Pagination from '../components/Pagination/Index';
import axios from 'axios';
import { dateConvert } from '../utilities/dateConvert';
import { Auth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal/Index';
import LoadingComponent from '../fragments/LoadingComponent/Index';
import DataFilter from '../fragments/DataFilter/Index';
import NoData from '../fragments/NoData/Index';

const DashboardServices = () => {
    const [requestList, setRequestList] = useState([]);
    const {user} = useContext(Auth);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc');
    const [totalPage, setTotalPage] = useState(0);
    const [formData, setFormData] = useState({});
    const [perPage, setPerPage] = useState(5);
    const initialValue = {service: "", date: "", status: 0};

    const apiUrl = import.meta.env.VITE_API_URL;

    const requestStatus = [
        {
            index: 1,
            status: 'Belum diproses',
        },
        {
            index: 2,
            status: 'Diproses',
        },
        {
            index: 3,
            status: 'Selesai',
        },
    ]
    // console.log(user)
    // const requestList = [
    //     {
    //         name: 'Nama Penduduk 1',
    //         service: 'Jenis Layanan 1',
    //         date: '1 April 2025',
    //     },
    //     {
    //         name: 'Nama Penduduk 2',
    //         service: 'Jenis Layanan 2',
    //         date: '1 April 2025',
    //     },
    //     {
    //         name: 'Nama Penduduk 3',
    //         service: 'Jenis Layanan 3',
    //         date: '1 April 2025',
    //     },
    //     {
    //         name: 'Nama Penduduk 4',
    //         service: 'Jenis Layanan 4',
    //         date: '1 April 2025',
    //     },
        
    // ];

    const loadData = () => {
        setIsLoading(true);
        axios.get(`${apiUrl}/v1/reqservice/getdata?page=${currentPage}&perPage=${perPage}&sortOrder=${sortOrder}`, {withCredentials:true})
            .then(res => {
                const data = res.data.data;
                const total = res.data.totalPage;
                setRequestList(data);
                setTotalPage(total);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false);
                setFormData(initialValue);
            })
    };

    useEffect(() => {
        loadData();
    }, [currentPage, perPage, sortOrder]);

    const handleChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        setFormData({ ...formData, [id]: value });
    };

    const selectDelete = (req) => {
        setSelectedRequest(req);
        return document.getElementById('my_modal_2').showModal();
    }

    const handleDeleteRequest = () => {
        axios.delete(`${apiUrl}/v1/reqservice/delete/${selectedRequest._id}?user=${user.id}`)
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
            .finally(() => {
                loadData();
                document.getElementById('my_modal_2').close()
            });
    };

    const handleChangePage = (p) => {
        if(!p) {
            return;
        };
        if(p == 'prev') {
            setCurrentPage(currentPage - 1);
        } else {
            setCurrentPage(currentPage + 1);
        };
    };

    const handleResetForm = () => {
        setFormData(initialValue);
        loadData();
    };

    const handleSearch = () => {
        const service = formData.service || '';
        const date = formData.date || '';
        const status =  formData.status || '';
        setIsLoading(true);
        axios.get(`${apiUrl}/v1/reqservice/getdata?page=${currentPage}&perPage=${perPage}&service=${service}&date=${date}&status=${status}`, {withCredentials:true})
            .then(res => {
                const data = res.data.data;
                const total = res.data.totalPage;
                setRequestList(data);
                setTotalPage(total);
            })
            .catch(err => {
                console.log(err)
                if(err.response.status == 404) {
                    setRequestList([]);
                }
            })
            .finally(() => {
                setIsLoading(false);
        })
    };

    const handlePerPage = (e) => {
        const value = e.target.value;
        setPerPage(value);
    };

    const handleSortOrder = (e) => {
        const value = e.target.value;
        setSortOrder(value);
    };

  return (
    <>
        <DashboardSection width = 'w-full'>
            <Modal>
                <div className='flex flex-col gap-y-3'>
                    <Paragraph>Anda akan menghapus permohonan <span className='font-bold'>{selectedRequest?.service}</span> dari <span className='font-bold'>{selectedRequest?.villagerData?.name}</span>?</Paragraph>
                    <div className='flex flex-row gap-x-2 self-end'>
                    <button onClick={()=>handleDeleteRequest()} className="btn bg-red-600 hover:bg-red-700 text-white border-[#e5e5e5] w-fit">Ya</button>
                    <div className="modal-action mt-0">
                        <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn bg-slate-300 hover:bg-slate-400 text-slate-800 border-[#e5e5e5] w-fit">Kembali</button>
                        {/* <button className="btn">Close</button> */}
                        </form>
                    </div>
                    </div>
                </div>
            </Modal>
            <Paragraph size = 'text-lg' weight = 'font-bold'>Permintaan Layanan Masuk</Paragraph>
            <Paragraph>Permintaan Layanan Masuk</Paragraph>
            <DataFilter onHandleReset = {handleResetForm} onHandleSearch = {handleSearch} onHandlePerPage = {handlePerPage} onHandleSort = {handleSortOrder}>
                <div className='flex flex-col gap-y-1 w-full md:flex-auto'>
                    <label htmlFor="service"><Paragraph weight = 'font-medium'>Jenis Permohonan:</Paragraph></label>
                    <select id='service' onChange={handleChange} defaultValue="" value={formData.service} className="select w-full">
                        <option value="" disabled={true}>Pilih Layanan</option>
                        <option>Surat Keterangan Domisili</option>
                        <option>Surat Keterangan Tidak Mampu</option>
                        <option>Surat Perjanjian Jual Beli</option>
                        <option>Surat Keterangan Wali</option>
                        <option>Surat Keterangan Pernah Bekerja</option>
                        <option>Surat Keterangan Menikah</option>
                        <option>Surat Keterangan Kematian</option>
                        <option>Surat Keterangan Kelahiran</option>
                        <option>Surat Pengantar Izin Keramaian</option>
                        <option>Surat Pengantar SKCK</option>
                        <option>Surat Permohonan Pembuatan Kartu Keluarga</option>
                        <option>Surat Lainnya</option>
                    </select>
                </div>
                <div className='flex flex-col gap-y-1 w-full'>
                    <label htmlFor="date"><Paragraph weight = 'font-medium'>Tanggal Permohonan:</Paragraph></label>
                    <input id='date' onChange={handleChange} value={formData.date} type='date' placeholder="Masukkan Nama" className="input input-neutral w-full" />
                </div>
                <div className='flex flex-col gap-y-1 w-full'>
                    <label htmlFor="status"><Paragraph weight = 'font-medium'>Status:</Paragraph></label>
                    <select onChange={handleChange} id='status' value={formData.status} defaultValue={0} className="select w-full">
                        <option disabled={true} value={0}>Status</option>
                        {requestStatus.map(item => (
                            <option key={item.index} value={item.index}>{item.status}</option>
                        ))}
                    </select>
                </div>
            </DataFilter>
            <div className='relative'>
                <LoadingComponent isLoading = {isLoading} />
                <Table tableHead = {['Nama', 'Permohonan Layanan', 'Tanggal Permohonan', 'Status', 'Aksi']}>
                {requestList.length > 0 ? requestList.map((item, i) => {
                    const date = dateConvert(item.updatedAt)
                    const status = requestStatus.find(reqStatus => reqStatus.index == item.status)
                    return (
                    <tr key={i}>
                        <th><Paragraph weight = 'font-medium' size = 'text-xs'>{i + 1}</Paragraph></th>
                        <TableData><Paragraph size = 'text-xs'>{item.villagerData?.name}</Paragraph></TableData>
                        <TableData><Paragraph size = 'text-xs'>{item.service}</Paragraph></TableData>
                        <TableData><Paragraph size = 'text-xs'>{date}</Paragraph></TableData>
                        <TableData>
                            <div className={`px-2 py-1 rounded-sm w-fit h-fit ${item.status == 1 ? 'bg-red-800' : item.status == 2 ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                                <Paragraph size = 'text-xs' color = 'text-white'>{status.status}</Paragraph>
                            </div>
                        </TableData>
                        <TableData>
                            <div className='flex flex-col gap-y-1'>
                                <Link to={item._id}>
                                    <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer' weight ='font-normal'>Lihat</Paragraph>
                                </Link>
                                <div onClick={()=> selectDelete(item)}>
                                    <Paragraph size = 'text-xs' color = 'text-red-600' otherClass = 'underline cursor-pointer'>Hapus</Paragraph>
                                </div>
                            </div>
                        </TableData>
                    </tr>
                )
                }) : <tr><td colSpan={6} className={`p-0 border-none leading-[0] bg-base-100`}><NoData /></td></tr>}
                </Table>
            </div>
            <Pagination totalPage = {totalPage} currentPage = {currentPage} onChangePage = {handleChangePage}/>
        </DashboardSection>
    </>
  )
}

export default DashboardServices