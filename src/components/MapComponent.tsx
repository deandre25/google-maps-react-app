import React from 'react';
import { GoogleMap, useLoadScript, Marker, Libraries } from '@react-google-maps/api';
import { QuestType } from '../types/Quest';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Clusterer } from '@react-google-maps/marker-clusterer';

const libraries: Libraries = ['places'];

const mapContainerStyle = {
  width: '50vw',
  height: '50vh',
  margin: 'auto',
};

const center = {
  lat: 0,
  lng: 0,
};

interface MapComponentProps {
  markers: QuestType[];
  onMapClick: (event: google.maps.MapMouseEvent) => void;
  onMarkerDragEnd: (index: number, event: google.maps.MapMouseEvent) => void;
  onDeleteAllMarkers: () => void;
  deleteOneMarker: (index: number) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ markers, onMapClick, onMarkerDragEnd, deleteOneMarker }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCaxLx9eKvm5uf-y_Ny6UquJsOLXDKcvvA',
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  const clusterMarker = new MarkerClusterer({markers})

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={center}
      onClick={onMapClick}
    >
      {markers.map((marker, index) => (
        <Marker
          label={index.toString()}
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          draggable={true}
          onDragEnd={(event: google.maps.MapMouseEvent) => onMarkerDragEnd(index, event)}
          onClick={() => deleteOneMarker(index)}
        />      
      ))}
    </GoogleMap >
  );
};

export default MapComponent;
