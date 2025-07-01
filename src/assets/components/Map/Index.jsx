import React, { useState } from 'react'
import { MapContainer, Marker, Polygon, Polyline, TileLayer, Tooltip } from 'react-leaflet';
import Paragraph from '../Paragraph';
import SetMapView from './SetMapView';
import { MapLegend } from './Legend';
import L from 'leaflet';
import polylabel from '@mapbox/polylabel';

const MapComponent = (props) => {
  const {data, center, mapBound, style = {height: '100vh', width: '100%'}, zoom, legendData, displayLegend = true} = props;
  const [zoomLevel, setZoomLevel] = useState(10);
  const mapUrl = import.meta.env.VITE_MAP_URL;

    const renderedValue = 
      {
        home: [
          {
            key: 'Nama Kepala Keluarga: ',
            value: 'Nama_KK'
          },
          {
            key: 'Jenis Kelamin: ',
            value: 'Jenis_Kela',
          },
          {
            key: 'Dusun: ',
            value: 'Dusun',
          },
          {
            key: 'No Rumah: ',
            value: 'No_Rumah',
          },
          {
            key: 'Kondisi Bangunan: ',
            value: 'Jenis_Bang',
          },
          {
            key: 'Luas Bangunan: ',
            value: 'Shape_Area',
          },
        ],
        facility: [
          {
            key: 'Jenis Bangunan: ',
            value: 'KETERANGAN'
          },
          {
            key: 'Luas Bangunan: ',
            value: 'Shape_Area',
          },
        ],

      }

    const getPolygonCentroid = (geometry) => {
      const polygonCoords = geometry.coordinates[0][0];
      const labelPoint = polylabel([polygonCoords], 0); // precision = 1.0
      return [labelPoint[0], labelPoint[1]]; 
    };

    return (
      <>
          <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={style}>
              <TileLayer
                attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; contributors'
                url={mapUrl}
              />
              <SetMapView coords={center} bound = {mapBound} setZoomLevel={setZoomLevel} />
              {displayLegend ? <MapLegend data = {legendData} /> : <></>}
              {
                data ? data.map((data, i) => {
                  const imageBlob = data?.properties?.imageUrl;
                  const hasImage = imageBlob instanceof Blob;
                  const name = data.name.toLowerCase();
                  const pane = name.includes('batas') ? 'lowest' : name.includes('jalan') ? 'middle' : 'topmost';
                  const fontSize = Math.max(8, zoomLevel * 1);

                  const url = hasImage ? URL.createObjectURL(imageBlob) : null;
                  if (data.geometry.type === 'MultiPolygon') {
                    const borderStyle = name.includes('batas') ? '4,4' : '';
                    const getCategoryKey = (name) => {
                      if (name.includes('rumah')) return 'home';
                      if (name.includes('fasilitas')) return 'facility';
                    };

                    const key = getCategoryKey(name);
                    const tooltipFields = renderedValue[key];
                    return (
                      <Polygon dashArray={borderStyle} positions={data.geometry.coordinates} pathOptions={{color: data.color}} pane={pane}>
                        {name.includes('batas') ? (
                          <Marker key={zoomLevel} 
                            position={getPolygonCentroid(data.geometry)}
                            icon={L.divIcon({
                              className: `polygon-label font-bold text-white text-stroke`,
                              html: `<div style="font-size: ${fontSize}px;">${data.properties.DUSUN || 'Label'}</div>`,
                            })}
                            interactive={false} // makes it non-clickable
                          />
                        ) : (
                          <Tooltip>
                            <div key={i} className="flex flex-col gap-y-1">
                              {tooltipFields?.map((item, i) => (
                                <div key={i} className="flex flex-row gap-x-2">
                                  <Paragraph weight="font-semibold">{item.key}</Paragraph>
                                  <Paragraph>{item.value == 'Shape_Area' ? `${Number(data.properties[item.value]).toFixed(2)} m²` : data.properties[item.value]}</Paragraph>
                                </div>
                              ))}
                              <img className='max-h-40 object-cover' src={url} alt="" />
                            </div>
                          </Tooltip>
                        )}
                      </Polygon>

                    );
                  } else if (data.geometry.type === 'MultiLineString') {
                    return (
                      <>
                        <Polyline positions={data.geometry.coordinates} pathOptions={{color: data.color, weight: 2}} pane={pane} >
                          <Tooltip sticky>
                              <div key={i} className="flex flex-col gap-y-1">
                                {/* <div className="flex flex-row gap-x-2">
                                  <Paragraph weight="font-semibold">ID:</Paragraph>
                                  <Paragraph>{data.properties.REL_OBJECTID}</Paragraph>
                                </div> */}
                                <div className="flex flex-row gap-x-2">
                                  <Paragraph weight="font-semibold">Fungsi Jalan:</Paragraph>
                                  <Paragraph>{data.properties.Fungsi_Jal}</Paragraph>
                                </div>
                                {data.properties.PANJANG !== 0 ? (
                                  <div className="flex flex-row gap-x-2">
                                    <Paragraph weight="font-semibold">Panjang Jalan:</Paragraph>
                                    <Paragraph>{`${Number(data.properties.PANJANG).toFixed(2)} meter`}</Paragraph>
                                  </div>
                                ) : <></>}
                                <div className="flex flex-row gap-x-2">
                                  <Paragraph weight="font-semibold">Jenis Jalan:</Paragraph>
                                  <Paragraph>{data.properties.JALAN}</Paragraph>
                                </div>
                                <img className='max-h-40 object-cover' src={url} alt="" />
                              </div>
                          </Tooltip>
                        </Polyline>
                      </>
                    )
                  }
                  return null;
                }) : null
                
              }
            </MapContainer>
      </>
    )
}

export default MapComponent