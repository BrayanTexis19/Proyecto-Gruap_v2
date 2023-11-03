/* eslint-disable react/prop-types */
import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import "../App.css";
import MapGeo from "./MapGeo";
import ObtenerDistance from "./ObtenerDistance";
import { ObtenerDataDB } from "../firebase/firebase";

const GeoloContainer = ({
  setActiveStep,
  handleChange,
  form,
  closestDirection,
  setClosestDirection,
  locationUser,
  setlocationUser,
  distance,
  setDistance,
  handleClicNewRegister,
  userInput,
  setUserInput,
}) => {
  const [locations, setlocations] = useState([]);
  const [suggestions, setSuggestions] = useState([]); //Arreglo de Sugerencias de direcciones
  const apiKey = "DDlA0KW1ZhZImumGb0U23rdJd4TnhLIC"; //API KEY Mapquest

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getData() {
    try {
      const datos = await ObtenerDataDB("Corralones");
      setlocations(datos);
      console.log(locations);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (userInput.length > 3) {
      fetch(
        `http://www.mapquestapi.com/search/v3/prediction?limit=5&collection=adminArea,poi,address&key=${apiKey}&q=${userInput}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const suggestions = data.results.map(
              (location) => location.displayString
            );
            setSuggestions(suggestions);
          }
        })
        .catch((error) => {
          console.error("Error al buscar sugerencias de direcciones:", error);
        });
    } else {
      setSuggestions([]);
    }
  }, [userInput, apiKey]);

  return (
    <Box h="100vh" w="100%" display="flex" justifyContent={"center"}>
      <MapGeo
        locationUser={locationUser}
        closestDirection={closestDirection}
        setDistance={setDistance}
      />
      <ObtenerDistance
        userInput={userInput}
        setUserInput={setUserInput}
        closestDirection={closestDirection}
        setClosestDirection={setClosestDirection}
        setlocationUser={setlocationUser}
        suggestions={suggestions}
        locations={locations}
        distance={distance}
        locationUser={locationUser}
        setActiveStep={setActiveStep}
        handleChange={handleChange}
        form={form}
        handleClicNewRegister={handleClicNewRegister}
      />
    </Box>
  );
};

export default GeoloContainer;
