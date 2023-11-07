/* eslint-disable react/prop-types */
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapViewFolio = ({latitud, longitud}) => {
    const position = [latitud, longitud];
  return (
    <MapContainer
      center={position}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={position}
      >
      </Marker>
    </MapContainer>
  )
}

export default MapViewFolio
