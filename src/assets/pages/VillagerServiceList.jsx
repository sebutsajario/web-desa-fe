import React, { useContext, useEffect, useState } from 'react'
import { Loading } from '../../contexts/LoadingContext'
import Navbar from '../components/Navbar/Index';
import SectionTitle from '../components/SectionTitle/Index';
import Footer from '../components/Footer/Index';
import axios from 'axios';
import { Villager } from '../../contexts/VillagerContext';
import { dateConvert } from '../utilities/dateConvert';
import TableData from '../components/Table/TableData';
import Table from '../components/Table/Index';
import Paragraph from '../components/Paragraph';
import NoData from '../fragments/NoData/Index';
import { Link, useNavigate } from 'react-router-dom';
import ToastComponent from '../components/Toast/Index';
import Modal from '../components/Modal/Index';
import { Toast } from '../../contexts/ToastContext';
import Pagination from '../components/Pagination/Index';
import LoadingComponent from '../fragments/LoadingComponent/Index';

const VillagerServiceListPage = (props) => {
    const {page} = props;
    const {setIsPageLoading} = useContext(Loading);
    const {villager, setVillager} = useContext(Villager);
    const {showToast} = useContext(Toast);
    const [requestList, setRequestList] = useState([]);
    const [isOpen, setIsOpen] = useState(null);
    const [tableHead, setTableHead] = useState([]);
    const [selected, setSelected] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState('desc');
    const navigate = useNavigate();
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
    ];

    const loadData = () => {
        setIsLoading(true);
        const segment = page == 'service' ? 'reqservice' : 'complaint'
        const url = `${apiUrl}/v1/${segment}/getdata?id=${villager?._id}&page=${currentPage}&perPage=${perPage}&sortOrder=${sortOrder}`
        axios.get(url)
            .then(res => {
                const data = res.data;
                setRequestList(data.data);
                setTotalPage(data.totalPage);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsPageLoading(false);
                setIsLoading(false);
            })
    }

    useEffect(() => {
        if(page == 'service') {
            setTableHead(['Nama', 'Permohonan Layanan', 'Tanggal Permohonan', 'Aksi'])
        } else {
            setTableHead(['Nama', 'Tanggal', 'Aksi'])
        }
        if(!villager) {
            axios.get(`${apiUrl}/v1/villager/getaccess`, {withCredentials:true})
            .then(res => {
                const data = res.data;
                setVillager(data)
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsPageLoading(false);
            })
        }
    }, []);

    useEffect(() => {
        loadData();
        }, [villager, sortOrder, currentPage, perPage, page]);
    
    const handleOpen = (i) => {
        if(i == isOpen) {
            setIsOpen(null);
        } else {
            setIsOpen(i);
        };
    };

    
    const selectDelete = (data) => {
        setSelected(data);
        return document.getElementById('my_modal_2').showModal();
    };

    const handleDelete = () => {
        const id = villager._id;
        const url = page == 'service' ? `${apiUrl}/v1/reqservice/delete/${selected._id}?villager=${id}` : `${apiUrl}/v1/complaint/delete/${selected._id}?villager=${id}`;

        axios.delete(url, {withCredentials:true})
            .then(res => {
                showToast(res.data.message, 'success');
                loadData();
                return document.getElementById('my_modal_2').close();
            })
            .catch(err => {
                console.log(err);
                showToast('Gagal menghapus', 'failed');
            })
    };

    const handleChangeFilter = (e) => {
        const id = e.target.id;
        const value = e.target.value;

        if(id == 'perPage') {
            setPerPage(value);
        } else if (id == 'sort') {
            setSortOrder(value);
        };
    };

    const handleChangePage = (p) => {
        if(p == 'prev') {
            setCurrentPage(currentPage - 1);
        } else {
            setCurrentPage(currentPage + 1);
        };
    };

  return (
    <div className='relative'>
        <Navbar />
        <ToastComponent />
        <Modal>
            <div className='flex flex-col gap-y-3'>
                {page == 'service' ? (
                    <Paragraph>Anda akan menghapus permohonan layanan <span className='font-bold'>{selected?.service}</span> Anda?</Paragraph>
                ) : (
                    <Paragraph>Anda akan menghapus keluhan Anda?</Paragraph>
                )}
                <div className='flex flex-row gap-x-2 self-end'>
                <button onClick={handleDelete} className="btn bg-red-600 hover:bg-red-700 text-white border-[#e5e5e5] w-fit">Ya</button>
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
        <div className='flex flex-col sm:flex-row justify-between'>
            <SectionTitle>RIWAYAT {page == 'service' ? 'LAYANAN' : 'KELUHAN'}</SectionTitle>
            <div className='flex px-16 sm:py-5 gap-x-3'>
                <Link to={`/services/${page}/form`}>
                    <button className="btn btn-neutral btn-outline">{page =='service' ? 'Buat Permohonan' : 'Buat Keluhan'}</button>
                </Link>
                <button onClick={()=> navigate(-1)} className="btn btn-neutral btn-outline">Kembali</button>
            </div>
        </div>
        <div className='flex flex-col-reverse md:flex-row gap-x-2'>
            {!isLoading ? (
            <div className='flex justify-center w-full pr-16 md:px-0 md:flex-1'>
                <div className='pl-16 w-full'>
                    <Table tableHead = {tableHead}>
                    {requestList.length ? requestList.map((item, i) => {
                        const date = dateConvert(item.updatedAt)
                        return (
                            <>
                                <tr key={i}>
                                    <th><Paragraph weight = 'font-medium' size = 'text-xs'>{i + 1}</Paragraph></th>
                                    <TableData><Paragraph size = 'text-xs'>{item.villagerData?.name}</Paragraph></TableData>
                                    {page == 'service' ? (
                                        <TableData><Paragraph size = 'text-xs'>{item.service}</Paragraph></TableData>
                                    ) : <></>}
                                    <TableData><Paragraph size = 'text-xs'>{date}</Paragraph></TableData>
                                    <TableData>
                                        <div className='flex flex-col gap-y-1'>
                                            <div onClick={() => handleOpen(i)} className='flex flex-col'>
                                                <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer'>Lihat</Paragraph>
                                            </div>
                                            <div onClick={() => selectDelete(item)} className='flex flex-col'>
                                                <Paragraph size = 'text-xs' color='text-red-500' otherClass = 'underline cursor-pointer'>Hapus</Paragraph>
                                            </div>
                                        </div>
                                    </TableData>
                                </tr>
                                <tr className={``}>
                                    <td colSpan={page == 'service' ? 5 : 4} className={`p-0 border-none leading-[0] bg-base-100`}>
                                        <div className={`w-full h-full flex flex-col p-3 gap-y-2 ${isOpen == i ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] opacity-0'} transition-all ease-in-out duration-300 overflow-hidden bg-base-300`}>
                                            {page == 'service' ? (
                                                <div className='flex flex-row gap-x-3'>
                                                    <Paragraph weight = 'font-medium'>Jenis Permintaan Layanan</Paragraph>
                                                    <Paragraph weight = 'font-medium'>:</Paragraph>
                                                    <Paragraph>{item.service}</Paragraph>
                                                </div>
                                            ) : <></>}
                                            <div className='flex flex-row gap-x-3'>
                                                <Paragraph weight = 'font-medium'>Tanggal Permintaan</Paragraph>
                                                <Paragraph weight = 'font-medium'>:</Paragraph>
                                                <Paragraph>{date}</Paragraph>
                                            </div>
                                            <div className='flex flex-col gap-y-3'>
                                                <div className='flex flex-row gap-x-3'>
                                                    <Paragraph weight = 'font-medium'>Catatan</Paragraph>
                                                    <Paragraph weight = 'font-medium'>:</Paragraph>
                                                </div>
                                                <Paragraph>{item.note}</Paragraph>
                                            </div>
                                            {page == 'service' ? (
                                                <div className='flex flex-row gap-x-3 items-center'>
                                                    <Paragraph weight = 'font-medium'>Status</Paragraph>
                                                    <Paragraph weight = 'font-medium'>:</Paragraph>
                                                    <div className="dropdown dropdown-bottom">
                                                        {/* <div  role="button" className="btn m-1">Click ⬇️</div> */}
                                                        <div tabIndex={0} role='button' className={`px-2 py-1 rounded-sm w-fit h-fit ${item.status == 1 ? 'bg-red-800' : item.status == 2 ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                                                            <Paragraph color = 'text-white'>{requestStatus[item.status - 1].status}</Paragraph>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : <></>}
                                            {page == 'service' ? (
                                                <>
                                                    <Paragraph size = 'text-xs'>Jika permohonan telah diproses. Anda dapat mengunjungi kantor desa untuk mengambil surat keterangan Anda</Paragraph>
                                                    <Paragraph size = 'text-xs'>Anda juga dapat menghubungi kontak yang tertera untuk terus mendapatkan info terbaru mengenai permohonan Anda.</Paragraph>
                                                </>
                                            ) : <></>}
                                        </div>
                                    </td>
                                </tr>
                            </>
                    )
                    }) :
                    <tr><td colSpan={6} className={`p-0 border-none leading-[0] bg-base-100`}><NoData /></td></tr>}
                    </Table>
                </div>
            </div>
        ) : <div className='flex-1 relative'><LoadingComponent isLoading = {isLoading} /></div>}
            <div className='flex flex-row gap-x-3 md:flex-col w-fit pl-16 md:pr-16 md:pl-5 gap-y-2 py-3 md:py-0'>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Tampilkan Sebanyak</legend>
                <select onChange={handleChangeFilter} id='perPage' defaultValue={5} className="select">
                <option disabled={true}>Jumlah Post</option>
                <option>5</option>
                <option>10</option>
                <option>20</option>
                <option>30</option>
                </select>
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Urutkan</legend>
                <select onChange={handleChangeFilter} id='sort' defaultValue="Terbaru" className="select">
                <option disabled={true}>Urutkan</option>
                <option value='desc'>Terbaru</option>
                <option value='asc'>Terlama</option>
                </select>
            </fieldset>
            </div>
        </div>
        
        <Pagination currentPage ={currentPage} totalPage={totalPage} onChangePage = {handleChangePage} />
        <Footer />
    </div>
  )
}

export default VillagerServiceListPage