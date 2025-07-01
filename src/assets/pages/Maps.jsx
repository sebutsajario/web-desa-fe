import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Index'
import Footer from '../components/Footer/Index'
import SectionTitle from '../components/SectionTitle/Index'
import MapComponent from '../components/Map/Index'
import { Loading } from '../../contexts/LoadingContext'
import Papa from 'papaparse'
import ServiceValidator from '../fragments/ServiceValidator/Index'
import axios from 'axios'
import Paragraph from '../components/Paragraph'
import LoadingComponent from '../fragments/LoadingComponent/Index'

const MapsPage = () => {
  const [geoJsonData, setGeoJsonData] = useState([]);
  const [polygonList, setPolygonList] = useState([]);
  const [centerMap, setCenterMap] = useState([]);
  const [mapToChange, setMapToChange] = useState('');
  const [displayedMap, setDisplayedMap] = useState([]);
  const [mapIdList, setMapIdList] = useState([]);
  const [mapDatas, setMapDatas] = useState([]);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapBound, setMapBound] = useState([]);
  const {setIsPageLoading} = useContext(Loading);
  const apiUrl = import.meta.env.VITE_API_URL;

  function hexToBlob(hexString, contentType) {
    const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return new Blob([bytes], { type: contentType });
  };

  const fetchGeojson = async (id) => {
    const index = mapDatas?.findIndex(item => item.id == id);

    if (index === -1) {
      setGeoJsonData(prev => {
        const filtered = prev.filter(data => data.id !== id);
        return filtered;
      });
      setIsMapLoading(false);
      return;
    };

    setIsMapLoading(true); 
    try {
      if(mapDatas.length < 1) {
        return;
      }
      const mapId = mapDatas[index].id;

      const geojsonRes = await fetch(`${apiUrl}/${mapDatas[index]?.geojson}`);
      const csvRes = await fetch(`${apiUrl}/${mapDatas[index]?.csv}`);
      const geoJson = await geojsonRes.json();
      const csvText = await csvRes.text();
      const layerColor = mapDatas[index]?.color;
      const layerName = mapDatas[index]?.name;

      const { data: csvData } = Papa.parse(csvText, { header: true });

      const enhancedFeatures = geoJson.features.map(feature => {

      const relId = feature?.id || feature?.properties?.OBJECTID;

      const attr = csvData.find(row => row.REL_OBJECTID == relId);
      if (attr) {
        // Attach all CSV attributes to properties
        feature.properties = {
          ...feature.properties,
          ...attr,
        };

        // Convert hex image data to Blob URL and add to properties.imageUrl
        if (attr.DATA && attr.CONTENT_TYPE) {
          feature.properties.imageUrl = hexToBlob(attr.DATA, attr.CONTENT_TYPE);
            }
          }
          return feature;
        });
        const enhancedGeoJson = {
          ...geoJson,
          id: mapId,
          color: layerColor,
          name: layerName,
          features: enhancedFeatures,
        };

        setGeoJsonData(data => ([...data, enhancedGeoJson]));
        
    } catch (err) {
      console.log(err)
    } finally {
      setIsMapLoading(false);
    };
      
  };

  const loadData = (id) => {
    if(mapDatas.length === 0) {
      setIsMapLoading(false);
      return;
    };
    if(!id) return;
    fetchGeojson(id);
    setMapToChange('');
    return () => {
      if (geoJsonData?.features) {
        geoJsonData.features.forEach(f => {
          if (f.properties?.imageUrl) {
            URL.revokeObjectURL(f.properties.imageUrl);
          }
        });
      }
    };
  };

  const getIdList = () => {
    setIsMapLoading(true);
    axios.get(`${apiUrl}/v1/asset/get/map-id`)
      .then(res => {
        const data = res.data.data;
        setMapIdList(data);
      })
      .catch(err => {
        {
          console.log(err);
          setIsMapLoading(false);
        };
      })
      .finally(() => {
        setIsPageLoading(false);
    });
  }

  useEffect(() => {
    getIdList();
  }, []);

  useEffect(() => {
    if(mapIdList.length === 0) {
      return;
    };
    const defaultId = mapIdList[0]?.id
    getMap(defaultId);
    setDisplayedMap([mapIdList[0]?.id]);
  }, [mapIdList]);

  const getMap = (id) => {
    if(!id) return;
    setMapToChange(id);
    const isExist = mapDatas.some(item => item.id == id);
    if(!isExist) {
      axios.get(`${apiUrl}/v1/asset/get/map-data/${id}`)
      .then(res => {
          const data = res.data.data;
          setMapDatas(prev => ([...prev, data]));
          console.log(data)
        })
        .catch(err => console.log(err))
    } else {
      const filteredData = mapDatas.filter(item => item.id !== id);
      setMapDatas(filteredData);
    };
  };

  useEffect(() => {
    if(mapToChange) {
      loadData(mapToChange);
    }
  }, [mapDatas]);


  useEffect(() => {
    if (!geoJsonData) return;

    const allLatLngs = [];

    const updatedFeatures = geoJsonData?.flatMap(geojson => {
      const color = geojson.color;
      const name = geojson.name;

      return geojson.features?.map(feature => {
        const { geometry, properties, type } = feature;

        if (!geometry) return feature;

        let updatedGeometry = { ...geometry };

        if (geometry.type === 'MultiPolygon') {
          updatedGeometry.coordinates = geometry.coordinates.map(polygon =>
            polygon.map(ring =>
              ring.map(coord => {
                const [lng, lat] = coord;
                allLatLngs.push([lat, lng]);
                return [lat, lng];
              })
            )
          );
        } else if (geometry.type === 'Point') {
          const [lng, lat] = geometry.coordinates;
          allLatLngs.push([lat, lng]);
          updatedGeometry.coordinates = [lat, lng];
        } else if (geometry.type === 'MultiLineString') {
          updatedGeometry.coordinates = geometry.coordinates.map(line =>
            line.map(coord => {
              const [lng, lat] = coord;
              allLatLngs.push([lat, lng]);
              return [lat, lng];
            })
          );
        }

        return {
          type,
          geometry: updatedGeometry,
          properties,
          color,
          name,
        };
      });
    }) || [];


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

  const handleChangeMap = (e) => {
    const id = e.target.value;
    setDisplayedMap(prev => {
        
        const isDisplayed = prev.includes(id);
        
        // Case: it's the only one — do nothing
        if (isDisplayed && prev.length === 1) {
          return prev;
        }
        
        // Case: already in list, remove it
        if (isDisplayed) {
          return prev.filter(item => item !== id);
        };
        
        // Case: not in list, add it
        return [...prev, id];
      });
      getMap(id);
  };

  return (
    <>
      {
        <div className='relative h-screen'>
            <Navbar />
            <div className='flex w-full justify-center'>
              <ServiceValidator width = 'w-fit' />
            </div>
            <SectionTitle>PETA DESA</SectionTitle>
            <div className='w-full items-center flex flex-col mb-5'>
                <div className='py-5 px-5 w-[80%] h-[100vh] md:h-[150vh] border border-black/50 shadow-lg flex flex-col justify-between relative'>
                    <div className='h-[10%] flex justify-center'>
                        {mapIdList?.length > 0 ? (
                          <>
                            <div className='flex flex-row justify-center gap-x-5 p-2'>
                              {mapIdList && mapIdList.map((item, i) => (
                                <div key={i} className='flex flex-row gap-x-1 items-center'>
                                  <input onChange={handleChangeMap} value={item.id} type="checkbox" checked={displayedMap.includes(item.id)} className="checkbox checkbox-neutral" />
                                  <Paragraph size = 'text-xs'>{item.name}</Paragraph>
                                </div>
                              ))}
                              </div>
                          </>
                        ) : <></>}
                    </div>
                    {!isMapLoading && geoJsonData && centerMap.length == 2 ? (
                        <MapComponent mapBound={mapBound} center = {centerMap} zoom = {12} data = {polygonList.features} style = {{height: "100%", width: "100%"}} legendData = {geoJsonData} />
                    ) : !isMapLoading ?
                      <div className='flex flex-col gap-y-2 w-full h-full justify-center items-center'>
                        <Paragraph>Gagal Mendapatkan Data</Paragraph>
                        <button onClick={getIdList} className='btn btn-neutral'>Muat Ulang</button>
                      </div>
                    : <><LoadingComponent isLoading = {isMapLoading}></LoadingComponent></>}
                </div>
            </div>
            <Footer />
        </div>
      }
    </>
  )
}

export default MapsPage