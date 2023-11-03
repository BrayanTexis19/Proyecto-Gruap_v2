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
import { useRef, useState, useEffect } from "react";
import { CreateNewElement, DeleteElement, ObtenerDataDB, UpdateElement } from "../firebase/firebase";
import { v4 as uuid } from "uuid";
import { useToast } from '@chakra-ui/react'

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
  const {isOpen, onOpen, onClose } = useDisclosure();
  const [data1, setdata1] = useState([]);
  const [form, setForm] = useState(initailForm);
  const [messageAction, setmessageAction] = useState("");
  const [user, setUser] = useState(null);
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const toast = useToast()

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const datos = await ObtenerDataDB("Usuarios");
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
  }
  const handleClickNewUser = async () => {
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

    showToast();
  };

  const showToast = () => {
    toast({
      title: 'Usuario Registrado',
      description: "El usuario ha sido registrado.",
      status: 'success',
      duration: 4000,
      isClosable: true,
    })
  }

  const handleEditElement = (row) => {
    setUser(row);
    setmessageAction("Editar");
    console.log(row)
    const userEdit = {
      Nombre: row.Nombre,
      ApellidoP: row.ApellidoP,
      ApellidoM: row.ApellidoM,
      Correo: row.Correo,
      Password: row.Password,
      Rol: row.Rol,
      Status: row.Status,
    }
    setForm(userEdit);
    onOpen();
  }

  const handleDeletElement = async (row) => {
    console.log(row)
    const res = await DeleteElement("Usuarios", row.docId);
    console.log("registro eliminado:", res);
    getData();
  }

  const handleClicUpdateUser = async () => {
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
    const res = await UpdateElement("Usuarios", user.docId, editElement)
    console.log(JSON.stringify(res));
    setForm(initailForm);
    getData();
    onClose();
  }

  const handleClicOnClose = () => {
    setForm(initailForm);
    onClose();
  }

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
          <Badge fontWeight="medium" colorScheme="red">Inactivo</Badge>
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
        p="5"
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
            {messageAction} Usuario
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Nombre:</FormLabel>
              <Input
                name="Nombre"
                value={form.Nombre}
                onChange={handleChange}
                ref={initialRef}
                placeholder="Nombre Completo"
              />
            </FormControl>

            <Box display="flex" gap="3">
              <FormControl mt={3} isRequired>
                <FormLabel>Apellido Paterno:</FormLabel>
                <Input
                  name="ApellidoP"
                  value={form.ApellidoP}
                  onChange={handleChange}
                  placeholder="Ingrese datos"
                />
              </FormControl>

              <FormControl mt={3} isRequired>
                <FormLabel>Apellido Materno:</FormLabel>
                <Input
                  name="ApellidoM"
                  value={form.ApellidoM}
                  onChange={handleChange}
                  placeholder="Ingrese datos"
                />
              </FormControl>
            </Box>
            <Box display="flex" gap="3">
              <FormControl mt={3} isRequired>
                <FormLabel>Correo:</FormLabel>
                <Input
                  name="Correo"
                  value={form.Correo}
                  onChange={handleChange}
                  placeholder="Ingrese datos"
                />
              </FormControl>

              <FormControl mt={3} is isRequired>
                <FormLabel>Contraseña:</FormLabel>
                <Input
                  name="Password"
                  value={form.Password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Ingrese datos"
                />
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
                <Select name="Status" onChange={handleChange} isReadOnly value={form.Status}>
                    <option value='Activo'>Activo</option>
                    <option value='Inactivo'>Inactivo</option>
                </Select> 
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
             {
              messageAction === 'Nuevo' ? (
                <Button onClick={handleClickNewUser} colorScheme="blue" mr={3}>
                  Guardar
                </Button>
              )
                : (
                <Button onClick={handleClicUpdateUser} colorScheme="blue" mr={3}>
                  Actualizar
                </Button>
              )
             }
            <Button onClick={handleClicOnClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserContainer;
