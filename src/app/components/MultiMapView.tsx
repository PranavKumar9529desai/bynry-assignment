import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Profile } from '../types/profile';

// Fix for default marker icons in Leaflet with React
// This is needed because the default icons use relative paths that don't work in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MultiMapViewProps {
  profiles: Profile[];
  height?: string;
  zoom?: number;
  onProfileSelect?: (profileId: string) => void;
}

const MultiMapView: React.FC<MultiMapViewProps> = ({ 
  profiles, 
  height = '400px', 
  zoom = 10,
  onProfileSelect 
}) => {
  // Calculate center of all markers
  const calculateCenter = () => {
    if (profiles.length === 0) return [0, 0];
    
    const sumLat = profiles.reduce((sum, profile) => sum + profile.address.latitude, 0);
    const sumLng = profiles.reduce((sum, profile) => sum + profile.address.longitude, 0);
    
    return [sumLat / profiles.length, sumLng / profiles.length];
  };

  const center = calculateCenter() as [number, number];

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {profiles.map(profile => (
          <Marker 
            key={profile.id} 
            position={[profile.address.latitude, profile.address.longitude]}
            eventHandlers={{
              click: () => {
                if (onProfileSelect) {
                  onProfileSelect(profile.id);
                }
              }
            }}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{profile.name}</h3>
                <p>{profile.address.street}</p>
                <p>{profile.address.city}, {profile.address.state} {profile.address.zipCode}</p>
                <p>{profile.address.country}</p>
                {onProfileSelect && (
                  <button 
                    onClick={() => onProfileSelect(profile.id)}
                    className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    View Profile
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MultiMapView;
