import { useEffect, useRef, useState } from 'react';
import { MAPBOX_API_KEY } from '../../common/external-api-constants';
import mapboxgl from 'mapbox-gl';
import './EventMap.css';
import PropTypes from 'prop-types';

mapboxgl.accessToken = MAPBOX_API_KEY;

function EventMap({ event }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const popup = useRef(null);

  const [loading, setLoading] = useState(true);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState((9));

  useEffect(() => {
    if (!event || !event.longitude || !event.latitude) {
      return;
    }

    if (!map.current) {
      setLng(event.longitude);
      setLat(event.latitude);

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/dianaspieser/clcz2g75y002m14mt30uwqjxy',
        center: [event.longitude, event.latitude],
        zoom: zoom,
      });

      marker.current = new mapboxgl.Marker()
        .setLngLat([event.longitude, event.latitude])
        .addTo(map.current);

      popup.current = new mapboxgl.Popup({ offset: [0, -30] })
        .setHTML(
          `<h3>${event.title}</h3>
        <img src="${event.photoUrl}" alt="Event Photo" style="max-width: 100%; height: auto;">`
        )
        .setMaxWidth('300px');

      marker.current.setPopup(popup.current);

      map.current.on('load', () => {

        const targetZoom = 16;
        const zoomInterval = setInterval(() => {
          if (map.current.getZoom() < targetZoom) {
            map.current.zoomTo(map.current.getZoom() + 1,5);
          } else {
            setLoading(false);
            clearInterval(zoomInterval);
          }
        }, 50);
      });

      map.current.addControl(new mapboxgl.NavigationControl());
      map.current.addControl(new mapboxgl.FullscreenControl());
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );

      map.current.addControl(
        // eslint-disable-next-line no-undef
        new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          unit: 'metric',
          profile: 'mapbox/driving-traffic',
          destination: [event.longitude, event.latitude],
        }),
        'top-left'
      );

      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showAccuracyCircle: false,
        })
      );

      return () => {
        map.current.off('move');
      };
    }
  }, [event, zoom]);

  useEffect(() => {
    if (!map.current) return;
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div className='App'>
      <div className='sidebar'>
        {loading
          ? 'Loading map...'
          : lat &&
            lng && (
            <>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </>
          )}
      </div>
      <div ref={ mapContainer } className='map-container' />
    </div>
  );
}

export default EventMap;

EventMap.propTypes = {
  event: PropTypes.object,
};
