import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Profile } from '../types/profile';
import { StaticImageData } from 'next/image';

// Fix for default marker icons in Leaflet with React
// This is needed because the default icons use relative paths that don't work in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface MapViewProps {
profile: Profile;
  height?: string;
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({ profile, height = '400px', zoom = 13 }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Initialize the default icon
    const DefaultIcon = L.icon({
      iconUrl: icon.src,
      shadowUrl: iconShadow.src,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  useEffect(() => {
    // Center map on profile location when profile changes
    if (mapRef.current) {
      mapRef.current.setView(
        [profile.address.latitude, profile.address.longitude],
        zoom
      );
    }
  }, [profile, zoom]);

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={[profile.address.latitude, profile.address.longitude]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={(map) => { mapRef.current = map || null; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[profile.address.latitude, profile.address.longitude]}>
          <Popup>
            <div>
              <h3 className="font-semibold">{profile.name}</h3>
              <p>{profile.address.street}</p>
              <p>{profile.address.city}, {profile.address.state} {profile.address.zipCode}</p>
              <p>{profile.address.country}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
