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
  FormControl,
  FormLabel,
  FormHelperText,
  Badge,
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
import { MdPerson, MdSecurity } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getRegisterInfo, userExists } from "../firebase/firebase";
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { CircularProgress } from "@chakra-ui/react";

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

  const handleClicSearchFolio = async () => {
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
    if (!folio)
      return toast({
        title: "Upps... Ocurrio un error",
        description: "No existen coincidencias con el folio " + folioInput,
        variant: "solid",
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    setFolioData(folio);
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
          position="sticky"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap="5"
          h="12vh"
          w="full"
          p="4"
          bg="whiteAlpha.500"
          boxShadow="lg"
          mb="4"
        >
          <Box
            display="flex"
            gap="3"
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
            <Heading size="xl" fontWeight="extrabold" color="white" pl="5">
              GruApp
            </Heading>
          </Box>
          <Box pr="3">
            <Button
              onClick={handleClickSearch}
              boxShadow="lg"
              w="auto"
              color="white"
              _hover={{ color: "blue.500", background: "white" }}
              bg="blue.500"
            >
              ¿Donde esta mi auto?
            </Button>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          h="80vh"
          width="90%"
        >
          <Center h="auto" w="50%" p={5} mx="2" borderLeftRadius="base">
            <Image
              w="100%"
              h="auto"
              src={marker}
              alt="Fondo1"
              objectFit="cover"
            />
          </Center>
          <Box
            h="auto"
            w="40%"
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
        <Drawer onClose={onClose} isOpen={isOpen} size="lg">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader bg="blue.500" color="white">
              <Heading textAlign="center">Encuentra tu Vehiculo</Heading>
            </DrawerHeader>
            <DrawerBody>
              <Box border="2px" borderColor="gray.100" boxShadow="lg" p="4">
                <FormControl isRequired>
                  <FormLabel>Folio</FormLabel>
                  <Input
                    onChange={handleChangeFolio}
                    placeholder="2023-0000-0000-000-00"
                  />
                  <FormHelperText>
                    Escribe tu folio para obtener información acerca de tu
                    vehiculo.
                  </FormHelperText>
                </FormControl>
                {messageErrorF != "" && (
                  <Alert status="error" variant="left-accent">
                    <AlertIcon />
                    <AlertTitle>Upps, Ocurrio un error!</AlertTitle>
                    <AlertDescription>{messageErrorF}</AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={handleClicSearchFolio}
                  w="full"
                  mt="3"
                  colorScheme="twitter"
                  boxShadow="lg"
                >
                  Buscar
                </Button>
              </Box>
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
                {folioData != null ? (
                  <Box w="full">
                    <Heading size="md">Detalles del Registro</Heading>
                    <Box
                      w="full"
                      display="flex"
                      gap="3"
                      borderTop="1px"
                      borderColor="gray.300"
                      pt="2.5"
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
                      <Text>{folioData.FechaSalida}</Text>
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
                              <Text>{folioData.DetallesAutomovil.Descripcion}</Text>
                            </Box>
                            <Box
                              w="full"
                              display="flex"
                              gap="2"
                              justifyContent="flex-start"
                              alignItems="center"
                            >
                              <Badge>Placas:</Badge>
                              <Text>{folioData.DetallesAutomovil.NPlaca}</Text>
                            </Box>
                          </Box>
                        </TabPanel>
                        <TabPanel>
                          <p>two!</p>
                        </TabPanel>
                        <TabPanel>
                          <p>tree!</p>
                        </TabPanel>
                        <TabPanel>
                          <p>four!</p>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Box>
                ) : (
                  <CircularProgress
                    size="100px"
                    isIndeterminate
                    color="green.300"
                  />
                )}
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
                onClick={onClose}
              >
                Cancelar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};

export default LoginContainer;
