import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Index';
import SectionTitle from '../components/SectionTitle/Index';
import Footer from '../components/Footer/Index';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Paragraph from '../components/Paragraph';
import Header from '../components/Header';
import { Loading } from '../../contexts/LoadingContext';
import CardContainer from '../fragments/CardContainer/Index';
import ArticleCard from '../components/ArticleCard/Index';
import { dateConvert } from '../utilities/dateConvert';
import useMediaQuery from '../utilities/useMediaQuery';

const NewsDetailsPage = () => {
    const [article, setArticle] = useState({});
    const [otherArticle, setOtherArticle] = useState([]);
    const [villageDetail, setVillageDetail] = useState({phone: '', address: ''});
    const params = useParams();
    const postId = params.postId;
    const {setIsPageLoading} = useContext(Loading);
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
      setIsPageLoading(true)
      axios.get(`${apiUrl}/v1/post/post/${postId}`)
        .then(res => {
          const data = res.data.data;
          setArticle(data);
        })
        .catch(err => console.log(err))
        .finally(() => {
          setIsPageLoading(false);
        })
    }, [postId]);

    useEffect(() => {
      axios.get(`${apiUrl}/v1/post/posts?exclude=${postId}&perPage=4`)
        .then(res => {
          const data = res.data.data;
          setOtherArticle(data);
        })
        .catch(err => console.log(err))
    }, [article]);

    useEffect(()=> {
      axios.get(`${apiUrl}/v1/asset/get/portal-asset`)
        .then(res => {
          const data = res.data.data;
          setVillageDetail({phone: data.phone, address: data.address});
        })
        .catch(err => {
          console.log(err);
        });
    }, []);

    const articleDate = article ? dateConvert(article?.updatedAt) : '';
  return (
    <>
      <div className='relative'>
          <Navbar />
          <SectionTitle>BERITA DESA MAPPETAJANG</SectionTitle>
          <div className='flex flex-col lg:flex-row px-5 py-10 gap-x-3 w-full'>
            <div className='flex flex-col gap-y-5 items-center px-5 w-full lg:w-3/4'>
              <div className='flex flex-col w-full relative bg-slate-500'>
                <div className='h-full w-full flex justify-center'>
                  <div className='absolute h-full w-full bg-black opacity-30 z-40'></div>
                  <img className='h-80' src={`${apiUrl}/${article.image}`} alt="" />
                  <div className='px-20 py-5 absolute left-0 bottom-0 flex flex-row gap-x-3 z-50'>
                    <Header size ='text-xl' color = 'text-white'>{article.title}</Header>
                    <div className='px-2 py-1 bg-blue-400 rounded-sm'>
                      <Paragraph size = 'text-sm' color = 'text-white' weight = 'font-medium'>{article.category}</Paragraph>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col w-full px-5 gap-y-3'>
                {article?.desc?.blocks && article?.desc?.blocks.map((item) => {
                  if(item.type === 'header') {
                    return (<Header size = 'text-xl'>{item.data.text}</Header>)
                  } else if (item.type === 'paragraph') {
                    return (<Paragraph>{item.data.text}</Paragraph>)
                  } else if (item.type === 'image') {
                    return (<img className='max-w-[50%] self-center' src={item.data.file.url} alt=""/>)
                  } else if (item.type === 'list') {
                    if (item.data.style === 'ordered') {
                      const list = item.data.items;
                      return (
                        <ol className='list-decimal list-inside'>
                          {list.map((li, i) => (
                            <li key={i} className='font-roboto text-sm font-light'>{li.content}</li>
                          ))}
                        </ol>
                      )
                    } else {
                      const list = item.data.items;
                      return (
                        <ul className='list-disc list-inside'>
                          {list.map((li, i) => (
                            <li key={i} className='font-roboto text-sm font-light'>{li.content}</li>
                          ))}
                        </ul>
                      )
                    }
                  } else {
                    return (<></>)
                  }
                })}
              </div>
              <div className='mt-4 flex flex-col px-5 gap-y-3 self-start'>
                <Paragraph weight = 'font-medium'>Portal Desa Mappetajang</Paragraph>
                <Paragraph weight = 'font-light'>Alamat: {villageDetail.address}</Paragraph>
                <Paragraph weight = 'font-light'>Nomor Telepon: {villageDetail.phone}</Paragraph>
                <div className='flex flex-row gap-x-3 items-center'>
                  <div className="avatar avatar-placeholder">
                    <div className="bg-slate-500 text-neutral-content w-12 rounded-xl">
                      <span>
                        {article.author?.split(' ').map(word => word[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <Paragraph>Diposting oleh: {article.author}</Paragraph>
                    <Paragraph>Tanggal: {articleDate}</Paragraph>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col flex-1'>
              <SectionTitle px = 'px-5'>BERITA LAINNYA</SectionTitle>
              <CardContainer px = 'px-5' align = 'flex-row lg:flex-col'>
                {otherArticle.length && otherArticle.map((item, i) => (
                  <ArticleCard key = {i} article = {item} horizontal = {isLargeScreen} isLast = {i == otherArticle.length - 1 ? true : false} isOtherArticle={true} />
                ))}
              </CardContainer>
            </div>
          </div>
          <Footer />
      </div>
    </>
  )
}

export default NewsDetailsPage