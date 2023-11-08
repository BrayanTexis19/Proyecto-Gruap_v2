import { useState} from "react";
import FormDetailsAuto from "../components/FormDetailsAuto";
import GeoloContainer from "../components/GeoloContainer";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Box,
} from "@chakra-ui/react";
import { CreateNewElement, RecordCount } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const steps = [
  { title: "Detalles", description: "Detalles Vehiculo" },
  { title: "Asignación", description: "Asignación Corralón" },
];
const ViewSteps = {
  0: FormDetailsAuto,
  1: GeoloContainer,
};

const initialForm = {
  CantidadVehiculos: "1",
  Tipo: "Automovil",
  NPlaca: "",
  Descripcion: "",
  FechaRegistro: "",
  FechaSalida: "",
  Folio: "",
  TipoGrua: "A",
  DireccionOrigen: "",
  Municipio: "",
  Colonia: "",
  CP: "",
  Latitud: "",
  Longitud: "",
  Direccion: "",
  Nombre: "",
  Region: "",
  Distancia: "",
  Contacto: "",
  Telefono: "",
  LatitudDestino: "",
  LongitudDestino: "",
  TarifaDistancia: "",
  Estancia: "",
  Maniobras: "",
  Status: "0",
};
const TrazadoPage = () => {
  const [form, setForm] = useState(initialForm);
  const [closestDirection, setClosestDirection] = useState(null); //Direccion mas cercana al punto de referencia
  const [locationUser, setlocationUser] = useState(null); //ubicacion  del usuario
  const [distance, setDistance] = useState(null); //distancia inicio-destino
  const [userInput, setUserInput] = useState(""); //Contenido de la caja de texto
  const {activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const navigate = useNavigate();
  const GruasCost = {
    A: 300,
    B: 350,
    C: 370,
    D: 400,
  }
  const handleClicNewRegister = async () => {
    const CostoDistancia = parseInt(distance) * .15
    const CostoGrua = GruasCost[form.TipoGrua];
    const result = await RecordCount("Registros");
    const formattedNumber = (result + 1).toString().padStart(4, "0");
    const NewElement = {
      CantidadVehiculos: form.CantidadVehiculos,
      DetallesAutomovil: {
        Tipo: form.Tipo,
        NPlaca: form.NPlaca.toUpperCase(),
        Descripcion: form.Descripcion,
      },
      FechaRegistro: new Date().toLocaleString(),
      FechaSalida: "",
      Folio: `${new Date().getFullYear()}-${formattedNumber}-${form.NPlaca.toUpperCase()}`,
      TipoGrua: form.TipoGrua,
      Origen: {
        Direccion: userInput,
        Municipio: locationUser.adminArea5,
        Colonia: locationUser.adminArea6,
        CP: locationUser.postalCode,
        Latitud: locationUser.latLng.lat,
        Longitud: locationUser.latLng.lng,
      },
      CorralonAsignado: {
        Direccion: closestDirection[0].Direccion,
        Nombre: closestDirection[0].Nombre,
        Region: closestDirection[0].Region,
        Distancia: distance,
        Contacto: closestDirection[0].Contacto,
        Celular: closestDirection[0].Celular,
        Latitud: closestDirection[0].latitude,
        Longitud: closestDirection[0].longitude,
      },
      Costos: {
        Distancia: CostoDistancia.toFixed(2),
        Estancia: "",
        Maniobras: "",
        TipoGrua: CostoGrua.toFixed(2)
      },
      Status: "0",
    };
    const res = await CreateNewElement("Registros", NewElement);
    console.log(JSON.stringify(res));
    setForm(initialForm);
    setUserInput("");
    setDistance(null);
    setClosestDirection(null);
    setlocationUser(null);
    navigate("/Registros")
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const RenderContent = ViewSteps[activeStep];

  return (
    <Box bg="white" w="full" h="auto" scrollBehavior="inside">
      <Stepper size={{base: "sm", md:"md"}} index={activeStep} p="3">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <RenderContent
        setActiveStep={setActiveStep}
        handleChange={handleChange}
        closestDirection={closestDirection}
        setClosestDirection={setClosestDirection}
        locationUser={locationUser}
        setlocationUser={setlocationUser}
        distance={distance}
        setDistance={setDistance}
        form={form}
        handleClicNewRegister={handleClicNewRegister}
        userInput={userInput}
        setUserInput={setUserInput}
      />
    </Box>
  );
};

export default TrazadoPage;
