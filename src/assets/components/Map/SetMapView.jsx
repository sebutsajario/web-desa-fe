import React, { useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

const SetMapView = ({ coords, bound, setZoomLevel }) => {
  const map = useMap();

  // Set panes once
  useEffect(() => {
    map.createPane('lowest');
    map.getPane('lowest').style.zIndex = 300;

    map.createPane('middle');
    map.getPane('middle').style.zIndex = 400;

    map.createPane('topmost');
    map.getPane('topmost').style.zIndex = 500;
  }, [map]);

  // Set initial view or bounds only when they change
  useEffect(() => {
    if (bound) {
      map.fitBounds(bound);
    } else if (coords) {
      map.setView(coords);
    }
  }, [JSON.stringify(bound), JSON.stringify(coords)]);

  // Track zoom changes
  useMapEvents({
    zoomend: (e) => {
      setZoomLevel(e.target.getZoom());
    }
  });

  return null;
};

export default SetMapView;
