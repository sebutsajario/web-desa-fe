import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index';
import Paragraph from '../components/Paragraph';
import Table from '../components/Table/Index';
import TableData from '../components/Table/TableData';
import Pagination from '../components/Pagination/Index';
import axios from 'axios';
import NoData from '../fragments/NoData/Index';
import { dateConvert } from '../utilities/dateConvert';
import DataFilter from '../fragments/DataFilter/Index';
import LoadingComponent from '../fragments/LoadingComponent/Index';
import Modal from '../components/Modal/Index';
import { Auth } from '../../contexts/AuthContext';
import { Toast } from '../../contexts/ToastContext';

const DashboardComplaints = () => {
    const [complaintsList, setComplaintsList] = useState([]);
    const [formData, setFormData] = useState({});
    const [perPage, setPerPage] = useState(5);
    const [totalPage, setTotalPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedComplaint, setSelectedComplaint] = useState({});
    const [complaintAction, setComplaintAction] = useState(null);
    const {user} = useContext(Auth);
    const {showToast} = useContext(Toast)
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleChangeForm = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        setFormData(prev => ({...prev, [id]: value}));
    };

    const loadData = () => {
        setIsLoading(true);
        axios.get(`${apiUrl}/v1/complaint/getdata?page=${currentPage}&perPage=${perPage}&sortOrder=${sortOrder}`, {withCredentials: true})
            .then(res => {
                const data = res.data.data;
                const total = res.data.totalPage;
                setComplaintsList(data);
                setTotalPage(total)
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSearch = () => {
        const name = formData.name || '';
        const date = formData.date || '';
        setIsLoading(true);
        axios.get(`${apiUrl}/v1/complaint/getdata?name=${name}&date=${date}&sortOrder=${sortOrder}`, {withCredentials: true})
            .then(res => {
                const data = res.data.data;
                const total = res.data.totalPage;
                console.log(res)
                setComplaintsList(data);
                setTotalPage(total)
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleResetForm = () => {
        setFormData({});
        loadData();
    };

    const handlePerPage = (e) => {
        const num = e.target.value;
        setPerPage(num);
        setCurrentPage(1);
    };

    const handleSortOrder = (e) => {
        const value = e.target.value;
        setSortOrder(value);
    };

    const handleChangePage = (p) => {
        if(p == 'prev') {
            setCurrentPage(currentPage -1);
        } else {
            setCurrentPage(currentPage + 1);
        };
    };

    const selectDelete = (c) => {
        setComplaintAction('delete');
        setSelectedComplaint(c);
        return document.getElementById('my_modal_2').showModal();
    };

    const selectShow = (c) => {
        setComplaintAction('show');
        setSelectedComplaint(c);
        return document.getElementById('my_modal_2').showModal();
    }

    const handleDeleteComplaint = () => {
        axios.delete(`${apiUrl}/v1/complaint/delete/${selectedComplaint._id}?user=${user.id}`, {withCredentials: true})
            .then(res => {
                console.log(res);
                showToast(res.data.message, 'success');
                setSelectedComplaint({});
                setComplaintAction(null);
                loadData();
                return document.getElementById('my_modal_2').close();
            })
            .catch(err => {
                console.log(err);
                showToast('Gagal menghapus keluhan', 'failed');
            })
    }

    useEffect(() => {
        loadData();
    }, [perPage, currentPage, sortOrder]);
  return (
    <>
        <DashboardSection width = 'w-full'>
            <Paragraph size = 'text-lg' weight = 'font-bold'>Keluhan Masuk</Paragraph>
            <Paragraph>Keluhan Masyarakat Masuk</Paragraph>
            <Modal>
                {complaintAction == 'delete' ? (
                    <div className='flex flex-col gap-y-3'>
                        <Paragraph>Anda akan menghapus keluhan dari <span className='font-bold'>{selectedComplaint?.villagerData?.name}</span>?</Paragraph>
                        <div className='flex flex-row gap-x-2 self-end'>
                        <button onClick={handleDeleteComplaint} className="btn bg-red-600 hover:bg-red-700 text-white border-[#e5e5e5] w-fit">Ya</button>
                        <div className="modal-action mt-0">
                            <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn bg-slate-300 hover:bg-slate-400 text-black border-[#e5e5e5] w-fit">Kembali</button>
                            {/* <button className="btn">Close</button> */}
                            </form>
                        </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col gap-y-3'>
                        <Paragraph weight = 'font-semibold'>Detail Keluhan:</Paragraph>
                        <div className="flex flex-row gap-x-2">
                            <Paragraph size = 'text-xs md:text-sm' weight = 'font-semibold'>Nama</Paragraph>
                            <Paragraph size = 'text-xs md:text-sm'>:</Paragraph>
                            <Paragraph size = 'text-xs md:text-sm'>{selectedComplaint?.villagerData?.name}</Paragraph>
                        </div>
                        <div className="flex flex-row gap-x-2">
                            <Paragraph size = 'text-xs md:text-sm' weight = 'font-semibold'>Alamat</Paragraph>
                            <Paragraph size = 'text-xs md:text-sm'>:</Paragraph>
                            <Paragraph size = 'text-xs md:text-sm'>{selectedComplaint?.villagerData?.address}</Paragraph>
                        </div>
                        <div className="flex flex-row gap-x-2">
                            <Paragraph size = 'text-xs md:text-sm' weight = 'font-semibold'>Jenis Kelamin</Paragraph>
                            <Paragraph size = 'text-xs md:text-sm'>:</Paragraph>
                            <Paragraph size = 'text-xs md:text-sm'>{selectedComplaint?.villagerData?.gender}</Paragraph>
                        </div>
                        <div className="flex flex-row gap-x-2">
                            <Paragraph size = 'text-xs md:text-sm' weight = 'font-semibold'>Nomor Handphone</Paragraph>
                            <Paragraph size = 'text-xs md:text-sm'>:</Paragraph>
                            <Paragraph size = 'text-xs md:text-sm'>{selectedComplaint?.villagerData?.phone}</Paragraph>
                        </div>
                        <div className="flex flex-row gap-x-2">
                            <Paragraph size = 'text-xs md:text-sm' weight = 'font-semibold'>Keluhan</Paragraph>
                            <Paragraph size = 'text-xs md:text-sm'>:</Paragraph>
                            <Paragraph size = 'text-xs md:text-sm'>{selectedComplaint?.note}</Paragraph>
                        </div>
                        <div className="modal-action mt-0">
                            <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn bg-slate-300 hover:bg-slate-400 text-slate-800 border-[#e5e5e5] w-fit">Kembali</button>
                            {/* <button className="btn">Close</button> */}
                            </form>
                        </div>
                    </div>
                )}
            </Modal>
            <DataFilter onHandleSearch = {handleSearch} onHandleReset = {handleResetForm} onHandlePerPage = {handlePerPage} onHandleSort = {handleSortOrder}>
                <div className='flex flex-col flex-grow gap-y-1 w-full'>
                    <label htmlFor="name"><Paragraph weight = 'font-medium'>Nama:</Paragraph></label>
                    <input value={formData.name || ""} onChange={handleChangeForm} id='name' type='text'placeholder="Masukkan Nama" className="input input-neutral" />
                </div>
                <div className='flex flex-col flex-grow gap-y-1 w-full'>
                    <label htmlFor="date"><Paragraph weight = 'font-medium'>Tanggal Permohonan:</Paragraph></label>
                    <input value={formData.date || ""} onChange={handleChangeForm} id='date' type='date' placeholder="Masukkan Nama" className="input input-neutral" />
                </div>
            </DataFilter>
            <div className='relative'>
                <LoadingComponent isLoading = {isLoading} />
            </div>
            <Table tableHead = {['Nama', 'Alamat', 'Tanggal Keluhan', 'Aksi']}>
                {complaintsList.length ? complaintsList.map((item, i) => {
                    const date = dateConvert(item.updatedAt);
                    return (
                        <tr key={i}>
                            <th><Paragraph weight = 'font-medium' size = 'text-xs'>{i + 1}</Paragraph></th>
                            <TableData><Paragraph size = 'text-xs'>{item?.villagerData?.name}</Paragraph></TableData>
                            <TableData><Paragraph size = 'text-xs' otherClass='line-clamp-1'>{item?.villagerData?.address}</Paragraph></TableData>
                            <TableData><Paragraph size = 'text-xs'>{date}</Paragraph></TableData>
                            <TableData>
                            <div className='flex flex-col gap-y-1'>
                                <div onClick={()=> selectShow(item)}>
                                    <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer' weight ='font-normal'>Lihat</Paragraph>
                                </div>
                                <div onClick={()=> selectDelete(item)}>
                                    <Paragraph size = 'text-xs' color = 'text-red-600' otherClass = 'underline cursor-pointer'>Hapus</Paragraph>
                                </div>
                            </div>
                        </TableData>
                        </tr>
                    )
                }
                ) : <tr><td colSpan={4} className={`p-0 border-none leading-[0] bg-base-100`}><NoData /></td></tr>}
            </Table>
            <Pagination totalPage = {totalPage} currentPage = {currentPage} onChangePage = {handleChangePage} />
        </DashboardSection>
    </>
  )
}

export default DashboardComplaints