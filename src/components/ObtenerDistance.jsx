/* eslint-disable react/prop-types */
import { Box, Center, Text, Button, Input, InputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/react"
import { Card, CardHeader, CardBody, Stack, Heading, StackDivider } from '@chakra-ui/react'
import { Badge, Stat, StatNumber } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { MdSearch } from 'react-icons/md'
import { useState, useEffect, useRef } from "react"
import '../App.css'
import { orderByDistance } from 'geolib';


const ObtenerDistance = ({ userInput, setUserInput, closestDirection, setClosestDirection , directions, setlocationUser, suggestions, distance, locationUser }) => {
  
  const [display, setDisplay] = useState(false); //Manejo de la visibilidad de las sugerencias de direcciones
  const wrapperRef = useRef(null);
  const apiKey = 'DDlA0KW1ZhZImumGb0U23rdJd4TnhLIC' //API KEY Mapquest

  const dias = ["Domingo", "Lunes", "Martes", "Jueves", "Viernes", "Sabado"]

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };
    
  const findClosestDirection = (location) => {
    if (userInput != '') {
      const userCoordinates = location;
      const closest = orderByDistance(userCoordinates, directions);
      const DirectionsDispon = closest.filter((direction) => direction.rol === dias[new Date().getDay()])
      console.log(DirectionsDispon);
      setClosestDirection(DirectionsDispon);
    }

    console.log('No hay direccion para decirte cual es el mas cercano')
  };
  
  const updateDirection = (direction) => {
    setUserInput(direction);
    handleClickDirection(direction);
    setDisplay(false);
  };

  const handleClickDirection = async (direction) => {
    if (userInput !== '') {
      console.log('si hay datos en input', direction);
        console.log('has dado click')
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
              findClosestDirection(locationCoor)
            }
          } else {
            console.error('Error al encontrar la dirección: ', response.statusText);
          }
        } catch (error) {
          console.error('Error al encontrar la dirección: ', error);
        }
    } else {
      console.log('NO HAY DIRECCIÓN EN EL INPUT');
      setlocationUser(null);
    }
  }

  const handleClickOutside = event => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  const clearInput = () => {
    setUserInput('');
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
    <Box bg="white" w="100%" height="100%" borderLeft="1px" borderColor="gray.300">
          <Center h="10vh" bgGradient="linear(to-t, blue.500, blue.300)">
            <Text color="white" fontSize="2xl" fontWeight="bold">Encuentra el corralón más cercano</Text>
          </Center>
          <Center ref={wrapperRef} display="flex" flexDirection="column" h="auto" bg="white" m="2" p="3" border="1px" borderColor="gray.100" borderRadius="sm" boxShadow="base">
            <Text mb="2" color="blackAlpha.700" fontWeight="medium">Lugar de recoleccion:</Text>
            <InputGroup w="90%">
              <InputLeftElement>
                <Icon as={MdSearch} boxSize="5" color="gray.400" />
              </InputLeftElement>
              <Input textTransform="capitalize" value={userInput} onClick={() => setDisplay(!display)} onChange={handleInputChange} placeholder="Escriba la dirección" size="md" variant="outline" bg="white" borderRadius="md" />
              <InputRightElement>
                {userInput && (
                  <Button bg="blue.300" _hover={{ bg: 'blue.200' }} color="white" onClick={clearInput}>
                    x
                  </Button>
                )}
              </InputRightElement>
            </InputGroup>
            {display && (
                suggestions.map((value, index) => {
                    return (
                        <Box key={1} display="flex" flexDirection="column" Gap=".5" px="2" bg="blue.50" h="auto" w="90%" borderBottomRadius="md">
                            <Box key={index} onClick={() => updateDirection(value)} tabIndex="0" cursor="pointer" _hover={{ bg: 'blue.200' }}>
                                <Text textTransform="capitalize" fontSize={12} color="gray.600">{value}</Text>
                            </Box>  
                        </Box>
                    );
                })
            )}
          </Center>
          {closestDirection && (
              <Box width="100%" h="auto" p="2" bg="">
              <Card w="100%" h="auto" borderColor="blue.400" boxShadow="md">
                <CardHeader h="auto" bgGradient="linear(to-t, blue.500, blue.300)">
                  <Heading size="md" color="white">Detalles:</Heading>
                </CardHeader>
                  <CardBody>
                    <Stack divider={<StackDivider borderColor="blue.200" />} spacing='4'>
                      <Box>
                        <Heading size='xs' textTransform='uppercase'>
                          Origen:
                        </Heading>
                        <Center display="flex" marginTop="2" gap="1" justifyContent="space-between">
                          <Box display="flex" flexDirection="column">
                            <Badge colorScheme="blue" fontSize="xs" fontWeight="medium" textAlign="center">Localidad o Colonia:</Badge>
                            <Text fontSize='xs' fontWeight="light" textAlign="center">
                              {locationUser.adminArea6}
                            </Text>
                          </Box>
                          <Box  display="flex" flexDirection="column">
                            <Badge colorScheme="blue" fontSize="xs" fontWeight="medium" textAlign="center">Municipio:</Badge>
                            <Text fontSize='xs' fontWeight="light" textAlign="center">
                                {locationUser.adminArea5}
                            </Text>
                          </Box>
                          <Box display="flex" flexDirection="column">
                            <Badge colorScheme="blue" fontSize="xs" fontWeight="medium" textAlign="center">Codigo Postal:</Badge>
                            <Text fontSize='xs' fontWeight="light" textAlign="center">
                             {locationUser.postalCode}
                            </Text>
                          </Box>
                        </Center>
                      </Box>
                      <Box>
                        <Heading size='xs' textTransform='uppercase'>
                          Corralón Asignado:
                        </Heading>
                        <Box display="flex" flexDirection="column" gap="1" marginTop="2">
                          <Center display="flex" alignItems="baseline" justifyContent="space-between">
                            <Box display="flex" flexDirection="column" >
                              <Badge colorScheme="blue" fontSize="xs" h="auto" fontWeight="medium" textAlign="center">Nombre:</Badge>
                              <Text fontSize='xs' fontWeight="light" textAlign="center">
                                {closestDirection[0].name}    
                              </Text>
                            </Box>
                            <Box display="flex" flexDirection="column">
                              <Badge colorScheme="blue" fontSize="xs" fontWeight="medium" textAlign="center">Región:</Badge>
                              <Text fontSize='xs' fontWeight="light" textAlign="center">
                                {closestDirection[0].region}
                              </Text>
                            </Box>
                            <Box display="flex" flexDirection="column">
                              <Badge colorScheme="blue" fontSize="xs" fontWeight="medium" textAlign="center">Contacto:</Badge>
                             <Text fontSize='xs' fontWeight="light" textAlign="center">
                                {closestDirection[0].cellphone}
                              </Text>
                            </Box>
                            <Box display="flex" flexDirection="column">
                              <Badge colorScheme="blue" fontSize="xs" fontWeight="medium" textAlign="center">Telefono:</Badge>
                              <Text fontSize='xs' fontWeight="light" textAlign="center">
                                 {closestDirection[0].contact}
                              </Text>
                            </Box>
                          </Center>
                          <Center display="flex" justifyContent="space-between">
                            <Box display="flex" gap="1" mt="1">
                              <Badge colorScheme="blue" fontSize="xs" fontWeight="medium" textAlign="center">Ubicación:</Badge>
                              <Text fontSize='xs' fontWeight="light" textAlign="center">
                                 {closestDirection[0].location}
                              </Text>
                            </Box>
                            <Box>
                              <Stat>
                                <Badge colorScheme="blue" fontSize="xs" fontWeight="medium" textAlign="center">Distancia:</Badge>
                                <StatNumber fontSize="md">{distance} m</StatNumber>
                              </Stat>
                            </Box>
                          </Center>
                        </Box>
                      </Box>
                    </Stack>
                  </CardBody>
              </Card>
              </Box>
          )}
        </Box>
  )
}

export default ObtenerDistance
