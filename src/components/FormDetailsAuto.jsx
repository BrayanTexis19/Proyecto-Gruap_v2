/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

const FormDetailsAuto = ({ setActiveStep, handleChange, form }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const toast = useToast();

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

  const validateForm = () => {
    const errors = {};

    if (!form.NPlaca.trim()) {
      errors.NPlaca = "El campo Placa es obligatorio";
    }

    if (!form.Descripcion.trim()) {
      errors.Descripcion = "El campo Descripción es obligatorio";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0; // Devuelve true si no hay errores
  };
  return (
    <Box
      display="flex"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      mt="4"
    >
      <Box
        w="70%"
        h="auto"
        bg="whiteAlpha.900"
        border="2px"
        borderColor="gray.100"
        p="4"
        boxShadow="md"
      >
        <Heading size="md">Detalles del Vehiculo</Heading>
        <Box display="flex" gap="3">
          <FormControl mt="2" isRequired>
            <FormLabel>Cantidad de Vehiculos</FormLabel>
            <Input
              name="CantidadVehiculos"
              value={form.CantidadVehiculos}
              onChange={handleChange}
              type="number"
            />
            <FormHelperText>Cantidad de vehiculos involucrados</FormHelperText>
          </FormControl>
          <FormControl mt="2" isRequired>
            <FormLabel>Tipo</FormLabel>
            <Select name="Tipo" value={form.Tipo} onChange={handleChange}>
              <option value="Automovil">Automovil</option>
              <option value="Camioneta">Camioneta</option>
              <option value="Autobus">Autobus</option>
              <option value="Camion de Carga">Camion de carga</option>
              <option value="Trailer">Trailer</option>
              <option value="Microbus">Microbus</option>
            </Select>
            <FormHelperText>Tipo de vehiculo</FormHelperText>
          </FormControl>
        </Box>
        <FormControl mt="2" isRequired isInvalid={!!validationErrors.NPlaca}>
          <FormLabel>Placa</FormLabel>
          <Input
            name="NPlaca"
            value={form.NPlaca}
            onChange={handleChange}
            type="text"
            textTransform="uppercase"
          />
          {validationErrors.NPlaca ? (
            <FormErrorMessage>{validationErrors.NPlaca}</FormErrorMessage>
          ) : (
            <FormHelperText>Numero de placa del vehiculo</FormHelperText>
          )}
        </FormControl>
        <FormControl mt="2" isRequired isInvalid={!!validationErrors.Descripcion}>
          <FormLabel>Detalles</FormLabel>
          <Textarea
            name="Descripcion"
            value={form.Descripcion}
            onChange={handleChange}
            placeholder="Color, Tamaño, Seña en particular, etc."
            size="sm"
            textTransform="capitalize"
          />
           {validationErrors.Descripcion ? (
            <FormErrorMessage>{validationErrors.Descripcion}</FormErrorMessage>
          ) : (
            <FormHelperText>Detalles especificos del vehiculo</FormHelperText>
          )}
        </FormControl>
        <Button
          onClick={() => {
            const isValid = validateForm();
            if (isValid) {
              setActiveStep(1);
              setValidationErrors({});
            } else {
              showToast(
                "Error de validación",
                "Por favor, corrige los errores en el formulario.",
                "error"
              );
            }
          }}
          mt="2"
          colorScheme="blue"
          w="full"
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
};

export default FormDetailsAuto;
