import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Index'
import Hero from '../components/Hero/Index'
import Footer from '../components/Footer/Index'
import ArticleCard from '../components/ArticleCard/Index'
import CardContainer from '../fragments/CardContainer/Index'
import Stats from '../components/Stats/Index'
import SectionTitle from '../components/SectionTitle/Index'
import Paragraph from '../components/Paragraph'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Loading } from '../../contexts/LoadingContext'
import ServiceValidator from '../fragments/ServiceValidator/Index'
import ChartComponent from '../components/Chart/Index'
import { Observer } from 'tailwindcss-intersect';
import MapComponent from '../components/Map/Index'
import Header from '../components/Header'

const HomePage = () => {
  const [newsList, setNewsList] = useState([]);
  const {setIsPageLoading} = useContext(Loading);
  const [populationData, setPopulationData] = useState({});
  const [filter, setFilter] = useState({});
  const [displayedMapId, setDisplayedMapId] = useState('');
  const [selectedMap, setSelectedMap] = useState({});
  const [mapBound, setMapBound] = useState([]);
  const [polygonList, setPolygonList] = useState([]);
  const [centerMap, setCenterMap] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [portalAsset, setPortalAsset] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/v1/residence/getstats`)
      .then(res => {
        const data = res.data.data;
        setPopulationData({male: data.totalMale, female: data.totalFemale, undefinedGender: data.totalUndefinedGender, familyCard: data.totalFamilyCard})
        setChartData([{name: 'Laki-laki', total: data.totalMale}, {name: 'Perempuan', total: data.totalFemale}, {name: 'Kartu Keluarga', total: data.totalFamilyCard}, {name: 'Total Penduduk', total: data.totalMale + data.totalFemale}])
        
      })
      .catch(err => console.log(err));

    axios.get(`${apiUrl}/v1/asset/get/portal-asset`)
      .then(res => {
        const data = res.data.data;
        setPortalAsset(data);
      })
      .catch(err => console.log(err));

    axios.get(`${apiUrl}/v1/asset/get/map-id`)
      .then(res => {
        const data = res.data.data;
        const displayedMap = data.find(item => item.name.toLowerCase().includes('administrasi'));
        setDisplayedMapId(displayedMap.id);
      })
      .catch(err => console.log(err));

    axios.get(`${apiUrl}/v1/post/posts?perPage=4`)
      .then(res => {
        const data = res.data.data;
        setNewsList(data);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setIsPageLoading(false);
      }
    )
    Observer.start();
  }, []);

  useEffect(() => {
    if(!displayedMapId) return;

    axios.get(`${apiUrl}/v1/asset/get/map-data/${displayedMapId}`)
      .then(res => {
        const data = res.data.data;
        setSelectedMap(data);
      })
      .catch(err => console.log(err));
  }, [displayedMapId]);

  useEffect(() => {
    fetchGeojson();
  }, [selectedMap]);

  const fetchGeojson = async () => {
    const geojsonRes = await fetch(`${apiUrl}/${selectedMap?.geojson}`);
    const geoJson = await geojsonRes.json();
    const layerColor = selectedMap.color;
    const layerName = selectedMap.name;

    setGeoJsonData({...geoJson, color: layerColor, name: layerName});

  };

  useEffect(() => {
    if(!geoJsonData) {
      return;
    };

    const color = geoJsonData.color;
    const name = geoJsonData.name;
    const allLatLngs = [];
    
    const updatedFeatures = geoJsonData.features?.map(feature => {
      const { geometry, properties, type } = feature;

      if (!geometry) return feature;

      let updatedGeometry = { ...geometry };

      updatedGeometry.coordinates = geometry.coordinates.map(polygon =>
        polygon.map(ring =>
          ring.map(coord => {
            const [lng, lat] = coord;
            allLatLngs.push([lat, lng]);
            return [lat, lng];
          })
        )
      );
      return {
          type,
          geometry: updatedGeometry,
          properties,
          color,
          name,
        };
      })
      if (allLatLngs.length === 0) return;
      const bounds = L.latLngBounds(allLatLngs);
      setMapBound([
        [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
        [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
      ]);
      setCenterMap([bounds.getCenter().lat, bounds.getCenter().lng]);

      setPolygonList({
        type: 'FeatureCollection',
        features: updatedFeatures,
      });
  }, [geoJsonData]);

  return (
    <div className='relative'>
      <Navbar />
      <Hero url={`${apiUrl}/${portalAsset?.hero?.replace(/\\/g, '/')}`} />
      <ServiceValidator width = 'w-fit' />
      <SectionTitle>SAMBUTAN KEPALA DESA MAPPETAJANG</SectionTitle>
      <div className='flex flex-col md:flex-row w-full items-center px-16 pt-5 pb-20 gap-x-10 gap-y-3'>
        <div
          className='md:w-1/3 max-w-sm px-10 items-center justify-center flex bg-center bg-cover intersect:motion-preset-blur-right-md motion-delay-200 intersect-once'>
            <img src={`${apiUrl}/${portalAsset.chiefImage}`} alt="" />
        </div>
        <div className='md:w-2/3 w-full flex flex-col justify-center md:items-start items-center px-5 md:pl-0 md:pr-20 text-pretty gap-y-1 intersect:motion-preset-blur-left-md motion-delay-200 intersect-once'>
          {portalAsset?.greet?.split(/\r\n|\n/).map((line, index) => (
            <p key={index} className="font-normal font-roboto text-sm md:text-base w-full text-start">
              {line}
            </p>
          ))}
          <p className='text-xl md:text-3xl font-roboto font-semibold'>{portalAsset?.chiefName}</p>
          <p className='text-lg md:text-2xl font-roboto font-normal'>Kepala Desa Mappetajang</p>
        </div>
      </div>
      <div className='flex flex-col items-center gap-y-3 bg-gradient-to-b from-slate-950 to-slate-900 px-16 py-10 relative h-full'>
        <Header color = 'text-slate-200' size = 'text-3xl'>Akses Layanan Jauh Lebih Mudah</Header>
        <Paragraph color = 'text-slate-200'>Anda dapat mengakses berbagai layanan dan mengirimkan keluhan dengan mudah melalui Portal Desa Mappetajang</Paragraph>
        <div className='flex flex-row justify-center gap-x-3'>
          <Link to = 'services'>
            <button className='btn bg-slate-500 hover:bg-slate-700 text-slate-100'>Layanan</button>
          </Link>
          <Link to = 'services'>
            <button className='btn bg-slate-500 hover:bg-slate-700 text-slate-100'>Keluhan</button>
          </Link>
        </div>
        <div className='relative flex justify-center pb-8 md:pb-20'>
          {populationData ? (
            <div className='absolute'>
              <Stats isSmall = {false} data = {populationData} />
            </div>
          ) : <></>}
        </div>
      </div>
      {populationData && (
        <div className='pt-24'>
          <div className='flex flex-col md:flex-row w-full items-center justify-center py-5 px-16'>
            <div className='flex-1 flex flex-col gap-y-3'>
              <Header size = 'text-xl' weight = 'font-semibold'>Statistik Kependudukan Desa Mappetajang</Header>
              <Paragraph>Anda dapat melihat statistik penduduk Desa Mappetajang yang terus diperbarui melalui Portal Desa Mappetajang. </Paragraph>
              <Link to='profile'><button className='btn btn-neutral'>Selengkapnya</button></Link>
              {/* <img src="/images/statistics.svg"className='h-fit' alt="" /> */}
            </div>
            <div className='w-2/3 flex items-center flex-col'>
              <ChartComponent data = {chartData} filter = {filter} />
            </div>
          </div>
        </div>
      )}
      <div className='w-full items-center flex flex-col py-5 mb-5 bg-gradient-to-b from-slate-950 to-slate-900'>
      <SectionTitle isHomePage= {true} px = 'self-start px-16'>PETA DESA MAPPETAJANG</SectionTitle>
        <div className='py-5 px-5 w-[80%] h-[100vh] border bg-white border-black/50 shadow-lg flex flex-col justify-between relative'>
          {geoJsonData && centerMap.length == 2 ? (
              <MapComponent mapBound={mapBound} center = {centerMap} zoom = {12} data = {polygonList.features} style = {{height: "100%", width: "100%"}} displayLegend = {false} />) : <></>}
        </div>
      </div>
      <SectionTitle>BERITA DESA MAPPETAJANG</SectionTitle>
      <CardContainer>
        {newsList.length && newsList.map((item, i) => (
          <ArticleCard key = {i} article = {item} isLast = {i == newsList.length - 1 ? true : false} />
        ))}
      </CardContainer>
      <div className='flex flex-row justify-end px-16 mb-5'>
        <Paragraph otherClass = 'underline cursor-pointer'><Link to = '/news'>Berita Lainnya...</Link></Paragraph>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage