import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function SearchField() {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({ provider: provider, style: 'bar', showMarker: false, retainZoomLevel: false });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
}

function LocationMarker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition(e.latlng); } });
  return position === null ? null : (
    <Marker position={position}>
      <Popup className="font-bold text-red-600">Disaster Epicenter:<br/>Lat: {position.lat.toFixed(4)}<br/>Lng: {position.lng.toFixed(4)}</Popup>
    </Marker>
  );
}

export default function EmergencyMap({ position, setPosition }) {
  return (
    <MapContainer center={[17.6868, 83.2185]} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <SearchField />
      <LocationMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}