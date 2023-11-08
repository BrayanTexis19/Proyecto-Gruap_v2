/* eslint-disable react/prop-types */
import { MapContainer, TileLayer, GeoJSON, Marker} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import municipios from "../assets/Municipios.js";
import estados from "../assets/states.js";
import { Icon } from "leaflet";
import icon from '../assets/marker3.png'

const customIcon = new Icon({
  iconUrl: icon,
  iconSize: [36, 48],
})

const MapEdit = ({handleSetPoint, markerPoint}) => { 

  const PositionPuebla = [19.0431, -98.1980]; //latitud y longitud del Estado de Puebla

  const handleFeatureClick = (event) => {
    const featureName = event.target.feature.properties.mun_name;
    handleSetPoint(featureName);
  };

  return (
    <>
          <MapContainer center={PositionPuebla} zoom={13} style={{ height: '100%', width: '100%' }} >
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON data={estados}/>
            <GeoJSON data={municipios}
            onEachFeature={(feature, layer) => {
                layer.bindPopup(feature.properties.mun_name);
                layer.on('click', handleFeatureClick);
            }}
            />
            {markerPoint && (
              <Marker position={[markerPoint.Latitud, markerPoint.Longitud]} icon={customIcon}></Marker>
            )}
            </MapContainer>
    </>
  )
}

export default MapEdit
