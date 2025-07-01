import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import { Link } from 'react-router-dom'
import DataFilter from '../fragments/DataFilter/Index'
import LoadingComponent from '../fragments/LoadingComponent/Index'
import Table from '../components/Table/Index'
import TableData from '../components/Table/TableData'
import axios from 'axios'
import NoData from '../fragments/NoData/Index'
import Modal from '../components/Modal/Index'
import { Auth } from '../../contexts/AuthContext'
import { Toast } from '../../contexts/ToastContext'
import Pagination from '../components/Pagination/Index'

const VillageResidenceSetting = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [residenceData, setResidenceData] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [filter, setFilter] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [totalPage, setTotalPage] = useState(0);
    const [sortOrder, setSortOrder] = useState('desc');
    const {user} = useContext(Auth);
    const {showToast} = useContext(Toast);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        loadData();
    }, [perPage, currentPage, sortOrder]);

    const loadData = () => {
        setIsLoading(true);
        const village = filter.village || "";
        const name = filter.name || "";
        axios.get(`${apiUrl}/v1/residence/getdata?page=${currentPage}&perPage=${perPage}&sortOrder=${sortOrder}&name=${name}&village=${village}`)
            .then(res => {
                const data = res.data;
                setResidenceData(data.data);
                setTotalPage(data.totalPage);
            })
            .catch(err => console.group(err))
            .finally(() => setIsLoading(false));
    };

    const handleChangeFilter = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        setFilter(prev => ({...prev, [id]: value}));
    };

    const handleSearch = () => {
        loadData();
    };

    const handleResetFilter = () => {
        setFilter({});
        setCurrentPage(1);
        axios.get(`${apiUrl}/v1/residence/getdata?page=1&perPage=${perPage}&sortOrder=${sortOrder}`)
            .then(res => {
                const data = res.data;
                setResidenceData(data.data);
                setTotalPage(data.totalPage);
            })
            .catch(err => console.group(err))
            .finally(() => setIsLoading(false));
    };

    const handleChangePerPage = (e) => {
        const value = e.target.value;
        setPerPage(value);
    };

    const handleChangeSortOrder = (e) => {
        const value = e.target.value;
        setSortOrder(value);
    };

    const handleSelectDelete = (item) => {
        setSelectedData(item);
        return document.getElementById('my_modal_2').showModal();
    };


    const handleDeleteData = (id) => {
        axios.delete(`${apiUrl}/v1/residence/delete/${id}?user=${user.id}`, {withCredentials: true})
            .then(res => {
                const message = res.data.message;
                showToast(message, 'success');
                loadData();
            })
            .catch(err => {
                const message = err.response.data.message;
                showToast(message, 'failed');
            })
            .finally(() => {
                return document.getElementById('my_modal_2').close();
            });
    };

    const handleChangePage = (p) => {
        console.log(p)
        if(p == 'prev') {
            setCurrentPage(currentPage - 1);
        } else {
            setCurrentPage(currentPage + 1);
        };
    };

    // console.log(filter)

  return (
    <DashboardSection width = 'w-full'>
        <Modal>
            <div className='flex flex-col gap-y-3'>
                <Paragraph>Anda akan menghapus data tempat tinggal ini?</Paragraph>
                <div className='flex flex-row gap-x-2 self-end'>
                <button onClick={()=>handleDeleteData(selectedData?._id)} className="btn bg-red-600 hover:bg-red-700 text-white border-[#e5e5e5] w-fit">Ya</button>
                <div className="modal-action mt-0">
                    <form method="dialog">
                    <button className="btn bg-slate-300 hover:bg-slate-400 text-black border-[#e5e5e5] w-fit">Kembali</button>
                    </form>
                </div>
                </div>
            </div>
        </Modal>
        <Paragraph size = 'text-lg' weight = 'font-bold'>Pengaturan Data Tempat Tinggal dan Kependudukan Desa</Paragraph>
        <Paragraph>Pengaturan data tempat tinggal dan kependudukan Desa Mappetajang</Paragraph>
        <div className='flex justify-end'>
            <Link to='add'>
                <button className="btn btn-neutral btn-outline">Tambahkan Data</button>
            </Link>
        </div>
        <DataFilter onHandleSearch = {handleSearch} onHandleReset = {handleResetFilter} onHandlePerPage = {handleChangePerPage} onHandleSort = {handleChangeSortOrder}>
            <div className='flex flex-col gap-y-1 basis-full'>
                <label htmlFor="name"><Paragraph weight = 'font-medium'>Nama:</Paragraph></label>
                <input onChange={handleChangeFilter} id='name' value={filter.name || ""} type='text'placeholder="Masukkan Nama" className="input input-neutral" />
            </div>
            <div className='flex flex-col gap-y-1 basis-full'>
                <label htmlFor="village"><Paragraph weight = 'font-medium'>Dusun:</Paragraph></label>
                <select onChange={handleChangeFilter} id='village' defaultValue="" value={filter.village || ""} className="select w-full">
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
            <Table tableHead = {['Nama Dusun', 'Nama Kepala Keluarga', 'Jumlah KK', 'Jumlah Penghuni Bangunan']}>
            {residenceData.length > 0 ? residenceData.map((item, i) => {
                const getFamilyNum = (familyCardArray) => {
                    let total = 0;
                    familyCardArray.forEach(family => {
                        if (Array.isArray(family.data)) {
                            total += family.data.length;
                        }
                    });
                    return total;
                };
                const getFamilyHead = (familyCardArray) => {
                    let familyHeads = [];
                    familyCardArray.forEach(family => {
                        if (Array.isArray(family.data)) {
                            const head = family.data.find(person => person.position === 'Kepala Keluarga');
                            if (head) {
                                familyHeads.push(head.name);
                            };
                        };
                    });
                    return familyHeads;
                };
                const populationNum = getFamilyNum(item.familyCardData);
                const familyHeads = getFamilyHead(item.familyCardData);
                return (
                    <tr key={i}>
                        <th><Paragraph weight = 'font-medium' size = 'text-xs'>{i + 1}</Paragraph></th>
                        <TableData><Paragraph size = 'text-xs'>{item.village}</Paragraph></TableData>
                        <TableData><Paragraph size = 'text-xs' otherClass = 'line-clamp-1'>{familyHeads.join(', ')}</Paragraph></TableData>
                        <TableData><Paragraph size = 'text-xs'>{item.familyCardData.length}</Paragraph></TableData>
                        <TableData><Paragraph size = 'text-xs'>{populationNum}</Paragraph></TableData>
                        <TableData>
                            <div className='flex flex-col gap-y-1'>
                                <Link to={`edit/${item._id}`}>
                                    <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer' weight ='font-normal'>Lihat/Edit</Paragraph>
                                </Link>
                                <div className='cursor-pointer' onClick={()=> handleSelectDelete(item)}>
                                    <Paragraph size = 'text-xs' color = 'text-red-600' otherClass = 'underline cursor-pointer'>Hapus</Paragraph>
                                </div>
                            </div>
                        </TableData>
                    </tr>
                )
            }
            
            ) : <tr><td colSpan={5} className={`p-0 border-none leading-[0] bg-base-100`}><NoData /></td></tr>}
            </Table>
        </div>
        <Pagination onChangePage = {handleChangePage} currentPage = {currentPage} totalPage = {totalPage} />
    </DashboardSection>
  )
}

export default VillageResidenceSetting