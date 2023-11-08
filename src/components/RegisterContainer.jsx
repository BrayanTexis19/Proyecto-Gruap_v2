import {
  Badge,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useState, useEffect, useRef } from "react";
import {
  DeleteElement,
  ObtenerDataDB,
  UpdateElement,
} from "../firebase/firebase";
import copy from "clipboard-copy";
import { useToast } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import CustomLoader from "./CustomLoader";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";

const initialForm = {
  Distancia: "",
  Estancia: "",
  Maniobras: "",
  FechaSalida: "",
  Folio: "",
};

const RegisterContainer = () => {
  const [data, setdata] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [Registro, setRegistro] = useState(null);
  const [isFilter, setisFilter] = useState(false)
  const [costos, setCostos] = useState({
    cost1: 0,
    cost2: 0,
    cost3: 0,
    cost4: 0,
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [messageAction, setmessageAction] = useState("");
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState(true);
  const [isDelet, setIsDelet] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigation = useNavigate();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const timeout = setTimeout(() => {
      getData();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const filteredData = filterText
  ? data.filter((item) =>
      item.Folio.toLowerCase().includes(filterText.toLowerCase())
    )
  : data;
  console.log(filteredData, filterText.toLowerCase());
  
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

  const CopyToClipboardExample = async (textToCopy) => {
    try {
      await copy(textToCopy);
      return toast({
        title: "Copiado al portapapeles",
        description: textToCopy,
        variant: "solid",
        status: "success",
        duration: 1000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al copiar al portapapeles: " + error);
    }
  };
  async function getData() {
    try {
      const datos = await ObtenerDataDB("Registros");
      setdata(datos);
      setPending(false);
    } catch (error) {
      console.log(error);
    }
  }

  const validateFormCostos = () => {
    const errors = {};

    if (!form.Estancia.trim()) {
      errors.Estancia = "El campo Dias de Estancia es obligatorio";
    }

    if (!form.Maniobras.trim()) {
      errors.Maniobras = "El campo Maniobras es obligatorio";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const validateFormSal = () => {
    const errors = {};

    if (!form.FechaSalida.trim()) {
      errors.FechaSalida = "El campo Fecha es obligatorio";
    }

    if (!form.Folio.trim()) {
      errors.Folio = "El campo Folio es obligatorio";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleRegisterNewCostos = async () => {
    const totalCargo =
      costos.cost1 + costos.cost2 + costos.cost3 + costos.cost4;
    const isValid = validateFormCostos();
    if (isValid) {
      const editElement = {
        docid: Registro.docId,
        CantidadVehiculos: Registro.CantidadVehiculos,
        DetallesAutomovil: {
          Tipo: Registro.DetallesAutomovil.Tipo,
          NPlaca: Registro.DetallesAutomovil.NPlaca,
          Descripcion: Registro.DetallesAutomovil.Descripcion,
        },
        FechaRegistro: Registro.FechaRegistro,
        FechaSalida: "",
        Folio: Registro.Folio,
        TipoGrua: Registro.TipoGrua,
        Origen: {
          Direccion: Registro.Origen.Direccion,
          Municipio: Registro.Origen.Municipio,
          Colonia: Registro.Origen.Colonia,
          CP: Registro.Origen.CP,
          Latitud: Registro.Origen.Latitud,
          Longitud: Registro.Origen.Longitud,
        },
        CorralonAsignado: {
          Direccion: Registro.CorralonAsignado.Direccion,
          Nombre: Registro.CorralonAsignado.Nombre,
          Region: Registro.CorralonAsignado.Region,
          Distancia: Registro.CorralonAsignado.Distancia,
          Contacto: Registro.CorralonAsignado.Contacto,
          Celular: Registro.CorralonAsignado.Celular,
          Latitud: Registro.CorralonAsignado.Latitud,
          Longitud: Registro.CorralonAsignado.Longitud,
        },
        Costos: {
          Distancia: costos.cost1.toFixed(2),
          TipoGrua: costos.cost4,
          Estancia: costos.cost2.toFixed(2),
          Maniobras: costos.cost3.toFixed(2),
          Total: totalCargo.toFixed(2),
        },
        Status: "1",
      };
      const res = await UpdateElement("Registros", Registro.docId, editElement);
      console.log(JSON.stringify(res));
      setForm(initialForm);
      getData();
      setMostrarModal(false);
      showToast(
        "Costos Registrados",
        "Los costos han sido registrados.",
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

  const handleClicRegisterLiberacion = (row) => {
    setRegistro(row);
    console.log(row);
    setmessageAction("Registrar Liberación");
    setMostrarModal(true);
  };

  const handleClicRegisterCostos = (row) => {
    setRegistro(row);
    console.log(row);
    setmessageAction("Registrar Costos");
    const RegistroEdit = {
      Distancia: row.CorralonAsignado.Distancia,
      Estancia: row.Costos.Estancia,
      Maniobras: row.Costos.Maniobras,
    };
    setCostos({
      ...costos,
      cost1: parseInt(row.Costos.Distancia),
      cost4: row.Costos.TipoGrua,
    });
    setForm(RegistroEdit);
    setMostrarModal(true);
  };

  const handleClicOnClose = () => {
    setForm(initialForm);
    setValidationErrors({});
    setMostrarModal(false);
  };

  const handleRegisterSal = async () => {
    const isValid = validateFormSal();
    if (isValid) {
      if (Registro.Folio === form.Folio) {
        if (Registro.Costos.Estancia != "") {
          const editElement = {
            docid: Registro.docId,
            CantidadVehiculos: Registro.CantidadVehiculos,
            DetallesAutomovil: {
              Tipo: Registro.DetallesAutomovil.Tipo,
              NPlaca: Registro.DetallesAutomovil.NPlaca,
              Descripcion: Registro.DetallesAutomovil.Descripcion,
            },
            FechaRegistro: Registro.FechaRegistro,
            FechaSalida: form.FechaSalida,
            Folio: Registro.Folio,
            TipoGrua: Registro.TipoGrua,
            Origen: {
              Direccion: Registro.Origen.Direccion,
              Municipio: Registro.Origen.Municipio,
              Colonia: Registro.Origen.Colonia,
              CP: Registro.Origen.CP,
              Latitud: Registro.Origen.Latitud,
              Longitud: Registro.Origen.Longitud,
            },
            CorralonAsignado: {
              Direccion: Registro.CorralonAsignado.Direccion,
              Nombre: Registro.CorralonAsignado.Nombre,
              Region: Registro.CorralonAsignado.Region,
              Distancia: Registro.CorralonAsignado.Distancia,
              Contacto: Registro.CorralonAsignado.Contacto,
              Celular: Registro.CorralonAsignado.Celular,
              Latitud: Registro.CorralonAsignado.Latitud,
              Longitud: Registro.CorralonAsignado.Longitud,
            },
            Costos: {
              Distancia: Registro.Costos.Distancia,
              Estancia: Registro.Costos.Estancia,
              Maniobras: Registro.Costos.Maniobras,
              Total: Registro.Costos.Total,
            },
            Status: "2",
          };
          console.log(editElement);
          const res = await UpdateElement(
            "Registros",
            Registro.docId,
            editElement
          );
          console.log(JSON.stringify(res));
          setForm(initialForm);
          getData();
          setMostrarModal(false);
          return showToast(
            "Liberación Registrada",
            "El registro ha sido liberado.",
            "success"
          );
        } else {
          return showToast(
            "Error de Liberación",
            "No puedes liberar un registro sin haber registrado costos anteriormente.",
            "error"
          );
        }
      }
      return showToast(
        "Error de Liberación",
        "No coincide el folio ingresado con el del registro.",
        "error"
      );
    } else {
      showToast(
        "Error de validación",
        "Por favor, corrige los errores en el formulario.",
        "error"
      );
    }
  };

  const handleDeletElement = async (row) => {
    setUser(row);
    setIsDelet(true);
  };

  const handleDeletUser = async () => {
    console.log(user);
    const res = await DeleteElement("Registros", user.docId);
    console.log("registro eliminado:", res);
    setIsDelet(false);
    getData();
    setUser(null);
    showToast(
      "Registro Eliminado",
      "El registro ha sido eliminado.",
      "success"
    );
  };

  const handleCancelDelet = () => {
    setUser(null);
    setIsDelet(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "Estancia") {
      if (e.target.value === "") return setCostos({ ...costos, cost2: 0 });
      setCostos({
        ...costos,
        cost2: parseInt(e.target.value) * 40,
      });
    }
    if (e.target.name === "Maniobras") {
      if (e.target.value === "") return setCostos({ ...costos, cost3: 0 });
      setCostos({
        ...costos,
        cost3: parseInt(e.target.value) * 50,
      });
    }
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
    {
      name: "Folio",
      selector: (row) => (
        <Box display="flex" alignItems="center" gap="1">
          <Text
            fontWeight="semibold"
            onClick={() => CopyToClipboardExample(row.Folio)}
          >
            {row.Folio}
          </Text>
          <CopyIcon onClick={() => CopyToClipboardExample(row.Folio)} />
        </Box>
      ),
      sortable: true,
    },
    {
      name: "Detalles Vehiculo",
      selector: (row) => (
        <Box>
          <Text>Tipo: {row.DetallesAutomovil.Tipo}</Text>
          <Text>Placa: {row.DetallesAutomovil.NPlaca}</Text>
          <Text>Descripción: {row.DetallesAutomovil.Descripcion}</Text>
        </Box>
      ),
      sortable: true,
    },
    {
      name: "Origen",
      selector: (row) => (
        <Box p={2}>
          <Accordion allowMultiple>
            <AccordionItem>
              <h3>
                <AccordionButton
                  borderRadius="base"
                  bg="blue.300"
                  _hover={{ bg: "blue.400" }}
                  _expanded={{ bg: "blue.400" }}
                >
                  <AccordionIcon color="white" />
                  <Box as="span" flex="1" textAlign="left">
                    <Text color="white" fontSize="sm">
                      {row.Origen.Direccion}
                    </Text>
                  </Box>
                </AccordionButton>
              </h3>
              <AccordionPanel pb={1} color="gray.700">
                <Text>Municipio: {row.Origen.Municipio}</Text>
                <Text>Colonia: {row.Origen.Colonia}</Text>
                <Text>CP: {row.Origen.CP}</Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      ),
      sortable: true,
    },
    {
      name: "Corralon Asignado",
      selector: (row) => (
        <Box>
          <Accordion allowMultiple>
            <AccordionItem>
              <h3>
                <AccordionButton
                  borderRadius="base"
                  bg="blue.300"
                  _hover={{ bg: "blue.400" }}
                  _expanded={{ bg: "blue.400" }}
                >
                  <AccordionIcon color="white" />
                  <Box as="span" flex="1" textAlign="left">
                    <Text color="white" fontSize="sm">
                      {row.CorralonAsignado.Nombre}
                    </Text>
                  </Box>
                </AccordionButton>
              </h3>
              <AccordionPanel pb={1} color="gray.700">
                <Text>Dirección: {row.CorralonAsignado.Direccion}</Text>
                <Text>Región: {row.CorralonAsignado.Region}</Text>
                <Text>Contacto: {row.CorralonAsignado.Contacto}</Text>
                <Text>Celular: {row.CorralonAsignado.Celular}</Text>
                <Text>Distancia: {row.CorralonAsignado.Distancia}m</Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      ),
      sortable: true,
    },
    {
      name: "Fecha Registro",
      selector: (row) => row.FechaRegistro,
      sortable: true,
    },
    {
      name: "Fecha Liberación",
      selector: (row) =>
        row.FechaSalida === "" ? (
          <Box>
            <Box display="flex">
              <Badge colorScheme="red">Pendiente</Badge>
            </Box>
            <Box w="full" mt="2">
              <Button
                onClick={() => handleClicRegisterLiberacion(row)}
                leftIcon={<FiPlusCircle />}
                w="full"
                variant="ghost"
                size="xs"
                colorScheme="red"
              >
                Registrar Liberación
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Text>{row.FechaSalida}</Text>
          </Box>
        ),
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) => row.FechaSalida === "",
          style: {
            backgroundColor: "#FFF5F5",
            color: "white",
          },
        },
      ],
    },
    {
      name: "Costos",
      selector: (row) =>
        row.Costos.Estancia === "" ? (
          <Box>
            <Accordion allowMultiple>
              <AccordionItem>
                <h3>
                  <AccordionButton
                    borderRadius="base"
                    bg="blue.300"
                    _hover={{ bg: "blue.400" }}
                    _expanded={{ bg: "blue.400" }}
                  >
                    <AccordionIcon color="white" />
                    <Box as="span" flex="1" textAlign="left">
                      <Text color="white" fontSize="sm">
                        Resumen de costos
                      </Text>
                    </Box>
                  </AccordionButton>
                </h3>
                <AccordionPanel pb={1} color="gray.700">
                  <Text>Distancia: ${row.Costos.Distancia} pesos</Text>
                  <Text>
                    Tipo Grua ({row.TipoGrua}): ${row.Costos.TipoGrua} pesos
                  </Text>
                  <Box display="flex" gap="2">
                    <Text>Estancia: </Text>
                    <Badge colorScheme="red">Pendiente</Badge>
                  </Box>
                  <Box display="flex" gap="2">
                    <Text>Maniobras: </Text>
                    <Badge colorScheme="red">Pendiente</Badge>
                  </Box>
                  <Box w="full" mt="2">
                    <Button
                      onClick={() => handleClicRegisterCostos(row)}
                      leftIcon={<FiPlusCircle />}
                      w="full"
                      variant="ghost"
                      size="xs"
                      colorScheme="red"
                    >
                      Registrar Costos
                    </Button>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        ) : (
          <Box>
            <Accordion allowMultiple>
              <AccordionItem>
                <h3>
                  <AccordionButton
                    borderRadius="base"
                    bg="blue.300"
                    _hover={{ bg: "blue.400" }}
                    _expanded={{ bg: "blue.400" }}
                  >
                    <AccordionIcon color="white" />
                    <Box as="span" flex="1" textAlign="left">
                      <Text color="white" fontSize="sm">
                        Resumen de costos
                      </Text>
                    </Box>
                  </AccordionButton>
                </h3>
                <AccordionPanel pb={1} color="gray.700">
                  <Text>Distancia: ${row.Costos.Distancia} pesos</Text>
                  <Text>
                    Tipo Grua ({row.TipoGrua}): ${row.Costos.TipoGrua} pesos
                  </Text>
                  <Text>Estancia: ${row.Costos.Estancia} pesos</Text>
                  <Text>Maniobras: ${row.Costos.Maniobras} pesos</Text>
                  <Text fontWeight="semibold">
                    Total: ${row.Costos.Total} pesos
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        ),
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row) => {
        if (row.Status === "0") {
          return (
            <Badge fontWeight="medium" colorScheme="yellow">
              Asignado
            </Badge>
          );
        }
        if (row.Status === "1") {
          return (
            <Badge fontWeight="medium" colorScheme="blue">
              Registrado
            </Badge>
          );
        }
        if (row.Status === "2") {
          return (
            <Badge fontWeight="medium" colorScheme="green">
              Liberado
            </Badge>
          );
        }
      },
    },
  ];

  const columnsPermission = [
    ...Headers,
    {
      name: "Acciones",
      cell: (row) => (
        <Box display="flex" flexDir="column" gap="1" m="1">
          <Button
            rightIcon={<FiTrash2 />}
            size="sm"
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

  const columns =
    JSON.parse(localStorage.getItem("sessionUser")).Rol === "Admin"
      ? columnsPermission
      : Headers;

  return (
    <Box h="auto" w="auto" bg="white">
      <Box
        display="flex"
        flexDir={{ base: "column", md: "row" }}
        gap={{ base: "2", md: "0" }}
        p={{ base: "2", md: "5" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="lg" noOfLines={1} fontWeight="medium">
          Registros
        </Heading>
        <Button
          onClick={() => navigation("/Trazado-Rutas")}
          rightIcon={<FiPlusCircle />}
          colorScheme="blue"
          size="sm"
        >
          Nuevo Registro
        </Button>
      </Box>
      <Box
        h="auto"
        display="flex"
        flexDir={{ base: "column", md: "row" }}
        justifyContent="flex-end"
        alignItems="center"
        width="full"
        gap={1}
        pr={{ base: "0", md: "3" }}
      >
        <Box onClick={() => setisFilter(!isFilter)} cursor="pointer" color="white" _hover={{ bg: "blue.300" }} p={{base: "1", md:"2"}} borderRadius="base" h="auto" bg="blue.400">Filtrar datos</Box>
        {isFilter && (
          <InputGroup w={{ base: "50%", md: "auto" }}>
          <InputLeftElement>
            <Icon as={MdSearch} boxSize="5" color="gray.400" />
          </InputLeftElement>
          <Input
            w="full"
            border="2px"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            borderColor="blue.300"
            placeholder="Escriba un folio"
          />
          <InputRightElement>
            {filterText && (
              <Button
                bg="blue.300"
                _hover={{ bg: "blue.200" }}
                color="white"
                onClick={() => setFilterText("")}
              >
                x
              </Button>
            )}
          </InputRightElement>
        </InputGroup>
        )}
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
          data={filteredData}
          columns={columns}
          highlightOnHover
          pointerOnHover
          pagination
          paginationPerPage={5}
          responsive
          progressPending={pending}
          progressComponent={<CustomLoader />}
          selectableRowsHighlight
          customStyles={customStyles}
        />
      </HStack>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={mostrarModal}
        onClose={handleClicOnClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="blue.500" color="white">
            {messageAction}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            {messageAction === "Registrar Costos" ? (
              <Box display="flex" gap="3" flexDir="column">
                <FormControl isRequired>
                  <FormLabel>Distancia:</FormLabel>
                  <Input
                    name="Distancia"
                    value={form.Distancia}
                    onChange={handleChange}
                    type="number"
                    isReadOnly
                  />
                  <FormHelperText>
                    Distancia del punto de origen al corralón mas cercano (m)
                  </FormHelperText>
                </FormControl>

                <FormControl isRequired isInvalid={!!validationErrors.Estancia}>
                  <FormLabel>Dias de Estancia:</FormLabel>
                  <Input
                    name="Estancia"
                    value={form.Estancia}
                    onChange={handleChange}
                    type="number"
                  />
                  {validationErrors.Estancia ? (
                    <FormErrorMessage>
                      {validationErrors.Estancia}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText>
                      Numero de dias que el automovil estuvo en el corralon
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={!!validationErrors.Maniobras}
                >
                  <FormLabel>Maniobras:</FormLabel>
                  <Input
                    name="Maniobras"
                    value={form.Maniobras}
                    onChange={handleChange}
                    type="number"
                  />
                  {validationErrors.Maniobras ? (
                    <FormErrorMessage>
                      {validationErrors.Maniobras}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText>
                      Numero de maniobras realizadas al momento del traslado del
                      vehiculo
                    </FormHelperText>
                  )}
                </FormControl>
                <Box
                  border="1px"
                  borderColor="gray.200"
                  p="3"
                  display="flex"
                  flexDir="column"
                  gap="3"
                  boxShadow="md"
                >
                  <Box>
                    <Text fontSize="lg" fontWeight="bold">
                      Resumen de Costos:
                    </Text>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Badge fontWeight="medium" colorScheme="blue">
                      Cobro por Distancia:
                    </Badge>
                    <Text fontWeight="light">${costos.cost1} pesos</Text>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Badge fontWeight="medium" colorScheme="blue">
                      Cobro por Tipo Grua:
                    </Badge>
                    <Text fontWeight="light">${costos.cost4} pesos</Text>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Badge fontWeight="medium" colorScheme="blue">
                      Cobro por Estancia:
                    </Badge>
                    <Text fontWeight="light">${costos.cost2} pesos</Text>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Badge fontWeight="medium" colorScheme="blue">
                      Cobro por Maniobra:
                    </Badge>
                    <Text fontWeight="light">${costos.cost3} pesos</Text>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box>
                <FormControl
                  isRequired
                  isInvalid={!!validationErrors.FechaSalida}
                >
                  <FormLabel>Fecha de Liberación:</FormLabel>
                  <Input
                    name="FechaSalida"
                    value={form.FechaSalida}
                    onChange={handleChange}
                    type="date"
                    size="md"
                  />
                  {validationErrors.FechaSalida ? (
                    <FormErrorMessage>
                      {validationErrors.FechaSalida}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText>
                      Fecha de liberación del vehiculo alojado en el corralón
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  mt="3"
                  isRequired
                  isInvalid={!!validationErrors.Folio}
                >
                  <FormLabel>Confirmación:</FormLabel>
                  <Input
                    name="Folio"
                    value={form.Folio}
                    onChange={handleChange}
                    type="text"
                    placeholder="0000-0000-000-000-000"
                  />
                  {validationErrors.Folio ? (
                    <FormErrorMessage>
                      {validationErrors.Folio}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText>
                      Escriba el folio del reporte a liberar
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            {messageAction === "Registrar Costos" ? (
              <Button
                onClick={handleRegisterNewCostos}
                colorScheme="blue"
                mr={3}
              >
                Guardar
              </Button>
            ) : (
              <Button onClick={handleRegisterSal} colorScheme="blue" mr={3}>
                Liberar
              </Button>
            )}

            {/* <Button onClick={() => console.log()} colorScheme="blue" mr={3}>
                Actualizar
              </Button> */}
            <Button colorScheme="red" onClick={handleClicOnClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {user != null && (
        <AlertDialog isOpen={isDelet} onClose={() => setIsDelet(false)}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Eliminar Registro
              </AlertDialogHeader>

              <AlertDialogBody>
                ¿Deseas eliminar el registro con folio {user.Folio}?
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

export default RegisterContainer;
