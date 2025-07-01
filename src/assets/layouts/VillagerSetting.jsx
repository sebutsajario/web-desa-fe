import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import Table from '../components/Table/Index';
import TableData from '../components/Table/TableData';
import Pagination from '../components/Pagination/Index';
import axios from 'axios';
import LoadingComponent from '../fragments/LoadingComponent/Index';
import DataFilter from '../fragments/DataFilter/Index';
import NoData from '../fragments/NoData/Index';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal/Index';
import { Toast } from '../../contexts/ToastContext';

const VillagerSetting = () => {
    const [formData, setFormData] = useState({});
    const [villagerData, setVillagerData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [perPage, setPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedDelete, setSelectedDelete] = useState({});
    const {showToast} = useContext(Toast);
    const apiUrl = import.meta.env.VITE_API_URL;

    const initialForm = {uid: '', name: ''};

    const handleChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        setFormData({ ...formData, [id]: value });
    };
    
    const handleSearch = () => {
        const uid = formData.uid || '';
        const name = formData.name || '';
        const address = formData.village || '';
        axios.get(`${apiUrl}/v1/villager/getdata?page=${currentPage}&perPage=${perPage}&uid=${uid}&name=${name}&address=${address}&sortOrder=${sortOrder}`)
            .then(res => {
                const data = res.data.data;
                setVillagerData(data);
                setTotalPage(res.data.totalPage);
            })
            .catch(err => {
                console.log(err);
                if(err.response.status == 404) {
                    setVillagerData({});
                }
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    const handleChangePage = (p) => {
        const uid = formData.uid || '';
        const name = formData.name || '';
        const address = formData.village || '';
        const nextPage = p == 'prev' ? currentPage - 1 : currentPage + 1;
        setIsLoading(true);
        axios.get(`${apiUrl}/v1/villager/getdata?page=${nextPage}&perPage=${perPage}&uid=${uid}&name=${name}&address=${address}&sortOrder=${sortOrder}`)
            .then(res => {
                const data = res.data.data;
                setVillagerData(data);
                setTotalPage(res.data.totalPage);
            })
            .catch(err => console.log(err))
            .finally(() => {
                if (p == 'prev') {
                    setCurrentPage(nextPage);
                } else {
                    setCurrentPage(nextPage);
                };
                setIsLoading(false);
            });
    }

    const loadVillagerData = () => {
        setIsLoading(true)
        axios.get(`${apiUrl}/v1/villager/getdata?perPage=${perPage}&page=${currentPage}&sortOrder=${sortOrder}`)
            .then(res => {
                const data = res.data.data;
                setVillagerData(data);
                setTotalPage(res.data.totalPage);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setFormData(initialForm);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        loadVillagerData();
    }, [perPage, sortOrder]);

    const handleResetForm = () => {
        loadVillagerData();
    };

    const handleChangePerPage = (e) => {
        const val = e.target.value;
        setPerPage(val);
    };

    const handleSortOrder = (e) => {
        const value = e.target.value;
        setSortOrder(value);
    };

    const handleSelectDelete = (data) => {
        setSelectedDelete(data);
        return document.getElementById('my_modal_2').showModal();
    };

    const handleDeleteVillager = (id) => {
        axios.delete(`${apiUrl}/v1/villager/delete/${id}`)
            .then(res => {
                console.log(res);
                showToast(res.data.message, 'success');
                loadVillagerData();
            })
            .catch(err => {
                console.log(err);
                showToast('Gagal menghapus data', 'failed');
            })
            .finally(() => {
                return document.getElementById('my_modal_2').close();
            })
    };

  return (
    <>
        <DashboardSection width = 'w-full' height = 'h-full'>
            <Modal>
                <div className='flex flex-col gap-y-3'>
                    <Paragraph>Anda akan menghapus data penduduk milik <span className='font-bold'>{`${selectedDelete?.name} (${selectedDelete.uid})`}</span>?</Paragraph>
                    <div className='flex flex-row gap-x-2 self-end'>
                    <button onClick={()=>handleDeleteVillager(selectedDelete?._id)} className="btn bg-red-600 hover:bg-red-700 text-white border-[#e5e5e5] w-fit">Ya</button>
                    <div className="modal-action mt-0">
                        <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn bg-slate-300 hover:bg-slate-400 text-black border-[#e5e5e5] w-fit">Kembali</button>
                        {/* <button className="btn">Close</button> */}
                        </form>
                    </div>
                    </div>
                </div>
            </Modal>
            <Paragraph size = 'text-lg' weight = 'font-bold'>Pengaturan Data Penduduk</Paragraph>
            <Paragraph>Pengaturan data penduduk Desa Mappetajang</Paragraph>
            <div className='flex justify-end'>
                <Link to='add'>
                  <button className="btn btn-neutral btn-outline">Tambahkan Penduduk</button>
                </Link>
            </div>
            <DataFilter onHandleSearch = {handleSearch} onHandleReset = {handleResetForm} onHandlePerPage = {handleChangePerPage} onHandleSort = {handleSortOrder}>
                <div className='flex flex-col gap-y-1 flex-auto'>
                    <label htmlFor="uid"><Paragraph weight = 'font-medium'>NIK:</Paragraph></label>
                    <input id='uid' onChange={handleChange} value={formData.uid} type='text' pattern="[0-9]" maxLength={16} inputMode="numeric" placeholder="Masukkan NIK" className="input input-neutral" />
                </div>
                <div className='flex flex-col gap-y-1 flex-auto'>
                    <label htmlFor="name"><Paragraph weight = 'font-medium'>Nama:</Paragraph></label>
                    <input id='name' onChange={handleChange} value={formData.name} type='text'placeholder="Masukkan Nama" className="input input-neutral" />
                </div>
                <div className='flex flex-col gap-y-1'>
                    <label htmlFor="village"><Paragraph weight = 'font-medium'>Dusun:</Paragraph></label>
                    <select onChange={handleChange} id='village' defaultValue="" className="select w-full">
                        <option value="" disabled={true}>Nama Dusun</option>
                        <option value='Dusun Buntu Kaluaja'>Buntu Kaluaja</option>
                        <option value='Dusun Malenyong'>Malenyong</option>
                        <option value='Dusun Pemanukan'>Pemanukan</option>
                        <option value='Dusun Pongsimpin'>Pongsimpin</option>
                    </select>
                </div>
            </DataFilter>
            <div className='relative'>
                <LoadingComponent isLoading = {isLoading} />
                <Table tableHead = {['NIK', 'Nama', 'Dusun', 'Aksi']}>
                {villagerData.length > 0 ? villagerData.map((item, i) => (
                    <tr key={i}>
                        <th><Paragraph weight = 'font-medium' size = 'text-xs'>{i + 1}</Paragraph></th>
                        <TableData><Paragraph size = 'text-xs'>{item.uid}</Paragraph></TableData>
                        <TableData><Paragraph size = 'text-xs'>{item.name}</Paragraph></TableData>
                        <TableData><Paragraph size = 'text-xs'>{item.address}</Paragraph></TableData>
                        <TableData>
                            <div className='flex flex-col gap-y-1'>
                                <Link to={item._id}>
                                    <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer' weight ='font-normal'>Lihat/Edit</Paragraph>
                                </Link>
                                <div onClick={()=>handleSelectDelete(item)}>
                                    <Paragraph size = 'text-xs' color = 'text-red-600' otherClass = 'underline cursor-pointer'>Hapus</Paragraph>
                                </div>
                            </div>
                        </TableData>
                    </tr>
                )) : <tr><td colSpan={5} className={`p-0 border-none leading-[0] bg-base-100`}><NoData /></td></tr>}
                </Table>
            </div>
            <Pagination currentPage = {currentPage} totalPage = {totalPage} onChangePage = {handleChangePage} />
        </DashboardSection>
    </>
  )
}

export default VillagerSetting