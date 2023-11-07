/* eslint-disable react/prop-types */
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { Box } from "@chakra-ui/react"
import "leaflet/dist/leaflet.css";
import RouteMap from "./RouteMap";
import municipios from "../assets/Municipios.js";
import estados from "../assets/states.js";


const MapGeo = ({locationUser, closestDirection, setDistance}) => { 

  const PositionPuebla = [19.0431, -98.1980]; //latitud y longitud del Estado de Puebla

  return (
    <>
        <Box bg="white" w="100%" h="100%">
            <MapContainer center={PositionPuebla} zoom={13} style={{ height: '100%', width: '100%' }} >
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON data={estados}/>
            <GeoJSON data={municipios}
            onEachFeature={(feature, layer) => {
                layer.bindPopup(feature.properties.mun_name);
            }}
            />
            {locationUser && (
                <RouteMap
                locationUser={locationUser}
                closestDirection={closestDirection}
                setDistance={setDistance}
                />
            )}
            </MapContainer>
        </Box>
    </>
  )
}

export default MapGeo
