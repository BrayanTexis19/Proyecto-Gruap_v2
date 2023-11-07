import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { MdSupervisedUserCircle, MdCarRepair } from "react-icons/md";
import { FiFileText, FiTruck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
useNavigate;
const HomePage = () => {
  const navigation = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = useState(
    JSON.parse(window.localStorage.getItem("sessionUser"))
  );
  return (
    <Box w="full" h="auto" bg="white" mt="1">
      <Heading size="lg" fontWeight="medium" p="2">Menu de opciones:</Heading>
      <Box display="flex" flexDir={{base: "column", md:"row"}} p="2" gap="3" flexWrap="wrap">
        {userData && (
             userData.Rol === "Admin" ? (
              <>
                <Box
                  display="flex"
                  flexDir="column"
                  bg="blue.400"
                  p="4"
                  color="white"
                  h="auto"
                  w={{base: "100%", md: "30%"}}
                  borderRadius="base"
                  boxShadow="lg"
                >
                  <Box
                    display="flex"
                    justifyContent="space-evenly"
                    alignItems="center"
                  >
                    <Text fontSize="xl">Usuarios</Text>
                    <MdSupervisedUserCircle size="30px" />
                  </Box>
                  <Box display="flex" flexDir="column" gap="2" p="2">
                    <Text fontSize="sm" fontWeight="light">
                      Gestion de datos de los usuarios del sistema
                    </Text>
                    <Button
                      onClick={() => navigation("/Usuarios")}
                      variant="outline"
                      _hover={{ color: "blue.300", bg: "blue.200" }}
                      border="2px"
                      color="white"
                      colorScheme="blue"
                    >
                      <Text color="white">Ir a Usuarios</Text>
                    </Button>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDir="column"
                  bg="blue.400"
                  p="4"
                  color="white"
                  h="auto"
                  w={{base: "100%", md: "30%"}}
                  borderRadius="base"
                  boxShadow="lg"
                >
                  <Box
                    display="flex"
                    justifyContent="space-evenly"
                    alignItems="center"
                  >
                    <Text fontSize="xl">Registros</Text>
                    <FiFileText size="30" />
                  </Box>
                  <Box display="flex" flexDir="column" gap="2" p="2">
                    <Text fontSize="sm" fontWeight="light">
                      Gestion de Registros de servicios de arrrastre de gruas
                    </Text>
                    <Button
                      onClick={() => navigation("/Registros")}
                      variant="outline"
                      _hover={{ color: "blue.300", bg: "blue.200" }}
                      border="2px"
                      color="white"
                      colorScheme="blue"
                    >
                      <Text color="white">Ir a Registros</Text>
                    </Button>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDir="column"
                  bg="blue.400"
                  p="4"
                  color="white"
                  h="auto"
                  w={{base: "100%", md: "30%"}}
                  borderRadius="base"
                  boxShadow="lg"
                >
                  <Box
                    display="flex"
                    justifyContent="space-evenly"
                    alignItems="center"
                  >
                    <Text fontSize="xl">Corralones</Text>
                    <FiTruck size="30" />
                  </Box>
                  <Box display="flex" flexDir="column" gap="2" p="2">
                    <Text fontSize="sm" fontWeight="light">
                      Gestión de cada uno de los corralones en Puebla
                    </Text>
                    <Button
                      onClick={() => navigation("/Corralones")}
                      variant="outline"
                      _hover={{ color: "blue.300", bg: "blue.200" }}
                      border="2px"
                      color="white"
                      colorScheme="blue"
                    >
                      <Text color="white">Ir a Corralones</Text>
                    </Button>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDir="column"
                  bg="blue.400"
                  p="4"
                  color="white"
                  h="auto"
                  w={{base: "100%", md: "30%"}}
                  borderRadius="base"
                  boxShadow="lg"
                >
                  <Box
                    display="flex"
                    justifyContent="space-evenly"
                    alignItems="center"
                  >
                    <Text fontSize="xl">Asignación de corralón</Text>
                    <MdCarRepair size="30" />
                  </Box>
                  <Box display="flex" flexDir="column" gap="2" p="2">
                    <Text fontSize="sm" fontWeight="light">
                      Trazado de rutas, corralon mas cercano, cotización de costos
                    </Text>
                    <Button
                      onClick={() => navigation("/Trazado-Rutas")}
                      variant="outline"
                      _hover={{ color: "blue.300", bg: "blue.200" }}
                      border="2px"
                      color="white"
                      colorScheme="blue"
                    >
                      <Text color="white">Ir a Asignación</Text>
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box
                  display="flex"
                  flexDir="column"
                  bg="blue.400"
                  p="4"
                  color="white"
                  h="auto"
                  w={{base: "100%", md: "30%"}}
                  borderRadius="base"
                  boxShadow="md"
                >
                  <Box
                    display="flex"
                    justifyContent="space-evenly"
                    alignItems="center"
                  >
                    <Text fontSize="xl">Registros</Text>
                    <FiFileText size="30" />
                  </Box>
                  <Box display="flex" flexDir="column" gap="2" p="2">
                    <Text fontSize="sm" fontWeight="light">
                      Gestion de Registros de servicios de arrrastre de gruas
                    </Text>
                    <Button
                      onClick={() => navigation("/Registros")}
                      variant="outline"
                      _hover={{ color: "blue.300", bg: "blue.200" }}
                      border="2px"
                      color="white"
                      colorScheme="blue"
                    >
                      <Text color="white">Ir a Registros</Text>
                    </Button>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDir="column"
                  bg="blue.400"
                  p="4"
                  color="white"
                  h="auto"
                  w={{base: "100%", md: "30%"}}
                  borderRadius="base"
                  boxShadow="md"
                >
                  <Box
                    display="flex"
                    justifyContent="space-evenly"
                    alignItems="center"
                  >
                    <Text fontSize="xl">Asignación de corralón</Text>
                    <MdCarRepair size="30" />
                  </Box>
                  <Box display="flex" flexDir="column" gap="2" p="2">
                    <Text fontSize="sm" fontWeight="light">
                      Trazado de rutas, corralon mas cercano, cotización de costos
                    </Text>
                    <Button
                      onClick={() => navigation("/Trazado-Rutas")}
                      variant="outline"
                      _hover={{ color: "blue.300", bg: "blue.200" }}
                      border="2px"
                      color="white"
                      colorScheme="blue"
                    >
                      <Text color="white">Ir a Asignación</Text>
                    </Button>
                  </Box>
                </Box>
              </>
            )
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
