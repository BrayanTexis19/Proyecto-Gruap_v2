/* eslint-disable no-unused-vars */
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerFooter,
  DrawerCloseButton,
  useDisclosure,
  Badge,
  InputRightElement,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
  Box,
  Center,
  Image,
  Heading,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
} from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import marker from "../assets/gruapp_rc_2.svg";
import logo from "../assets/gruapp.jpg";
import { Icon } from "@chakra-ui/react";
import { MdPerson, MdSearch, MdSecurity } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getRegisterInfo, userExists } from "../firebase/firebase";
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import MapViewFolio from "./MapViewFolio";

const LoginContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userPass, seTuserPass] = useState("");
  const [messageError, setmessageError] = useState("");
  const [messageErrorF, setmessageErrorF] = useState("");
  const [folioInput, setFolioInput] = useState("");
  const [folioData, setFolioData] = useState(null);
  const [isSearchFolio, setisSearchFolio] = useState(false);
  const [display, setDisplay] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (messageError !== "") {
      const timeout = setTimeout(() => {
        setmessageError("");
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [messageError]);

  useEffect(() => {
    if (messageErrorF !== "") {
      const timeout = setTimeout(() => {
        setmessageErrorF("");
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [messageErrorF]);

  const handleClickSearch = () => {
    setDisplay(!display);
  };

  const handleSearch = async () => {
    if (folioInput === "")
      return toast({
        title: "Upps... Ocurrio un error",
        description: "Es necesario escribir un folio.",
        variant: "solid",
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    const folio = await getRegisterInfo(folioInput);
    console.log(folio);
    if (!folio) {
      setFolioInput("");
      return toast({
        title: "Upps... Ocurrio un error",
        description: "No existen coincidencias con el folio " + folioInput,
        variant: "solid",
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }

    setFolioData(folio);
    setFolioInput("");
    onOpen();
  };

  const handleGmailChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handlePassChange = (e) => {
    seTuserPass(e.target.value);
  };

  const handleChangeFolio = (e) => {
    setFolioInput(e.target.value);
  };

  const handleclickAuth = async () => {
    setisSearchFolio(true);
    if (userEmail == "" && userPass == "")
      return setmessageError("Ingrese datos al formulario");
    if (userEmail == "") return setmessageError("Debe ingresar un email");
    if (userPass == "") return setmessageError("Debe ingresar una contraseña");

    const userExist = await userExists(userEmail, userPass);
    if (userExist != null) {
      window.localStorage.setItem("sessionUser", JSON.stringify(userExist));
      navigate("/");
    } else {
      setmessageError("Credenciales incorrectas");
    }
  };

  const handleClicOnClose = () => {
    console.log("hi");
    setFolioInput("");
    setFolioData(null);
    onClose();
  };
  let mensaje = { msg: "", color: "" };
  if (folioData != null) {
    if (folioData.Status === "0") {
      mensaje.msg = "Asignado";
      mensaje.color = "gray";
    }
    if (folioData.Status === "1") {
      mensaje.msg = "Registrado";
      mensaje.color = "blue";
    }
    if (folioData.Status === "2") {
      mensaje.msg = "Liberado";
      mensaje.color = "green";
    }
  }
  return (
    <>
      <Box
        h="100vh"
        w="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        bgGradient="linear(to-l, blue.500, blue.400, blue.600)"
      >
        <Box
          display="flex"
          flexDir={{base: "column", sm:"column", md:"row"}}
          justifyContent="space-between"
          alignItems="center"
          gap={{base: "3", sm:"3", md:"5"}}
          h="auto"
          w="full"
          p="4"
          bg="whiteAlpha.500"
          boxShadow="lg"
          mb="4"
        >
          <Box
            display="flex"
            gap={{ base:"2", sm:"3", md:"2"}}
            alignItems="center"
            justifyContent="center"
          >
            <Image
              boxShadow="lg"
              h="50px"
              objectFit="cover"
              src={logo}
              align="logo"
              borderRadius="full"
            />
            <Heading size="xl" fontWeight="extrabold" color="white" pl={{ base: "1", sm: "1", md:"2"}}>
              GruApp
            </Heading>
          </Box>
          <Box display="flex" flexDir={{base:"column", sm:"column", md:"row"}} gap="3">
            <Button
              onClick={handleClickSearch}
              boxShadow="lg"
              w="full"
              color="white"
              _hover={{ color: "blue.500", background: "white" }}
              bg="blue.500"
            >
              ¿Donde esta mi auto?
            </Button>
            {display && (
              <InputGroup>
                <Input
                  value={folioInput}
                  onChange={handleChangeFolio}
                  w="auto"
                  bg="white"
                  variant="outline"
                  placeholder="Ingresa tu folio"
                />
                <InputRightElement>
                  <Box
                    onClick={handleSearch}
                    _hover={{ bg: "blue.300" }}
                    bg="blue.400"
                    w="full"
                    h="full"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Icon as={MdSearch} boxSize="5" color="white" />
                  </Box>
                </InputRightElement>
              </InputGroup>
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent={{base: "center", sm:"center", md:"space-between"}}
          alignItems="center"
          h={{base:"auto", md:"80vh"}}
          width="90%"
        >
          <Center h="auto" w="50%" p={5} mx="2" display={{base: "none", sm: "none", md:"block"}}>
            <Image
              w="100%"
              h="100%"
              src={marker}
              alt="Fondo1"
              objectFit="cover"
            />
          </Center>
          <Box
            mt={{base: "3", md:"0"}}
            h="auto"
            w={{base: "100%", md:"40%"}}
            bg="whiteAlpha.900"
            borderRadius="base"
            boxShadow="2xl"
          >
            <Box
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="#5DADE2"
              borderTopRadius="base"
            >
              <Heading fontWeight="semibold" color="white">
                Bienvenido
              </Heading>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              p="4"
              justifyContent="center"
              alignItems="center"
              gap="3"
            >
              <Text fontWeight="light" fontSize="larger">
                Inicio de sesión
              </Text>
              <Avatar src="https://bit.ly/broken-link" />
              <InputGroup>
                <InputLeftElement>
                  <Icon as={MdPerson} color="gray.500" />
                </InputLeftElement>
                <Input
                  onChange={handleGmailChange}
                  placeholder="Usuario"
                  size="md"
                  variant="filled"
                  border="1px"
                  borderColor="gray.400"
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={MdSecurity} color="gray.500" />
                </InputLeftElement>
                <Input
                  onChange={handlePassChange}
                  placeholder="Contraseña"
                  type="password"
                  size="md"
                  variant="filled"
                  border="1px"
                  borderColor="gray.400"
                />
              </InputGroup>
              {messageError != "" && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Upps, Ocurrio un error!</AlertTitle>
                  <AlertDescription>{messageError}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleclickAuth}
                colorScheme="blue"
                w="100%"
                my="5"
                boxShadow="lg"
              >
                Ingresar
              </Button>
            </Box>
          </Box>
        </Box>
        {folioData && (
          <Drawer onClose={handleClicOnClose} isOpen={isOpen} size="lg">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader bg="blue.500" color="white">
                <Heading textAlign="center">Detalles</Heading>
              </DrawerHeader>
              <DrawerBody>
                <Box
                  w="full"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p="5"
                  mt="4"
                  border="1px"
                  borderColor="gray.200"
                  boxShadow="lg"
                >
                  {/* {folioData != null ? ( */}
                  <Box w="full">
                    <Box display="flex" gap="2">
                      <Box
                        w="full"
                        display="flex"
                        gap="3"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <Badge>Folio:</Badge>
                        <Text>{folioData.Folio}</Text>
                      </Box>
                      <Box
                        w="full"
                        display="flex"
                        gap="3"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <Badge>Estado:</Badge>
                        {mensaje && (
                          <Text fontWeight="semibold" color={mensaje.color}>
                            {mensaje.msg}
                          </Text>
                        )}
                      </Box>
                    </Box>
                    <Box
                      w="full"
                      display="flex"
                      gap="3"
                      pt="2.5"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Badge>Fecha Entrada:</Badge>
                      <Text>{folioData.FechaRegistro}</Text>
                    </Box>
                    <Box
                      w="full"
                      display="flex"
                      gap="3"
                      pt="2.5"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Badge>Fecha Salida:</Badge>
                      {folioData.FechaSalida === "" ? (
                        <Text fontWeight="semibold" color="red">
                          Pendiente
                        </Text>
                      ) : (
                        <Text>{folioData.FechaSalida}</Text>
                      )}
                    </Box>
                    <Tabs w="full" isFitted variant="unstyled" pt="3">
                      <TabList mb="1em">
                        <Tab
                          _selected={{
                            boxShadow: "lg",
                            color: "white",
                            bg: "blue.400",
                            borderRadius: "base",
                            fontWeight: "bold",
                          }}
                        >
                          Detalles Vehiculo
                        </Tab>
                        <Tab
                          _selected={{
                            boxShadow: "lg",
                            color: "white",
                            bg: "blue.400",
                            borderRadius: "base",
                            fontWeight: "bold",
                          }}
                        >
                          Origen
                        </Tab>
                        <Tab
                          _selected={{
                            boxShadow: "lg",
                            color: "white",
                            bg: "blue.400",
                            borderRadius: "base",
                            fontWeight: "bold",
                          }}
                        >
                          Corralón Asignado
                        </Tab>
                        <Tab
                          _selected={{
                            boxShadow: "lg",
                            color: "white",
                            bg: "blue.400",
                            borderRadius: "base",
                            fontWeight: "bold",
                          }}
                          isDisabled={folioData.Costos.Estancia === ""}
                        >
                          Costos
                        </Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel w="full">
                          <Box display="flex" flexDir="column" gap="1" w="full">
                            <Box
                              w="full"
                              display="flex"
                              gap="2"
                              justifyContent="flex-start"
                              alignItems="center"
                            >
                              <Badge>Tipo:</Badge>
                              <Text>{folioData.DetallesAutomovil.Tipo}</Text>
                            </Box>
                            <Box
                              w="full"
                              display="flex"
                              gap="2"
                              justifyContent="flex-start"
                              alignItems="center"
                            >
                              <Badge>Descripcion:</Badge>
                              <Text>
                                {folioData.DetallesAutomovil.Descripcion}
                              </Text>
                            </Box>
                            <Box
                              w="full"
                              display="flex"
                              gap="2"
                              justifyContent="flex-start"
                              alignItems="center"
                            >
                              <Badge>Placa:</Badge>
                              <Text>{folioData.DetallesAutomovil.NPlaca}</Text>
                            </Box>
                          </Box>
                        </TabPanel>
                        <TabPanel>
                          <Box
                            w="full"
                            display="flex"
                            gap="2"
                            justifyContent="flex-start"
                            alignItems="center"
                          >
                            <Badge>Dirección:</Badge>
                            <Text>{folioData.Origen.Direccion}</Text>
                          </Box>
                          <Box
                            display="flex"
                            gap="1"
                            w="full"
                            justifyContent="center"
                            alignItems="center"
                            mt="3"
                          >
                            <Box
                              w="full"
                              display="flex"
                              flexDir="column"
                              gap="1"
                            >
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Colonia:</Badge>
                                <Text>{folioData.Origen.Colonia}</Text>
                              </Box>
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Municipio:</Badge>
                                <Text>{folioData.Origen.Municipio}</Text>
                              </Box>
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Codigo Postal:</Badge>
                                <Text>{folioData.Origen.CP}</Text>
                              </Box>
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Latitud:</Badge>
                                <Text>{folioData.Origen.Latitud}</Text>
                              </Box>
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Longitud:</Badge>
                                <Text>{folioData.Origen.Longitud}</Text>
                              </Box>
                            </Box>
                            <Box w="full" borderRadius="lg">
                              <MapViewFolio
                                latitud={folioData.Origen.Latitud}
                                longitud={folioData.Origen.Longitud}
                              />
                            </Box>
                          </Box>
                        </TabPanel>
                        <TabPanel>
                          <Box
                            w="full"
                            display="flex"
                            gap="2"
                            justifyContent="flex-start"
                            alignItems="center"
                          >
                            <Badge>Dirección:</Badge>
                            <Text>{folioData.CorralonAsignado.Direccion}</Text>
                          </Box>
                          <Box
                            display="flex"
                            gap="1"
                            w="full"
                            justifyContent="center"
                            alignItems="center"
                            mt="3"
                          >
                            <Box
                              w="full"
                              display="flex"
                              flexDir="column"
                              gap="1"
                            >
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Nombre:</Badge>
                                <Text>{folioData.CorralonAsignado.Nombre}</Text>
                              </Box>
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Región:</Badge>
                                <Text>{folioData.CorralonAsignado.Region}</Text>
                              </Box>
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Contacto:</Badge>
                                <Text>
                                  {folioData.CorralonAsignado.Contacto}
                                </Text>
                              </Box>
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Celular:</Badge>
                                <Text>
                                  {folioData.CorralonAsignado.Celular}
                                </Text>
                              </Box>
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Latitud:</Badge>
                                <Text>
                                  {folioData.CorralonAsignado.Latitud}
                                </Text>
                              </Box>
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Longitud:</Badge>
                                <Text>
                                  {folioData.CorralonAsignado.Longitud}
                                </Text>
                              </Box>
                              <Box
                                w="full"
                                display="flex"
                                gap="2"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Badge>Distancia:</Badge>
                                <Text>
                                  {folioData.CorralonAsignado.Distancia}m
                                </Text>
                              </Box>
                            </Box>
                            <Box w="full" borderRadius="lg">
                              <MapViewFolio
                                latitud={folioData.CorralonAsignado.Latitud}
                                longitud={folioData.CorralonAsignado.Longitud}
                              />
                            </Box>
                          </Box>
                        </TabPanel>
                        <TabPanel>
                          <Box px="8">
                            <Box>
                              <Text
                                textAlign="center"
                                fontSize="lg"
                                fontWeight="bold"
                              >
                                Resumen de Costos:
                              </Text>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="space-evenly"
                              alignItems="center"
                            >
                              <Badge colorScheme="blue">
                                Cobro por Distancia:
                              </Badge>
                              <Text fontWeight="light">
                                ${folioData.Costos.Distancia} pesos
                              </Text>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="space-evenly"
                              alignItems="center"
                            >
                              <Badge colorScheme="blue">
                                Cobro por Estancia:
                              </Badge>
                              <Text fontWeight="light">
                                ${folioData.Costos.Estancia} pesos
                              </Text>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="space-evenly"
                              alignItems="center"
                            >
                              <Badge colorScheme="blue">
                                Cobro por Maniobra:
                              </Badge>
                              <Text fontWeight="light">
                                ${folioData.Costos.Maniobras} pesos
                              </Text>
                            </Box>
                            <Box>
                              <Text pt="2" textAlign="end">
                                Total: ${folioData.Costos.Total} pesos
                              </Text>
                            </Box>
                          </Box>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Box>
                </Box>
              </DrawerBody>
              <DrawerFooter
                display="flex"
                justifyContent="center"
                borderTopWidth="1px"
              >
                <Button
                  w="full"
                  colorScheme="red"
                  boxShadow="md"
                  onClick={handleClicOnClose}
                >
                  Cancelar
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </Box>
    </>
  );
};

export default LoginContainer;
