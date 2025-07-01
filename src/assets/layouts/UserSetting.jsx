import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import Table from '../components/Table/Index';
import TableData from '../components/Table/TableData';
import Pagination from '../components/Pagination/Index';
import axios from 'axios';
import NoData from '../fragments/NoData/Index';
import LoadingComponent from '../fragments/LoadingComponent/Index';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal/Index';
import { Auth } from '../../contexts/AuthContext';
import { Toast } from '../../contexts/ToastContext';

const UserSetting = () => {
    const [formData, setFormData] = useState({});
    const [filter, setFilter] = useState({});
    const [userData, setUserData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState({});
    const [modalEdit, setModalEdit] = useState(null);
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [signUpErr, setSignUpErr] = useState(null);
    const {user} = useContext(Auth);
    const {showToast} = useContext(Toast);
    const initialState = {role: '', perPage: 5};
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleChangePage = (p) => {
        const nextPage = p == 'prev' ? currentPage - 1 : currentPage + 1;
        if (p == 'prev') {
            setCurrentPage(nextPage);
        } else {
            setCurrentPage(nextPage);
        };
    };

    const loadData = () => {
        const role = filter.role || '';
        const perPage = filter.perPage || '';
        const sortOrder = filter.sort || '';

        setIsLoading(true);
        axios.get(`${apiUrl}/v1/auth/get?page=${currentPage}&perPage=${perPage}&role=${role}&sortOrder=${sortOrder}`)
            .then(res => {
                const data = res.data.data;
                setUserData(data);
                setTotalPage(res.data.totalPage);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false);
            })
    };

    const handleChangeFilter = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        setFilter(prev => ({...prev, [id]: value}));
    }

    useEffect(() => {
        loadData();
    }, [currentPage, filter]);

    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [totalPage])

    const handleSelectDelete = (u) => {
        setModalEdit('delete');
        setSelectedUser(u);
        return document.getElementById('my_modal_2').showModal();
    };

    const handleDelete = () => {
        axios.delete(`${apiUrl}/v1/auth/delete/${selectedUser._id}?submitter=${user.id}`)
            .then(res => {
                showToast(res.data.message, 'success');
                setModalEdit(null);
                return document.getElementById('my_modal_2').close();
            })
            .catch(err => console.log(err))
            .finally(() => {
                loadData();
            });
    };

    const handleChangeForm = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        setFormData(prev => ({...prev, [id]: value}));
    };

    useEffect(() => {
        if(formData.password && formData.confirmPassword) {
            if(formData.password !== formData.confirmPassword) {
                setPasswordMatch(false);
            } else {
                setPasswordMatch(true);
            }
        } 
    }, [formData])

    const handleOpenModalAdd = () => {
        setModalEdit('add');
        return document.getElementById('my_modal_2').showModal();
    };

    const handleOpenModalEdit = (u) => {
        setFormData(u);
        setModalEdit('edit');
        return document.getElementById('my_modal_2').showModal();
    };

    const handleSubmitAdd = () => {
        if(!passwordMatch) {
            setSignUpErr('Konfirmasi kata sandi salah');
            const timeout = setTimeout(() => {
                setSignUpErr(null);
            }, 5000);
            return ()=>clearTimeout(timeout);
        } else {
            const data = new FormData();
            data.append('userName', formData.userName);
            data.append('password', formData.password);
            data.append('name', formData.name);
            data.append('role', formData.role);
            data.append('submitter', user.id);
    
            axios.post(`${apiUrl}/v1/auth/signup`, data, {withCredentials: true})
                .then(res => {
                    showToast(res.data.message, 'success');
                    setFormData({});
                    setModalEdit(null);
                    loadData();
                    return document.getElementById('my_modal_2').close();
                })
                .catch(err => {
                    {
                        console.log(err)
                        setSignUpErr(err.response.data.message);
                    };
                })
                .finally(() => {
                    const timeout = setTimeout(() => {
                        setSignUpErr(null);
                    }, 5000);
                    return ()=>clearTimeout(timeout);
                })
        };
    };

    const handleSubmitEdit = () =>{
        const role = formData.role;
        const id = formData._id;

        axios.put(`${apiUrl}/v1/auth/edit-role/${id}?submitter=${user.id}`, {role: role}, {withCredentials:true})
            .then(res => {
                console.log(res);
                showToast(res.data.message, 'success');
                setFormData({});
                setModalEdit(null);
                loadData();
                return document.getElementById('my_modal_2').close();
            })
            .catch(err => console.log(err));
    }

    const handleCloseModal = () => {
        setFormData({});
        return document.getElementById('my_modal_2').close();
    };

  return (
    <>
        <DashboardSection width = 'w-full' height = 'h-full'>
            <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-col gap-y-2'>
                <Paragraph size = 'text-lg' weight = 'font-bold'>Pengaturan Pengguna</Paragraph>
                <Paragraph>Tambahkan, edit, atau hapus pengguna</Paragraph>
              </div>
              <div className='flex flex-row gap-x-2'>
                  <button onClick={handleOpenModalAdd} className="btn btn-neutral btn-outline">Tambahkan Pengguna</button>
              </div>
            </div>
            <Modal>
                <div className='flex flex-col gap-y-3'>
                    {modalEdit == 'delete' ? (
                        <>
                            <Paragraph>Anda akan menghapus pengguna <span className='font-bold'>{`${selectedUser?.userName} (${selectedUser?.role})`}</span>?</Paragraph>
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
                        </>
                    ) : modalEdit == 'add' ?
                        <>
                            <div className='flex flex-col gap-y-2'>
                                <div className='flex flex-row justify-between'>
                                    <Paragraph size = 'text-lg' weight = 'font-bold'>Tambah Pengguna</Paragraph>
                                    <svg onClick={handleCloseModal} className='w-6 h-6 self-end cursor-pointer' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#000000"></path></g></svg>
                                </div>
                                <label htmlFor="userName"><Paragraph weight = 'font-medium'>User ID</Paragraph></label>
                                <input value={formData.userName || ""} onChange={handleChangeForm} id='userName' type="text" placeholder="User ID" className="input w-full" />
                                <label htmlFor="password"><Paragraph weight = 'font-medium'>Kata Sandi</Paragraph></label>
                                <input value={formData.password || ""} onChange={handleChangeForm} id='password' type="password" placeholder="Kata Sandi" className="input w-full" />
                                <label htmlFor="password"><Paragraph weight = 'font-medium'>Konfirmasi Kata Sandi</Paragraph></label>
                                <input value={formData.confirmPassword || ""} onChange={handleChangeForm} id='confirmPassword' type="password" placeholder="Kata Sandi" className={`input w-full ${passwordMatch === false ? 'input-error' : ''} `}/>
                                <Paragraph size = 'text-xs' otherClass = {`italic ${passwordMatch === false ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] opacity-0'} ease-in-out duration-300 transition-all`} color = 'text-error'>Konfirmasi kata sandi tidak sesuai</Paragraph>
                                <label htmlFor="name"><Paragraph weight = 'font-medium'>Nama</Paragraph></label>
                                <input value={formData.name || ""} onChange={handleChangeForm} id='name' type="text" placeholder="Nama" className="input w-full" />
                                <label htmlFor="role"><Paragraph weight = 'font-medium'>Peran</Paragraph></label>
                                <select value={formData.role || ""} onChange={handleChangeForm} id='role' defaultValue="" className="select w-full">
                                    <option value="" disabled={true}>Peran</option>
                                    <option>Admin</option>
                                    <option>User</option>
                                </select>
                                <Paragraph size = 'text-xs' otherClass = {`text-center ${signUpErr ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] opacity-0'} ease-in-out duration-300 transition-all`} color = 'text-error'>{signUpErr}</Paragraph>
                                <button onClick={handleSubmitAdd} className="btn btn-neutral mt-4">Tambahkan</button>
                            </div>
                        </> : 
                        modalEdit == 'edit' ?
                        <>
                            <div className='flex flex-col gap-y-2'>
                                <div className='flex flex-row justify-between'>
                                    <Paragraph size = 'text-lg' weight = 'font-bold'>Atur Pengguna</Paragraph>
                                    <svg onClick={handleCloseModal} className='w-6 h-6 self-end cursor-pointer' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#000000"></path></g></svg>
                                </div>
                                <label htmlFor="userName"><Paragraph weight = 'font-medium'>User ID</Paragraph></label>
                                <input value={formData.userName} id='userName' type="text" placeholder="User ID" className="input w-full" disabled />
                                <label htmlFor="name"><Paragraph weight = 'font-medium'>Nama</Paragraph></label>
                                <input value={formData.name} id='name' type="text" placeholder="Nama" className="input w-full" disabled />
                                <label htmlFor="role"><Paragraph weight = 'font-medium'>Peran</Paragraph></label>
                                <select value={formData.role} onChange={handleChangeForm} id='role' defaultValue="" className="select w-full">
                                    <option value="" disabled={true}>Peran</option>
                                    <option>Admin</option>
                                    <option>User</option>
                                </select>
                                <button onClick={handleSubmitEdit} className="btn btn-neutral mt-4">Tambahkan</button>
                            </div>
                        </>
                        :<></>}
                </div>
            </Modal>
            <div className='flex flex-row justify-between'>
                <div className='px-5 justify-end flex gap-x-3 items-center'>
                    <label htmlFor="perPage"><Paragraph weight = 'font-medium'>Urutkan</Paragraph></label>
                    <select onChange={handleChangeFilter} id='sort' value={filter.sort} className="select select-xs w-fit">
                        <option value="desc">Terbaru</option>
                        <option value="asc">Terlama</option>
                    </select>
                </div>
                <div className='px-5 justify-end flex gap-x-3 items-center'>
                    <label htmlFor="perPage"><Paragraph weight = 'font-medium'>Tampilkan sebanyak</Paragraph></label>
                    <select onChange={handleChangeFilter} id='perPage' value={filter.perPage} className="select select-xs w-fit">
                        <option>5</option>
                        <option>10</option>
                        <option>20</option>
                    </select>
                </div>
                <div className='px-5 justify-end flex gap-x-3 items-center'>
                    <label htmlFor="role"><Paragraph weight = 'font-medium'>Berdasarkan peran</Paragraph></label>
                    <select onChange={handleChangeFilter} id='role' value={filter.role} defaultValue="" className="select select-xs w-fit">
                        <option value="">Semua</option>
                        <option value={1}>Admin</option>
                        <option value={2}>User</option>
                    </select>
                </div>
            </div>
            <div className='relative'>
                <LoadingComponent isLoading = {isLoading} />
                <Table tableHead = {['ID Pengguna', 'Nama Pengguna', 'Peran Pengguna', 'Aksi']}>
                {userData.length ? userData.map((item, i) => (
                    <tr key={i}>
                        <th><Paragraph weight = 'font-medium' size = 'text-xs'>{i + 1}</Paragraph></th>
                        <TableData><Paragraph size = 'text-xs'>{item.userName}</Paragraph></TableData>
                        <TableData><Paragraph size = 'text-xs'>{item.name}</Paragraph></TableData>
                        <TableData><Paragraph size = 'text-xs'>{item.role}</Paragraph></TableData>
                        <TableData>
                            {item._id !== user?.id ? (
                                <>
                                    <div onClick={()=>handleOpenModalEdit(item)}>
                                        <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer' weight ='font-normal'>Edit</Paragraph>
                                    </div>
                                    <div onClick={()=>handleSelectDelete(item)}>
                                        <Paragraph size = 'text-xs' color = 'text-red-600' otherClass = 'underline cursor-pointer'>Hapus</Paragraph>
                                    </div>
                                </>
                            ) : <></>}
                        </TableData>
                    </tr>
                )) : <tr><td colSpan={4} className={`p-0 border-none leading-[0] bg-base-100`}><NoData /></td></tr>}
                </Table>
            </div>
            <Pagination currentPage = {currentPage} totalPage = {totalPage} onChangePage = {handleChangePage} />
        </DashboardSection>
    </>
  )
}

export default UserSetting