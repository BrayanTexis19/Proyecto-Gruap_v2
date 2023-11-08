/* eslint-disable react/prop-types */
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import icon from '../assets/marker4.png'

const customIcon = new Icon({
  iconUrl: icon,
  iconSize: [36, 40],
})

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
        position={position} icon={customIcon}
      >
      </Marker>
    </MapContainer>
  )
}

export default MapViewFolio
