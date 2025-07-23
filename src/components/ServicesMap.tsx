import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: '/favicon.png',
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface Service {
  id: string;
  postalCode: string;
  serviceName: string;
  description: string;
  name: string;
  lat?: number;
  lng?: number;
}

interface ServicesMapProps {
  services: Service[];
}

export default function ServicesMap({ services }: ServicesMapProps) {
  return (
    <MapContainer
      center={[56.2639, 9.5018]} // Denmark center
      zoom={7}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {services.map((service) => (
        <Marker
          key={service.id}
          position={[service.lat || 56.2639, service.lng || 9.5018]}
        >
          <Popup>
            <strong>{service.serviceName}</strong>
            <br />
            {service.description}
            <br />
            <em>by {service.name}</em>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
