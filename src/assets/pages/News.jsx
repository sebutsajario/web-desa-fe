import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Index'
import SectionTitle from '../components/SectionTitle/Index'
import CardContainer from '../fragments/CardContainer/Index'
import ArticleCard from '../components/ArticleCard/Index'
import Footer from '../components/Footer/Index'
import Pagination from '../components/Pagination/Index'
import axios from 'axios'
import { Loading } from '../../contexts/LoadingContext'
import ServiceValidator from '../fragments/ServiceValidator/Index'
import LoadingComponent from '../fragments/LoadingComponent/Index'
import Paragraph from '../components/Paragraph'

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const [category, setCategory] = useState('');
  const [isArticleLoading, setIsArticleLoading] = useState(true);
  const {setIsPageLoading} = useContext(Loading);
  const apiUrl = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    loadData();
    setIsPageLoading(false);
  }, []);
  
  const loadData = () => {
    setIsArticleLoading(true);
    axios.get(`${apiUrl}/v1/post/posts?page=${currentPage}&perPage=${perPage}&category=${category}&sortOrder=${sortOrder}`)
      .then(res => {
        const data = res.data;
        console.log(res.data)
        setNewsList(data.data);
        setPerPage(data.perPage);
        setTotalPage(data.totalPage);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setIsArticleLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [currentPage, sortOrder, perPage, category])

  const handleChangePage = (p) => {
    if(p == 'prev') {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleChangeFilter = (e) => {
    const id = e.target.id
    const value = e.target.value;
    if(id == 'perPage') {
      setPerPage(value)
    } else if (id == 'sort') {
      setSortOrder(value);
    } else if (id == 'category') {
      setCategory(value);
    } else {
      return;
    }
  };

  return (
    <div className='relative'>
        <Navbar />
        <div className='flex w-full justify-center'>
          <ServiceValidator width = 'w-fit' />
        </div>
        <div className='flex flex-row justify-between items-end py-5'>
          <SectionTitle>BERITA DESA MAPPETAJANG</SectionTitle>
          <div className='flex justify-end px-16 gap-x-5'>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Kategori</legend>
              <select onChange={handleChangeFilter} id='category' defaultValue="" className="select">
                <option value="" disabled={true}>Kategori</option>
                <option value="">Semua</option>
                <option>Berita</option>
                <option>Pengumuman</option>
              </select>
            </fieldset>
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
        <div className='mx-16 py-3'>
          <CardContainer align = 'flex-col' withBorder = {true} px = 'px-0'>
              {
                newsList.length > 1 ? newsList.map((item, i) => (
                  <div key = {i} className='z-20'>
                    <ArticleCard fromNewsPage = {true} article = {item} horizontal = {true} isLast = {i == newsList.length - 1 ? true : false} />
                  </div>
                )) : <div className='min-h-40 flex flex-col gap-y-2 justify-center items-center'>
                  <Paragraph>Gagal mendapatkan data berita</Paragraph>
                  <button onClick={()=> loadData()} className='btn'>Muat Ulang</button>
                </div>}
              <LoadingComponent isLoading = {isArticleLoading} />
          </CardContainer>
        </div>
        <Pagination totalPage = {totalPage} currentPage ={currentPage} onChangePage = {handleChangePage} />
        <Footer />
    </div>
  )
}

export default NewsPage