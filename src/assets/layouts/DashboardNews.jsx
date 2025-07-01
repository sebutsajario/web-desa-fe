import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import Table from '../components/Table/Index'
import TableData from '../components/Table/TableData'
import Pagination from '../components/Pagination/Index'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Modal from '../components/Modal/Index'
import { dateConvert } from '../utilities/dateConvert'
import DataFilter from '../fragments/DataFilter/Index'
import LoadingComponent from '../fragments/LoadingComponent/Index'
import NoData from '../fragments/NoData/Index'
import { Toast } from '../../contexts/ToastContext'

const DashboardNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState('');
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [perPage, setPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('desc');
  const [totalPage, setTotalPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const {showToast} = useContext(Toast);
  const initialSearch = {category: '', date: ''};
  const apiUrl = import.meta.env.VITE_API_URL;

  const loadData = () => {
    setIsLoading(true);
    const category = formData.category || '';
    const date = formData.date || '';
    axios.get(`${apiUrl}/v1/post/posts?perPage=${perPage}&page=${currentPage}&category=${category}&date=${date}&sortOrder=${sortOrder}`)
      .then(res => {
        const data = res.data.data;
        setNewsList(data);
        setTotalPage(res.data.totalPage);
    })
      .catch(err => {
        setNewsList([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  
  useEffect(() => {
    loadData();
  }, [currentPage, perPage, sortOrder]);

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setFormData(prev => ({...prev, [id]: value}));
  };

  const handleSearch = () => {
    loadData();
  };

  const handleReset = () => {
    setFormData(initialSearch);
    axios.get(`${apiUrl}/v1/post/posts?perPage=${perPage}&page=${currentPage}&sortOrder=${sortOrder}`)
      .then(res => {
        const data = res.data.data;
        setNewsList(data);
        setTotalPage(res.data.totalPage);
    })
      .catch(err => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = (id) => {
    if(!id) {
      return;
    };
    axios.delete(`${apiUrl}/v1/post/post/${id}`)
      .then(res => {
        showToast(res.data.message, 'success');
        loadData();
        return document.getElementById('my_modal_2').close();
      })
      .catch(err => {
        showToast('Gagal menghapus post', 'failed')
      })
    };

  const selectDelete = (id) => {
    if(!id) {
      return;
    };
    const data = newsList.find(item => item._id == id);
    setSelectedNews(data);
    return document.getElementById('my_modal_2').showModal()
  };

  const handlePerPage = (e) => {
    setPerPage(e.target.value);
  };

  const handleSortOrder = (e) => {
    const value = e.target.value;
    setSortOrder(value);
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

  return (
    <>
        <DashboardSection width = 'w-full'>
        <Modal>
          <div className='flex flex-col gap-y-3'>
            <Paragraph>Yakin ingin menghapus postingan <span className='font-bold'>"{selectedNews.title}"</span>?</Paragraph>
            <div className='flex flex-row gap-x-2 self-end'>
              <button onClick={()=>handleDelete(selectedNews._id)} className="btn bg-red-600 hover:bg-red-700 text-white border-[#e5e5e5] w-fit">Ya</button>
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
            <div className='flex flex-col gap-y-3 md:flex-row justify-between'>
              <div className='flex flex-col gap-y-2'>
                <Paragraph size = 'text-lg' weight = 'font-bold'>Daftar Berita & Pengumuman</Paragraph>
                <Paragraph>Daftar Berita & Pengumuman</Paragraph>
              </div>
              <div className='flex flex-row gap-x-2'>
                <Link to='add'>
                  <button className="btn btn-neutral btn-outline">Tambahkan Berita</button>
                </Link>
              </div>
            </div>
            <DataFilter onHandleSearch = {handleSearch} onHandleReset = {handleReset} onHandlePerPage = {handlePerPage} onHandleSort = {handleSortOrder} >
              <div className='flex flex-col gap-y-1 w-full md:flex-auto'>
                    <label htmlFor="category"><Paragraph weight = 'font-medium'>Kategori:</Paragraph></label>
                    <select onChange={handleChange} value={formData.category} id='category' defaultValue=""  className="select w-full">
                        <option value="" disabled={true}>Kategori</option>
                        <option>Berita</option>
                        <option>Pengumuman</option>
                    </select>
                </div>
                <div className='flex flex-col gap-y-1 w-full md:flex-auto'>
                    <label htmlFor="date"><Paragraph weight = 'font-medium'>Tanggal Post:</Paragraph></label>
                    <input onChange={handleChange} value={formData.date} id='date' type='date' className="input input-neutral w-full" />
                </div>
            </DataFilter>
            <div className='relative'>
              <LoadingComponent isLoading = {isLoading} />
              <Table data = {newsList} tableHead = {['Gambar', 'Judul', 'Kategori', 'Tanggal', 'Aksi']}>
                  {newsList.length > 0 ? newsList.map((item, i) => {
                    const date = dateConvert(item.updatedAt)
                    return(
                        <tr key={i}>
                            <th><Paragraph weight = 'font-medium' size = 'text-xs'>{i + 1}</Paragraph></th>
                            <TableData><img className='w-12' src={`http://localhost:3000/${item.image}`} alt="" /></TableData>
                            <TableData><Paragraph size = 'text-xs'>{item.title}</Paragraph></TableData>
                            <TableData><Paragraph size = 'text-xs'>{item.category}</Paragraph></TableData>
                            <TableData><Paragraph size = 'text-xs'>{date}</Paragraph></TableData>
                            <TableData>
                              <div className='flex flex-row gap-x-2'>
                                <Link style={{display: 'contents'}} to={`edit/${item._id}`}>
                                  <div className='w-10 p-[6px] border border-black/80 hover:bg-slate-400 rounded-md cursor-pointer transition-all ease-in-out duration-300'>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                  </div>
                                </Link>
                                <div onClick={() => selectDelete(item._id)} className='w-10 p-[6px] border border-black/80 hover:bg-red-600 rounded-md cursor-pointer transition-all ease-in-out duration-300'>
                                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12V17" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 12V17" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                </div>
                              </div>
                            </TableData>
                        </tr>
                    )
                  }
                  ) : <tr><td colSpan={6} className={`p-0 border-none leading-[0] bg-base-100`}><NoData /></td></tr>}
              </Table>
            </div>
            <Pagination onChangePage = {handleChangePage} currentPage ={currentPage} totalPage = {totalPage} />
        </DashboardSection>
    </>
  )
}

export default DashboardNews