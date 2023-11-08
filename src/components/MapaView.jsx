/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box } from "@chakra-ui/react";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from '../assets/marker3.png'

const customIcon = new Icon({
  iconUrl: icon,
  iconSize: [36, 48],
})

const MapaView = ({ user }) => {

  const PositionLocation = [user.Coordenadas.Latitud, user.Coordenadas.Longitud]; //latitud y longitud del Estado de Puebla
  return (
    <Box bg="white" w="full" height="50vh">
      <MapContainer
        center={PositionLocation}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={PositionLocation} icon={customIcon}
        >
          <Popup>{user.Nombre}</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default MapaView;
