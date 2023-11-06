import {
  Box,
  Button,
  HStack,
  Heading,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  Input,
  Badge,
  Text,
  Divider,
  InputGroup,
  InputLeftElement,
  Icon,
  InputRightElement,
  FormErrorMessage,
} from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import { FiTrash2, FiEdit, FiPlusCircle, FiPlus } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { useRef, useState, useEffect } from "react";
import {
  CreateNewElement,
  DeleteElement,
  ObtenerDataDB,
  UpdateElement,
} from "../firebase/firebase";
import { v4 as uuid } from "uuid";
import { useToast } from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";
import MapaView from "./MapaView";

const initailForm = {
  Nombre: "",
  Region: "1",
  Rol: "Lunes",
  Contacto: "",
  Celular: "",
  Direccion: "",
  Latitud: "",
  Longitud: "",
  Status: "Activo",
};

const CorralonesContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mostrarModal1, setMostrarModal1] = useState(false);
  const [suggestions, setSuggestions] = useState([]); //Arreglo de Sugerencias de direcciones
  const [data1, setdata1] = useState([]);
  const [form, setForm] = useState(initailForm);
  const [validationErrors, setValidationErrors] = useState({});
  const [messageAction, setmessageAction] = useState("");
  const [user, setUser] = useState(null);
  const [isDelet, setIsDelet] = useState(false);
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const toast = useToast();
  const [display, setDisplay] = useState(false); //Manejo de la visibilidad de las sugerencias de direcciones
  const wrapperRef = useRef(null);
  const apiKey = "DDlA0KW1ZhZImumGb0U23rdJd4TnhLIC"; //API KEY Mapquest

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (form.Direccion != "") {
      fetch(
        `http://www.mapquestapi.com/search/v3/prediction?limit=5&collection=adminArea,poi,address&key=${apiKey}&q=${form.Direccion}`
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
  }, [form.Direccion]);

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  const updateDirection = async (direction) => {
    form.Direccion = direction;
    const { lat, lng } = await handleClickDirection(direction);
    setForm({
      ...form,
      Latitud: lat.toString(),
      Longitud: lng.toString(),
    });
  };

  const handleClickDirection = async (direction) => {
    if (form.Direccion !== "") {
      console.log("si hay datos en input", direction);
      try {
        const response = await fetch(
          `https://www.mapquestapi.com/geocoding/v1/address?key=${apiKey}&location=${direction}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const locationCoor = data.results[0].locations[0].displayLatLng;
            return locationCoor;
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
      return null;
    }
  };

  const clearInput = () => {
    setForm({
      ...form,
      Direccion: "",
      Latitud: "",
      Longitud: "",
    });
    setSuggestions([]);
  };

  async function getData() {
    try {
      const datos = await ObtenerDataDB("Corralones");
      setdata1(datos);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleClicOpenModal = () => {
    onOpen();
    setmessageAction("Nuevo");
  };

  const validateForm = () => {
    const errors = {};

    if (!form.Nombre.trim()) {
      errors.Nombre = "El campo Nombre o razon social es obligatorio";
    }

    if (!form.Direccion.trim()) {
      errors.Direccion = "El campo Dirección es obligatorio";
    }

    if (!form.Contacto.trim()) {
      errors.Contacto = "El campo Contacto es obligatorio";
    }

    if (!form.Celular.trim()) {
      errors.Celular = "El campo Celular es obligatorio";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0; // Devuelve true si no hay errores
  };
  const handleClickNewUser = async () => {
    const isValid = validateForm();
    if (isValid) {
      const newElement = {
        id: uuid(),
        Nombre: form.Nombre,
        Region: form.Region,
        Rol: form.Rol,
        Direccion: form.Direccion,
        Coordenadas: {
          Latitud: form.Latitud.toString(),
          Longitud: form.Longitud.toString(),
        },
        Contacto: form.Contacto,
        Celular: form.Celular,
        Status: form.Status,
      };
      console.log(newElement);
      const res = await CreateNewElement("Corralones", newElement);
      console.log(JSON.stringify(res));
      setForm(initailForm);
      getData();
      onClose();

      showToast(
        "Corralon Registrado",
        "El corralon ha sido registrado.",
        "success"
      );
    } else {
      showToast(
        "Error de validación",
        "Por favor, corrige los errores en el formulario.",
        "error"
      );
    }
  };

  const handleEditElement = (row) => {
    setUser(row);
    setmessageAction("Editar");
    console.log(row);
    const userEdit = {
      Nombre: row.Nombre,
      Region: row.Region,
      Rol: row.Rol,
      Contacto: row.Contacto,
      Celular: row.Celular,
      Direccion: row.Direccion,
      Latitud: row.Coordenadas.Latitud,
      Longitud: row.Coordenadas.Longitud,
      Status: row.Status,
    };
    setForm(userEdit);
    onOpen();
  };

  const handleDeletElement = async (row) => {
    setUser(row);
    setIsDelet(true);
  };

  const handleDeletUser = async () => {
    console.log(user);
    const res = await DeleteElement("Corralones", user.docId);
    console.log("registro eliminado:", res);
    setIsDelet(false);
    getData();
    setUser(null);
    showToast(
      "Corralón Eliminado",
      "El corralón ha sido eliminado.",
      "success"
    );
  };

  const handleCancelDelet = () => {
    setUser(null);
    setIsDelet(false);
  };

  const handleClicUpdateUser = async () => {
    const isValid = validateForm();
    if (isValid) {
      const editElement = {
        id: user.id,
        Nombre: form.Nombre,
        Region: form.Region,
        Rol: form.Rol,
        Direccion: form.Direccion,
        Coordenadas: {
          Latitud: form.Latitud,
          Longitud: form.Longitud,
        },
        Contacto: form.Contacto,
        Celular: form.Celular,
        Status: form.Status,
      };
      console.log(editElement);
      const res = await UpdateElement("Corralones", user.docId, editElement);
      console.log(JSON.stringify(res));
      setForm(initailForm);
      getData();
      onClose();
    } else {
      showToast("Error de validación", "Por favor, corrige los errores en el formulario.", "error");
    }
  };

  const handleClicOnClose = () => {
    setForm(initailForm);
    setValidationErrors({});
    onClose();
  };

  const handleClickDetails = (row) => {
    setUser(row);
    setMostrarModal1(true);
    console.log(user);
  };

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#5DADE2",
        fontSize: "16px",
        fontWeight: "bold",
        color: "white",
      },
    },
  };

  const Headers = [
    { name: "Region", selector: (row) => row.Region, sortable: true },
    { name: "Nombre", selector: (row) => row.Nombre, sortable: true },
    { name: "Rol", selector: (row) => row.Rol, sortable: true },
    { name: "Direccion", selector: (row) => row.Direccion, sortable: true },
    {
      name: "Coordenadas",
      selector: (row) => (
        <Box>
          <Text>Lat: {row.Coordenadas.Latitud}</Text>
          <Text>Lon: {row.Coordenadas.Longitud}</Text>
        </Box>
      ),
      sortable: true,
    },
    { name: "Contacto", selector: (row) => row.Contacto, sortable: true },
    { name: "Celular", selector: (row) => row.Celular, sortable: true },
  ];

  const columnsPermission = [
    ...Headers,
    {
      name: "Estado",
      cell: (row) =>
        row.Status == "Activo" ? (
          <Badge fontWeight="medium" colorScheme="green">
            Activo
          </Badge>
        ) : (
          <Badge fontWeight="medium" colorScheme="red">
            Inactivo
          </Badge>
        ),
    },
    {
      name: "Detalles",
      selector: (row) => (
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Button
            leftIcon={<FiPlus />}
            size="sm"
            colorScheme="linkedin"
            onClick={() => handleClickDetails(row)}
          >
            Más detalles
          </Button>
        </Box>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <Box display="flex" flexDir="column" gap="1" m="1">
          <Button
            rightIcon={<FiEdit />}
            size="xs"
            colorScheme="green"
            className="btn-editar"
            onClick={() => handleEditElement(row)}
          >
            Editar
          </Button>
          <Button
            rightIcon={<FiTrash2 />}
            size="xs"
            colorScheme="red"
            className="btn-eliminar"
            onClick={() => handleDeletElement(row)}
          >
            Eliminar
          </Button>
        </Box>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <Box h="auto" w="auto" bg="white">
      <Box
        display="flex"
        p="4"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="lg" noOfLines={1} fontWeight="medium">
          Corralones
        </Heading>
        <Button
          onClick={handleClicOpenModal}
          rightIcon={<FiPlusCircle />}
          colorScheme="blue"
          size="sm"
        >
          Nuevo Corralon
        </Button>
      </Box>
      <HStack
        display="flex"
        flexDir="column"
        fontWeight="light"
        alignItems="flex-start"
        w="full"
        h="auto"
        p="4"
      >
        <DataTable
          data={data1}
          columns={columnsPermission}
          highlightOnHover
          pointerOnHover
          pagination
          paginationPerPage={5}
          striped
          responsive
          selectableRowsHighlight
          customStyles={customStyles}
        />
      </HStack>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={handleClicOnClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="blue.500" color="white">
            {messageAction} Corralón
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <Box display="flex" gap="3">
              <FormControl isRequired isInvalid={!!validationErrors.Nombre}>
                <FormLabel>Nombre:</FormLabel>
                <Input
                  name="Nombre"
                  value={form.Nombre}
                  onChange={handleChange}
                  ref={initialRef}
                  placeholder="Nombre o razon Social"
                />
                {validationErrors.Nombre && (
                  <FormErrorMessage>{validationErrors.Nombre}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Status:</FormLabel>
                <Select
                  name="Status"
                  value={form.Status}
                  onChange={handleChange}
                  ref={initialRef}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </Select>
              </FormControl>
            </Box>

            <Box display="flex" gap="3">
              <FormControl mt={3}>
                <FormLabel>Rol:</FormLabel>
                <Select name="Rol" value={form.Rol} onChange={handleChange}>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miercoles">Miercoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                </Select>
              </FormControl>

              <FormControl mt={3}>
                <FormLabel>Región:</FormLabel>
                <Select
                  name="Region"
                  value={form.Region}
                  onChange={handleChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap="3">
              <FormControl
                mt={3}
                isRequired
                isInvalid={!!validationErrors.Contacto}
              >
                <FormLabel>Contacto:</FormLabel>
                <Input
                  name="Contacto"
                  value={form.Contacto}
                  onChange={handleChange}
                  placeholder="Ingrese datos"
                />
                {validationErrors.Contacto && (
                  <FormErrorMessage>
                    {validationErrors.Contacto}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                mt={3}
                isRequired
                isInvalid={!!validationErrors.Celular}
              >
                <FormLabel>Celular:</FormLabel>
                <Input
                  name="Celular"
                  value={form.Celular}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Ingrese datos"
                />
                {validationErrors.Celular && (
                  <FormErrorMessage>
                    {validationErrors.Celular}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box>

            <Divider orientation="horizontal" whiteSpace="2" />

            <Box
              ref={wrapperRef}
              display="flex"
              flexDir="column"
              gap="3"
              mt="4"
            >
              <Text color="blackAlpha.700" fontWeight="medium">
                Dirección:
              </Text>
              <Box position="relative" width="full" zIndex={2}>
                <FormControl isRequired isInvalid={!!validationErrors.Direccion}>
                  <InputGroup w="auto">
                    <InputLeftElement>
                      <Icon as={MdSearch} boxSize="5" color="gray.400" />
                    </InputLeftElement>
                    <Input
                      name="Direccion"
                      textTransform="capitalize"
                      value={form.Direccion}
                      onClick={() => setDisplay(!display)}
                      onChange={handleChange}
                      placeholder="Escriba la dirección"
                      size="md"
                      variant="outline"
                      bg="white"
                      borderRadius="md"
                    />
                    <InputRightElement>
                      {form.Direccion != "" ? (
                        <Button
                          bg="blue.300"
                          _hover={{ bg: "blue.200" }}
                          color="white"
                          onClick={clearInput}
                        >
                          x
                        </Button>
                      ) : (
                        <Box></Box>
                      )}
                    </InputRightElement>
                  </InputGroup>
                  {validationErrors.Direccion && (
                  <FormErrorMessage>
                    {validationErrors.Direccion}
                  </FormErrorMessage>
                )}
                </FormControl>
                {display && (
                  <Box
                    position="absolute"
                    top="42"
                    w="full"
                    borderRadius="base"
                  >
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
                            onClick={() => {
                              updateDirection(value);
                              setDisplay(false);
                            }}
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
            </Box>
          </ModalBody>
          <ModalFooter>
            {messageAction === "Nuevo" ? (
              <Button onClick={handleClickNewUser} colorScheme="blue" mr={3}>
                Guardar
              </Button>
            ) : (
              <Button onClick={handleClicUpdateUser} colorScheme="blue" mr={3}>
                Actualizar
              </Button>
            )}
            <Button colorScheme="red" onClick={handleClicOnClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {user && (
        <Drawer
          isOpen={mostrarModal1}
          placement="right"
          onClose={() => setMostrarModal1(false)}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader bg="blue.500" color="white">
              {user.Nombre}
            </DrawerHeader>

            <DrawerBody>
              <Box display="flex" flexDir="column" gap="2">
                <Box>
                  <Badge colorScheme="blue">Dirección:</Badge>
                  <Text fontWeight="light"> {user.Direccion}</Text>
                </Box>
                <Box>
                  <Badge colorScheme="blue">Contacto:</Badge>
                  <Text fontWeight="light"> {user.Contacto}</Text>
                  <Badge colorScheme="blue">Celular:</Badge>
                  <Text fontWeight="light"> {user.Celular}</Text>
                </Box>
                <Box gap="2">
                  <Badge colorScheme="blue">Disponibilidad:</Badge>
                  <Text fontWeight="light"> {user.Rol}</Text>
                  <Badge colorScheme="blue">Region:</Badge>
                  <Text fontWeight="light"> {user.Region}</Text>
                </Box>

                <Box w="full">
                  <MapaView user={user} />
                </Box>
              </Box>
            </DrawerBody>

            <DrawerFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => setMostrarModal1(false)}
              >
                Salir
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      {user != null && (
        <AlertDialog isOpen={isDelet} onClose={() => setIsDelet(false)}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Eliminar Corralon
              </AlertDialogHeader>

              <AlertDialogBody>
                ¿Deseas eliminar al corralon {user.Nombre}?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={handleCancelDelet}>Cancelar</Button>
                <Button colorScheme="red" onClick={handleDeletUser} ml={3}>
                  Eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </Box>
  );
};

export default CorralonesContainer;
