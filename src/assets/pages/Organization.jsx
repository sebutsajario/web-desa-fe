import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Index'
import SectionTitle from '../components/SectionTitle/Index'
import CardContainer from '../fragments/CardContainer/Index'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Footer from '../components/Footer/Index'
import { Loading } from '../../contexts/LoadingContext'
import ServiceValidator from '../fragments/ServiceValidator/Index'
import axios from 'axios'
import useMediaQuery from '../utilities/useMediaQuery'

const OrganizationPage = () => {
  const {isPageLoading, setIsPageLoading} = useContext(Loading);
  const [governmentList, setGovernmentList] = useState([]);
  const [visionMission, setVisionMission] = useState({});
  const isMediumScreen = useMediaQuery('(min-width: 768px)');
  const isSmallScreen = useMediaQuery('(min-width: 640px)');
  const apiUrl = import.meta.env.VITE_API_URL;

      useEffect(() => {
        axios.get(`${apiUrl}/v1/asset/get/government`)
          .then(res => {
            console.log(res);
            const data = res.data.data;
            setGovernmentList(data.governmentData);
            setVisionMission(data.visionMission);
          })
          .catch(err => console.log(err))
          .finally(() => {
            setIsPageLoading(false);
          });
      }, []);
  return (
    <div className='relative'>
        <Navbar />
        <div className='flex w-full justify-center'>
          <ServiceValidator width = 'w-fit' />
        </div>
        <SectionTitle>VISI DAN MISI DESA MAPPATAJANG</SectionTitle>
        <div className='flex flex-col w-full px-16 py-5 gap-y-3 items-center text-start'>
          {visionMission?.blocks && visionMission?.blocks.map((item) => {
            if(item.type === 'header') {
              return (<p className='font-roboto font-extrabold text-black text-xl' dangerouslySetInnerHTML={{ __html: item.data.text }}></p>)
            } else if (item.type === 'paragraph') {
              return (<p className='font-roboto text-lg text-black font-normal' dangerouslySetInnerHTML={{ __html: item.data.text }}></p>)
            } else if (item.type === 'image') {
              return (<img className='max-w-[50%] self-center' src={item.data.file.url} alt=""/>)
            } else if (item.type === 'list') {
              if (item.data.style === 'ordered') {
                const list = item.data.items;
                return (
                  <ol className='list-decimal list-inside'>
                    {list.map((li, i) => (
                      <li key={i} className='font-roboto text-sm font-light mb-2' dangerouslySetInnerHTML={{ __html: item.data.text }}>{li.content}</li>
                    ))}
                  </ol>
                )
              } else {
                const list = item.data.items;
                return (
                  <ul className='list-disc list-inside'>
                    {list.map((li, i) => (
                      <li key={i} className='font-roboto text-sm font-light mb-2' dangerouslySetInnerHTML={{ __html: item.data.text }}>{li.content}</li>
                    ))}
                  </ul>
                )
              }
            } else {
              return (<></>)
            }
          })}
        </div>
        <SectionTitle>PEMERINTAH DESA</SectionTitle>
        <div className='px-16'>
          {governmentList.length > 1 && (
            <>
              <div className='flex flex-col items-center gap-y-2 py-2'>
                <div className="avatar">
                    <div className="w-32 md:w-48 rounded">
                        {governmentList[0].image ? (
                          <img src={`${apiUrl}/${governmentList[0].image}`} />
                        ) : (
                          <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M512,512l-512,0c0,-108.606 2.909,-138.303 8.727,-153.819c2.909,-4.121 7.091,-8.181 12.546,-12.181c5.454,-4 12.606,-7.94 21.454,-11.819c8.849,-3.878 16.909,-7.212 24.182,-10c7.273,-2.787 17.212,-6.484 29.818,-11.09c12.606,-4.607 22.546,-8.243 29.818,-10.91c6.303,-2.424 12.425,-5.212 18.364,-8.363c5.939,-3.152 9.758,-5.091 11.455,-5.818c1.697,2.181 3.272,13.515 4.727,34c1.454,20.484 3.515,43.818 6.182,70c2.666,26.181 5.939,45.818 9.818,58.909c1.697,5.818 5.273,10.363 10.727,13.636c5.455,3.273 10.606,5.515 15.455,6.727c4.848,1.212 7.394,2.182 7.636,2.909c0.243,-0.969 2.727,-12.969 7.455,-36c4.727,-23.03 9.151,-43.393 13.272,-61.09c1.775,-7.621 3.37,-15.905 4.785,-23.255c1.421,-7.379 2.66,-13.817 3.718,-17.697l-32.139,-32.139l48,-32l48,32l-31.955,31.955c6.302,16.342 16.024,63.881 29.165,128.142c0.679,3.318 1.366,6.68 2.063,10.084c0.242,-0.727 2.788,-1.697 7.636,-2.909c4.849,-1.212 10,-3.454 15.455,-6.727c5.454,-3.273 9.03,-7.818 10.727,-13.636c3.879,-13.091 6.97,-32.728 9.273,-58.909c2.303,-26.182 4,-49.516 5.091,-70c1.09,-20.485 2.484,-31.819 4.181,-34c1.697,0.727 5.516,2.666 11.455,5.818c5.939,3.151 12.061,5.939 18.364,8.363c7.272,2.667 17.212,6.303 29.818,10.91c12.606,4.606 22.545,8.303 29.818,11.09c7.273,2.788 15.333,6.122 24.182,10c8.848,3.879 16,7.819 21.454,11.819c5.455,4 9.637,8.06 12.546,12.181c3.151,9.697 5.394,36.364 6.727,80c0.47,15.374 0.857,25.707 1.161,33.831l0,0.002c0.558,14.906 0.838,22.373 0.839,39.986Zm-256,-256c-70.692,0 -128,-57.308 -128,-128c0,-70.692 57.308,-128 128,-128c70.692,0 128,57.308 128,128c0,70.692 -57.308,128 -128,128Zm108.8,-127.2c-10.4,2.133 -25.267,1.133 -44.6,-3c-19.333,-4.134 -35.667,-9 -49,-14.6c-9.067,-4 -17.733,-8.6 -26,-13.8c-8.267,-5.2 -17.733,-11.734 -28.4,-19.6c-10.667,-7.867 -18.933,-13.667 -24.8,-17.4c4.267,31.733 -10.667,54.4 -44.8,68c0.267,30.133 11,55.733 32.2,76.8c21.2,21.066 46.733,31.6 76.6,31.6c29.867,0 55.4,-10.534 76.6,-31.6c21.2,-21.067 31.933,-46.533 32.2,-76.4Z"></path></g></svg>
                        )}
                    </div>
                </div>
                <Header size = 'text-2xl'>{governmentList[0].name}</Header>
                <Paragraph size = 'text-lg'>{governmentList[0].role}</Paragraph>
              </div>
              <div className='divider'></div>
            </>
          )}
        </div>
        <div className='p-16 flex-wrap flex-row flex gap-x-5 justify-between'>
          {governmentList.length && governmentList.slice(1).map((item, i) => (
            <>
                <div className='flex flex-col w-1/3 sm:w-1/4 md:w-1/5 items-center gap-y-2 py-2 text-center'>
                    <div className="avatar">
                        <div className="w-32 md:w-48 rounded">
                            {item.image ? (
                              <img src={`${apiUrl}/${item.image}`} />
                            ) : (
                              <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M512,512l-512,0c0,-108.606 2.909,-138.303 8.727,-153.819c2.909,-4.121 7.091,-8.181 12.546,-12.181c5.454,-4 12.606,-7.94 21.454,-11.819c8.849,-3.878 16.909,-7.212 24.182,-10c7.273,-2.787 17.212,-6.484 29.818,-11.09c12.606,-4.607 22.546,-8.243 29.818,-10.91c6.303,-2.424 12.425,-5.212 18.364,-8.363c5.939,-3.152 9.758,-5.091 11.455,-5.818c1.697,2.181 3.272,13.515 4.727,34c1.454,20.484 3.515,43.818 6.182,70c2.666,26.181 5.939,45.818 9.818,58.909c1.697,5.818 5.273,10.363 10.727,13.636c5.455,3.273 10.606,5.515 15.455,6.727c4.848,1.212 7.394,2.182 7.636,2.909c0.243,-0.969 2.727,-12.969 7.455,-36c4.727,-23.03 9.151,-43.393 13.272,-61.09c1.775,-7.621 3.37,-15.905 4.785,-23.255c1.421,-7.379 2.66,-13.817 3.718,-17.697l-32.139,-32.139l48,-32l48,32l-31.955,31.955c6.302,16.342 16.024,63.881 29.165,128.142c0.679,3.318 1.366,6.68 2.063,10.084c0.242,-0.727 2.788,-1.697 7.636,-2.909c4.849,-1.212 10,-3.454 15.455,-6.727c5.454,-3.273 9.03,-7.818 10.727,-13.636c3.879,-13.091 6.97,-32.728 9.273,-58.909c2.303,-26.182 4,-49.516 5.091,-70c1.09,-20.485 2.484,-31.819 4.181,-34c1.697,0.727 5.516,2.666 11.455,5.818c5.939,3.151 12.061,5.939 18.364,8.363c7.272,2.667 17.212,6.303 29.818,10.91c12.606,4.606 22.545,8.303 29.818,11.09c7.273,2.788 15.333,6.122 24.182,10c8.848,3.879 16,7.819 21.454,11.819c5.455,4 9.637,8.06 12.546,12.181c3.151,9.697 5.394,36.364 6.727,80c0.47,15.374 0.857,25.707 1.161,33.831l0,0.002c0.558,14.906 0.838,22.373 0.839,39.986Zm-256,-256c-70.692,0 -128,-57.308 -128,-128c0,-70.692 57.308,-128 128,-128c70.692,0 128,57.308 128,128c0,70.692 -57.308,128 -128,128Zm108.8,-127.2c-10.4,2.133 -25.267,1.133 -44.6,-3c-19.333,-4.134 -35.667,-9 -49,-14.6c-9.067,-4 -17.733,-8.6 -26,-13.8c-8.267,-5.2 -17.733,-11.734 -28.4,-19.6c-10.667,-7.867 -18.933,-13.667 -24.8,-17.4c4.267,31.733 -10.667,54.4 -44.8,68c0.267,30.133 11,55.733 32.2,76.8c21.2,21.066 46.733,31.6 76.6,31.6c29.867,0 55.4,-10.534 76.6,-31.6c21.2,-21.067 31.933,-46.533 32.2,-76.4Z"></path></g></svg>
                            )}
                        </div>
                    </div>
                    <Header size = 'text-lg md:text-2xl'>{item.name}</Header>
                    <Paragraph size = 'text-base md:text-lg'>{item.role}</Paragraph>
                </div>
                {i !== governmentList.length -2 && (i + 1) % (isMediumScreen ? 4 : isSmallScreen ? 3 : 2) === 0 && <div className='w-full divider'></div>}
            </>
          ))}
        </div>
        <Footer />
    </div>
  )
}

export default OrganizationPage