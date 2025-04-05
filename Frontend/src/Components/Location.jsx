import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const Location = () => {
  // State to store user data
  const [users, setUsers] = useState([]);

  // Fetch users from the backend on component mount
  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/locations');
        const data = await response.json(); // Assuming response is a JSON array
        setUsers(data); // Set users with valid data
      } catch (error) {
        console.error('Error fetching user locations:', error);
      }
    };

    fetchUserLocations();

    // Fix for missing leaflet icon issue (prevent warning)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
    });
  }, []);

  return (
    <div style={{ height: '500px' }}>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {users
          .filter((user) => user.latitude && user.longitude) // Ensure valid lat/lng
          .map((user) => (
            <Marker key={user._id} position={[user.latitude, user.longitude]}>
              <Popup>{user.name}</Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default Location;
