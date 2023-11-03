/* eslint-disable no-unused-vars */

import { Box, Center, Image, Heading, Avatar, Input, InputGroup, InputLeftElement, Button, Text } from "@chakra-ui/react"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import marker from '../assets/gruapp_rc_2.svg';
import logo from '../assets/gruapp.jpg';
import { Icon } from "@chakra-ui/react";
import { MdPerson, MdSecurity } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { userExists } from "../firebase/firebase";
import { useState, useEffect } from "react";

const LoginContainer = () => {
  const navigate = useNavigate(); 
  const [userEmail, setUserEmail] = useState("");
  const [userPass, seTuserPass] = useState("");
  const [messageError, setmessageError] = useState('');

  useEffect(() => {
    if (messageError !== '') {
      const timeout = setTimeout(() => {
        setmessageError('');
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [messageError]);

  const handleGmailChange = (e) => {
    setUserEmail(e.target.value)
  } 

  const handlePassChange = (e) => {
    seTuserPass(e.target.value)
  } 

  const handleclickAuth = async () => {
    if (userEmail == '' && userPass == '') return setmessageError('Ingrese datos al formulario')
    if (userEmail == '') return setmessageError('Debe ingresar un email')
    if (userPass == '' ) return setmessageError('Debe ingresar una contraseña')


    const userExist = await userExists(userEmail, userPass);
    if (userExist != null)
    {
      window.localStorage.setItem(
        'sessionUser', JSON.stringify(userExist)
      );
      navigate("/");
    }
    else {
      setmessageError("Usuario no registrado");
    }
  }

  return (
    <>
        <Box h="100vh" w="100%" display="flex" flexDirection="column" alignItems="center" bgGradient="linear(to-l, blue.500, blue.400, blue.600)">
            <Box position="sticky" display="flex" justifyContent="start" alignItems="center" gap="5" h="12vh" w="full" p="4" bg="whiteAlpha.400" boxShadow="base" mb="4">
                <Heading fontWeight="semibold" color="white" pl="5">GruApp</Heading>
                <Image h="60px" objectFit='cover' src={logo} align="logo" borderRadius='full'/>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" h="80vh" width="90%">
                <Center h="auto" w="50%" p={5} mx="2"  borderLeftRadius="base" >
                    <Image w="100%" h="auto" src={marker} alt="Fondo1" objectFit='cover' />
                </Center>
                <Box h="auto" w="40%" bg="whiteAlpha.900" borderRadius="base" boxShadow="xl">
                      <Box p={2} display="flex" alignItems="center" justifyContent="center" bg="#5DADE2" borderTopRadius="base">
                          <Heading fontWeight="semibold" color="white">Bienvenido</Heading>
                      </Box>
                      <Box display="flex" flexDirection="column" p="4" justifyContent="center" alignItems="center" gap="3">
                          <Text fontWeight="light" fontSize="larger">Inicio de sesión</Text>
                          <Avatar src='https://bit.ly/broken-link' />
                          <InputGroup>
                            <InputLeftElement>
                              <Icon as={MdPerson} color="gray.500"/>
                            </InputLeftElement>
                            <Input onChange={handleGmailChange} placeholder='Usuario' size='md' variant="filled" border="1px" borderColor="gray.400" />
                          </InputGroup>
                          <InputGroup>
                            <InputLeftElement>
                              <Icon as={MdSecurity} color="gray.500"/>
                            </InputLeftElement>
                            <Input  onChange={handlePassChange} placeholder='Contraseña' type="password" size='md' variant="filled" border="1px" borderColor="gray.400" />
                          </InputGroup>
                            {
                              messageError != '' && (
                                <Alert status='error'>
                                <AlertIcon />
                                <AlertTitle>Upps, Ocurrio un error!</AlertTitle>
                                <AlertDescription>{messageError}</AlertDescription>
                              </Alert>
                              )
                            }
                            <Button onClick={handleclickAuth} colorScheme="blue" w="100%" my="5">
                                Ingresar
                            </Button>
                      </Box>
                </Box>      
            </Box>
        </Box>
    </>
  )
}

export default LoginContainer
