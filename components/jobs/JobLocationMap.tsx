'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, ExternalLink, Loader2 } from 'lucide-react';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface JobLocationMapProps {
  location: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export default function JobLocationMap({ location, country, coordinates }: JobLocationMapProps) {
  const [mapCoords, setMapCoords] = useState(coordinates);
  const [loading, setLoading] = useState(!coordinates);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!coordinates) {
      geocodeAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, country, coordinates]);

  const geocodeAddress = async () => {
    try {
      // Validate location and country before making API call
      if (!location || !country || location.trim() === '' || country.trim() === '') {
        // Silently fail for invalid location data
        setError(true);
        setLoading(false);
        return;
      }

      const query = `${location}, ${country}`;

      // Call OpenStreetMap Nominatim API directly (client-side for static export)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        {
          headers: {
            'User-Agent': 'JobAgentPH/1.0',
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // Silently handle API errors - don't log to console
        setError(true);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data && data[0]) {
        setMapCoords({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
      } else {
        // No results found - fail silently
        setError(true);
      }
    } catch (err) {
      // Silently handle geocoding errors
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getDirectionsUrl = () => {
    const query = encodeURIComponent(`${location}, ${country}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="text-red-600" size={24} />
          Job Location
        </h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      </div>
    );
  }

  if (error || !mapCoords) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="text-red-600" size={24} />
          Job Location
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="font-medium text-gray-900">{location}</p>
              <p className="text-sm text-gray-600">{country}</p>
            </div>
          </div>
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <ExternalLink size={16} />
            Get Directions on Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MapPin className="text-red-600" size={24} />
        Job Location
      </h2>

      <div className="space-y-3">
        <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
          <MapContainer
            center={[mapCoords.lat, mapCoords.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[mapCoords.lat, mapCoords.lng]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{location}</p>
                  <p className="text-gray-600">{country}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <a
          href={getDirectionsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ExternalLink size={18} />
          Get Directions
        </a>
      </div>
    </div>
  );
}
