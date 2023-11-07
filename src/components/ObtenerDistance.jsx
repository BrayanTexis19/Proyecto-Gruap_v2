/* eslint-disable react/prop-types */
import {
  Box,
  Center,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
} from "@chakra-ui/react";
import { Stack, Heading, StackDivider } from "@chakra-ui/react";

import { Badge } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import "../App.css";
import { orderByDistance } from "geolib";

const ObtenerDistance = ({
  userInput,
  setUserInput,
  closestDirection,
  setClosestDirection,
  locations,
  setlocationUser,
  suggestions,
  distance,
  locationUser,
  setActiveStep,
  handleChange,
  form,
  handleClicNewRegister,
}) => {
  const [display, setDisplay] = useState(false); //Manejo de la visibilidad de las sugerencias de direcciones
  const wrapperRef = useRef(null);
  const apiKey = "DDlA0KW1ZhZImumGb0U23rdJd4TnhLIC"; //API KEY Mapquest

  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const findClosestDirection = (location) => {
    if (userInput != "") {
      const userCoordinates = location;
      let coordenadas = [];
      coordenadas = locations.map((ubicacion) => ({
        ...ubicacion,
        latitude: ubicacion.Coordenadas.Latitud,
        longitude: ubicacion.Coordenadas.Longitud,
      }));
      const closest = orderByDistance(userCoordinates, coordenadas);
      const DirectionsDispon = closest.filter(
        (direction) =>
          direction.Rol === dias[new Date().getDay()] &&
          direction.Status === "Activo"
      );
      console.log(DirectionsDispon);
      setClosestDirection(DirectionsDispon);
    }

    console.log("No hay direccion para decirte cual es el mas cercano");
  };

  const updateDirection = (direction) => {
    setUserInput(direction);
    handleClickDirection(direction);
    setDisplay(false);
  };

  const handleClickDirection = async (direction) => {
    if (userInput !== "") {
      console.log("si hay datos en input", direction);
      console.log("has dado click");
      try {
        const response = await fetch(
          `https://www.mapquestapi.com/geocoding/v1/address?key=${apiKey}&location=${direction}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const location = data.results[0].locations[0];
            const locationCoor = data.results[0].locations[0].displayLatLng;
            console.log(data.results[0].locations[0]);
            setlocationUser(location);
            console.log(location);
            findClosestDirection(locationCoor);
          }
        } else {
          console.error(
            "Error al encontrar la dirección: ",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error al encontrar la dirección: ", error);
      }
    } else {
      console.log("NO HAY DIRECCIÓN EN EL INPUT");
      setlocationUser(null);
    }
  };

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  const clearInput = () => {
    setUserInput("");
    setClosestDirection(null);
    setlocationUser(null);
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <Box w="100%" h="50%">
      <Center
        display="flex"
        p="2"
        justifyContent="space-between"
        alignItems="center"
        h="auto"
        bgGradient="linear(to-t, blue.500, blue.300)"
      >
        <Text mx="2" color="white" fontSize="2xl" fontWeight="bold">
          Asignación de corralón
        </Text>
        <Button
          onClick={() => setActiveStep(0)}
          mx="2"
          border="1px"
          borderColor="white"
          colorScheme="white"
          _hover={{ bg: "white", color: "blue.500" }}
          size="sm"
          w="auto"
        >
          Regresar
        </Button>
      </Center>
      <Box
        ref={wrapperRef}
        display="flex"
        flexDirection="column"
        h="auto"
        bg="white"
        m="1"
        p="3"
        gap="2"
        border="1px"
        borderColor="gray.100"
        borderRadius="sm"
        boxShadow="base"
      >
        <FormControl mx="2" isRequired>
          <FormLabel>Grua:</FormLabel>
          <Select size="md" name="TipoGrua" value={form.TipoGrua} onChange={handleChange}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </Select>
          <FormHelperText>Tipo de grua requerida</FormHelperText>
        </FormControl>
        <FormControl  mx="1" isRequired>
          {/* <Text mb="2" color="blackAlpha.700" fontWeight="medium">
            Lugar de recoleccion:
          </Text> */}
          <FormLabel>Lugar de recolección:</FormLabel>
          <Box position="relative" width="100%" zIndex={2}>
            <InputGroup w="auto">
              <InputLeftElement>
                <Icon as={MdSearch} boxSize="5" color="gray.400" />
              </InputLeftElement>
              <Input
                textTransform="capitalize"
                value={userInput}
                onClick={() => setDisplay(!display)}
                onChange={handleInputChange}
                placeholder="Escriba la dirección"
                size="md"
                variant="outline"
                bg="white"
                borderRadius="md"
              />
              <InputRightElement>
                {userInput && (
                  <Button
                    bg="blue.300"
                    _hover={{ bg: "blue.200" }}
                    color="white"
                    onClick={clearInput}
                  >
                    x
                  </Button>
                )}
              </InputRightElement>
            </InputGroup>
            {display && (
              <Box position="absolute" top="42" w="full" borderRadius="base">
                {suggestions.map((value, index) => {
                  return (
                    <Box
                      key={index}
                      display="flex"
                      flexDirection="column"
                      gap=".5"
                      px="2"
                      bg="blue.50"
                      h="auto"
                      w="100%"
                    >
                      <Box
                        key={index}
                        onClick={() => updateDirection(value)}
                        tabIndex="0"
                        cursor="pointer"
                        _hover={{ bg: "blue.200" }}
                        borderRadius="sm"
                      >
                        <Text
                          textTransform="capitalize"
                          fontSize={12}
                          color="gray.600"
                        >
                          {value}
                        </Text>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </FormControl>
      </Box>
      {closestDirection && (
        <Box
          w="full"
          h="auto"
          display="flex"
          flexDir="column"
          alignItems="center"
        >
          <Box width="100%" p="1" h="auto">
            <Box w="auto" h="auto" borderColor="blue.400" boxShadow="md">
              <Box h="auto" p="2" bgGradient="linear(to-t, blue.500, blue.300)">
                <Heading size="md" color="white">
                  Detalles:
                </Heading>
              </Box>
              <Box p="2">
                <Stack
                  divider={<StackDivider borderColor="blue.200" />}
                  spacing="4"
                >
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Origen:
                    </Heading>
                    <Box
                      display="flex"
                      flexDir={{base: "column", md:"row"}}
                      marginTop="2"
                      gap="1"
                      justifyContent="space-between"
                    >
                      <Box display="flex" gap={{base: "2", md: "0"}} flexDirection={{base: "row",md: "column"}}>
                        <Badge
                          colorScheme="blue"
                          fontSize="xs"
                          fontWeight="medium"
                          textAlign="center"
                        >
                          Localidad o Colonia:
                        </Badge>
                        <Text
                          fontSize="xs"
                          fontWeight="light"
                          textAlign="center"
                        >
                          {locationUser.adminArea6}
                        </Text>
                      </Box>
                      <Box display="flex" gap={{base: "2", md: "0"}} flexDirection={{base: "row",md: "column"}}>
                        <Badge
                          colorScheme="blue"
                          fontSize="xs"
                          fontWeight="medium"
                          textAlign="center"
                        >
                          Municipio:
                        </Badge>
                        <Text
                          fontSize="xs"
                          fontWeight="light"
                          textAlign="center"
                        >
                          {locationUser.adminArea5}
                        </Text>
                      </Box>
                      <Box display="flex" gap={{base: "2", md: "0"}} flexDirection={{base: "row",md: "column"}}>
                        <Badge
                          colorScheme="blue"
                          fontSize="xs"
                          fontWeight="medium"
                          textAlign="center"
                        >
                          Codigo Postal:
                        </Badge>
                        <Text
                          fontSize="xs"
                          fontWeight="light"
                          textAlign="center"
                        >
                          {locationUser.postalCode}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Corralón Asignado:
                    </Heading>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap="1"
                      marginTop="2"
                    >
                      <Center
                        display="flex"
                        alignItems="baseline"
                        justifyContent="space-between"
                      >
                        <Box display="flex" flexDirection="column">
                          <Badge
                            colorScheme="blue"
                            fontSize="xs"
                            h="auto"
                            fontWeight="medium"
                            textAlign="center"
                          >
                            Nombre:
                          </Badge>
                          <Text
                            fontSize="xs"
                            fontWeight="light"
                            textAlign="center"
                          >
                            {closestDirection[0].Nombre}
                          </Text>
                        </Box>
                        <Box display="flex" flexDirection="column">
                          <Badge
                            colorScheme="blue"
                            fontSize="xs"
                            fontWeight="medium"
                            textAlign="center"
                          >
                            Región:
                          </Badge>
                          <Text
                            fontSize="xs"
                            fontWeight="light"
                            textAlign="center"
                          >
                            {closestDirection[0].Region}
                          </Text>
                        </Box>
                        <Box display="flex" flexDirection="column">
                          <Badge
                            colorScheme="blue"
                            fontSize="xs"
                            fontWeight="medium"
                            textAlign="center"
                          >
                            Contacto:
                          </Badge>
                          <Text
                            fontSize="xs"
                            fontWeight="light"
                            textAlign="center"
                          >
                            {closestDirection[0].Contacto}
                          </Text>
                        </Box>
                        <Box display="flex" flexDirection="column">
                          <Badge
                            colorScheme="blue"
                            fontSize="xs"
                            fontWeight="medium"
                            textAlign="center"
                          >
                            Telefono:
                          </Badge>
                          <Text
                            fontSize="xs"
                            fontWeight="light"
                            textAlign="center"
                          >
                            {closestDirection[0].Celular}
                          </Text>
                        </Box>
                      </Center>
                      <Box display="flex" gap="2" flexDir={{base: "column", md: "column"}} justifyContent="space-evenly">
                        <Box display="flex" alignItems="center" gap="1" mt="1">
                          <Badge
                            colorScheme="blue"
                            fontSize="xs"
                            fontWeight="medium"
                            textAlign="center"
                          >
                            Ubicación:
                          </Badge>
                          <Text
                            fontSize="xs"
                            fontWeight="light"
                            textAlign="center"
                          >
                            {closestDirection[0].Direccion}
                          </Text>
                        </Box>
                        <Box display="flex" gap="2" alignItems="center" justifyContent={{base:"center", md:"flex-end"}}>
                            <Badge
                              colorScheme="blue"
                              fontSize="xs"
                              fontWeight="medium"
                              textAlign="center"
                            >
                              Distancia:
                            </Badge>
                            <Text fontWeight="bold" fontFamily="sans-serif" fontSize="md">{distance} m</Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Box>
          <Button
            onClick={handleClicNewRegister}
            size="sm"
            colorScheme="blue"
            w={{ base: " full",md:"auto"}}
            my="2"
          >
            Guardar Cambios
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ObtenerDistance;
