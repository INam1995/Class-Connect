import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Helper component to auto-fit all markers on the map
const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

const Location = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/locations');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user locations:', error);
      }
    };

    fetchUserLocations();

    // Fix for missing Leaflet icon
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
    });
  }, []);

  // Filter users with valid coordinates
  const validUsers = users.filter((user) => user.latitude && user.longitude);

  // Create bounds for all markers
  const bounds = validUsers.map((user) => [user.latitude, user.longitude]);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      {validUsers.length > 0 ? (
        <MapContainer center={[20, 78]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {validUsers.map((user) => (
            <Marker key={user._id || user.name} position={[user.latitude, user.longitude]}>
              <Popup>
                <strong>{user.name}</strong>
                <br />
                Latitude: {user.latitude}
                <br />
                Longitude: {user.longitude}
              </Popup>
            </Marker>
          ))}
          <FitBounds bounds={bounds} />
        </MapContainer>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>No users with valid location data</div>
      )}
    </div>
  );
};

export default Location;
