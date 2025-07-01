import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

export const MapLegend = (props) => {
    const {data} = props;
  const map = useMap();

  console.log(data)

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend bg-white p-2 rounded-sm');
      const legendItems = data
        ?.map(item => {
          const color = item.color || 'gray';  // fallback if color is missing
          const name = item.name || 'Unknown';
          return  `
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <div style="background: ${color}; width: 18px; height: 18px; display: inline-block; margin-right: 6px;"></div>
                <span>${name}</span>
            </div>
        `;
        })
        .join('');
      div.innerHTML = `
        <p>Keterangan</p>${legendItems}
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};
