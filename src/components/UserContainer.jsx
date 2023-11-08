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
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Icon,
  InputRightElement,
} from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import { FiUserPlus, FiTrash2, FiEdit } from "react-icons/fi";

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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
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
import CustomLoader from "./CustomLoader";

const initailForm = {
  Nombre: "",
  ApellidoP: "",
  ApellidoM: "",
  Correo: "",
  Password: "",
  Rol: "CallCenter",
  Status: "Activo",
};

const UserContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDelet, setIsDelet] = useState(false);
  const [data1, setdata1] = useState([]);
  const [form, setForm] = useState(initailForm);
  const [messageAction, setmessageAction] = useState("");
  const [user, setUser] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [filterText, setFilterText] = useState("");
  const [pending, setPending] = useState(true);
  const [isFilter, setisFilter] = useState(false)
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
    ? data1.filter((item) =>
        item.Nombre.toLowerCase().includes(filterText.toLowerCase())
      )
    : data1;
  console.log(filteredData, filterText.toLowerCase());

  async function getData() {
    try {
      const datos = await ObtenerDataDB("Usuarios");
      setdata1(datos);
      setPending(false);
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
      errors.Nombre = "El campo Nombre es obligatorio";
    }

    if (!form.ApellidoP.trim()) {
      errors.ApellidoP = "El campo Apellido Paterno es obligatorio";
    }

    if (!form.ApellidoM.trim()) {
      errors.ApellidoM = "El campo Apellido Materno es obligatorio";
    }

    if (!form.Correo.trim()) {
      errors.Correo = "El campo Correo es obligatorio";
    }

    if (!form.Password.trim()) {
      errors.Password = "El campo Contraseña es obligatorio";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0; // Devuelve true si no hay errores
  };

  const handleClickNewUser = async () => {
    const isValid = validateForm();
    if (isValid) {
      const newElement = {
        uid: uuid(),
        Nombre: form.Nombre,
        ApellidoP: form.ApellidoP,
        ApellidoM: form.ApellidoM,
        Correo: form.Correo,
        Password: form.Password,
        Rol: form.Rol,
        Status: form.Status,
      };
      const res = await CreateNewElement("Usuarios", newElement);
      console.log(JSON.stringify(res));
      setForm(initailForm);
      getData();
      onClose();

      showToast(
        "Usuario Registrado",
        "El usuario ha sido registrado.",
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

  const handleEditElement = (row) => {
    setUser(row);
    setmessageAction("Editar");
    console.log(row);
    const userEdit = {
      Nombre: row.Nombre,
      ApellidoP: row.ApellidoP,
      ApellidoM: row.ApellidoM,
      Correo: row.Correo,
      Password: row.Password,
      Rol: row.Rol,
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
    const res = await DeleteElement("Usuarios", user.docId);
    console.log("registro eliminado:", res);
    setIsDelet(false);
    getData();
    setUser(null);
    showToast("Usuario Eliminado", "El usuario ha sido eliminado.", "success");
  };

  const handleCancelDelet = () => {
    setUser(null);
    setIsDelet(false);
  };

  const handleClicUpdateUser = async () => {
    const isValid = validateForm();
    if (isValid) {
      const editElement = {
        uid: user.uid,
        Nombre: form.Nombre,
        ApellidoP: form.ApellidoP,
        ApellidoM: form.ApellidoM,
        Correo: form.Correo,
        Password: form.Password,
        Rol: form.Rol,
        Status: form.Status,
      };
      console.log(editElement);
      const res = await UpdateElement("Usuarios", user.docId, editElement);
      console.log(JSON.stringify(res));
      setForm(initailForm);
      getData();
      onClose();
    } else {
      showToast(
        "Error de validación",
        "Por favor, corrige los errores en el formulario.",
        "error"
      );
    }
  };

  const handleClicOnClose = () => {
    setForm(initailForm);
    setValidationErrors({});
    onClose();
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
    { name: "Nombre", selector: (row) => row.Nombre, sortable: true },
    { name: "A.Paterno", selector: (row) => row.ApellidoP, sortable: true },
    { name: "A.Materno", selector: (row) => row.ApellidoM, sortable: true },
    { name: "Correo", selector: (row) => row.Correo, sortable: true },
    { name: "Rol", selector: (row) => row.Rol, sortable: true },
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
        flexDir={{ base: "column", md: "row" }}
        gap={{ base: "2", md: "0" }}
        p={{ base: "2", md: "5" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="lg" noOfLines={1} fontWeight="medium">
          Usuarios
        </Heading>
        <Button
          onClick={handleClicOpenModal}
          rightIcon={<FiUserPlus />}
          colorScheme="blue"
          size="sm"
        >
          Nuevo Usuario
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
            placeholder="Escriba un nombre"
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
        p="3"
      >
        <DataTable
          data={filteredData}
          columns={columnsPermission}
          highlightOnHover
          pointerOnHover
          pagination
          paginationPerPage={5}
          fixedHeader
          fixedHeaderScrollHeight
          responsive
          selectableRowsHighlight
          progressPending={pending}
          progressComponent={<CustomLoader/>}
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
            {messageAction} Usuario
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!validationErrors.Nombre}>
              <FormLabel>Nombre:</FormLabel>
              <Input
                name="Nombre"
                value={form.Nombre}
                onChange={handleChange}
                ref={initialRef}
                placeholder="Nombre Completo"
              />
              {validationErrors.Nombre && (
                <FormErrorMessage>{validationErrors.Nombre}</FormErrorMessage>
              )}
            </FormControl>

            <Box display="flex" gap="3">
              <FormControl
                mt={3}
                isRequired
                isInvalid={!!validationErrors.ApellidoP}
              >
                <FormLabel>Apellido Paterno:</FormLabel>
                <Input
                  name="ApellidoP"
                  value={form.ApellidoP}
                  onChange={handleChange}
                  placeholder="Ingrese datos"
                />
                {validationErrors.ApellidoP && (
                  <FormErrorMessage>
                    {validationErrors.ApellidoP}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                mt={3}
                isRequired
                isInvalid={!!validationErrors.ApellidoM}
              >
                <FormLabel>Apellido Materno:</FormLabel>
                <Input
                  name="ApellidoM"
                  value={form.ApellidoM}
                  onChange={handleChange}
                  placeholder="Ingrese datos"
                />
                {validationErrors.ApellidoM && (
                  <FormErrorMessage>
                    {validationErrors.ApellidoM}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box>
            <Box display="flex" gap="3">
              <FormControl
                mt={3}
                isRequired
                isInvalid={!!validationErrors.Correo}
              >
                <FormLabel>Correo:</FormLabel>
                <Input
                  name="Correo"
                  value={form.Correo}
                  onChange={handleChange}
                  placeholder="Ingrese datos"
                />
                {validationErrors.Correo && (
                  <FormErrorMessage>{validationErrors.Correo}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                mt={3}
                is
                isRequired
                isInvalid={!!validationErrors.Password}
              >
                <FormLabel>Contraseña:</FormLabel>
                <Input
                  name="Password"
                  value={form.Password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Ingrese datos"
                />
                {validationErrors.Password && (
                  <FormErrorMessage>
                    {validationErrors.Password}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box>

            <Box display="flex" gap="3">
              <FormControl mt={3} isRequired>
                <FormLabel>Rol:</FormLabel>
                <Input
                  name="Rol"
                  onChange={handleChange}
                  isReadOnly
                  value={form.Rol}
                />
              </FormControl>

              <FormControl mt={3} isRequired>
                <FormLabel>Estado:</FormLabel>
                <Select
                  name="Status"
                  onChange={handleChange}
                  isReadOnly
                  value={form.Status}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </Select>
              </FormControl>
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
            <Button onClick={handleClicOnClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {user != null && (
        <AlertDialog isOpen={isDelet} onClose={() => setIsDelet(false)}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Eliminar Usuario
              </AlertDialogHeader>

              <AlertDialogBody>
                ¿Deseas eliminar al usuario {user.Nombre} {user.ApellidoM}?
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

export default UserContainer;
