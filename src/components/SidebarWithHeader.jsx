/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-undef */
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton, 
  MenuList,
  MenuItem,
  Highlight,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiTruck,
  FiMenu,
  FiChevronDown,
  FiTrendingUp
} from 'react-icons/fi';
import { Link, Outlet, useNavigate } from 'react-router-dom';


const LinkItems = [
  { name: 'Home', icon: FiHome, url: "/" },
  { name: 'Usuarios', icon: FiUsers, url: "/Usuarios"},
  { name: 'Corralones', icon: FiTruck, url: "/Corralones"},
  { name: 'Registros', icon: FiFileText, url: "/Registros"  },
  { name: 'Asignación de corralón', icon: FiTrendingUp, url: "/Trazado-Rutas"  },
];

const LinkItemsOld = [
  { name: 'Home', icon: FiHome, url: "/" },
  { name: 'Registros', icon: FiFileText, url: "/Registros"  },
  { name: 'Asignación de corralón', icon: FiTrendingUp, url: "/Trazado-Rutas"  },
];

const SidebarContent = ({userData, onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.200')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Highlight query={['GruApp']} styles={{ rounded: "base", bg: 'blue.300', px:"3", color:"white", fontSize:"2xl", fontFamily:"monospace", fontWeight:"bold"}}  >
            GruApp
        </Highlight>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {userData.Rol === 'Admin' ? (
          LinkItems.map((link, index) => (
            <Link key={index} to={link.url}>
              <NavItem key={link.name} icon={link.icon}>
              {link.name}
              </NavItem>
            </Link>
          ))
      ):
      (
        LinkItemsOld.map((link, index) => (
          <Link key={index} to={link.url}>
            <NavItem key={link.name} icon={link.icon}>
            {link.name}
            </NavItem>
          </Link>
        ))
      )}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Box
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'blue.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ userData, handleDeletSesion, onOpen, ...rest }) => {

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-between' }}
      {...rest}
      >
      <Text fontWeight="semibold" fontSize="larger">Dashboard</Text>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        GruApp
      </Text>

      <HStack spacing={{ base: '0', md: '6' }} _hover={{ bg:'blue.200' }} p="1.5" borderRadius="base">
        {/* <IconButton size="lg" variant="ghost" aria-label="open menu" color="white" icon={<FiBell />} /> */}
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src='https://bit.ly/broken-link'
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm" color="blackAlpha.900">{userData.Nombre} {userData.ApellidoP}</Text>
                  <Text fontSize="xs" color="blackAlpha.800">
                    {userData.Rol}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown color='black' />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem onClick={handleDeletSesion} _hover={{ bg:'blue.200' }}>Cerra Sesión</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = () => {
  const {isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = useState(JSON.parse(window.localStorage.getItem('sessionUser')));
  const navigate = useNavigate(); 
  
  const handleDeletSesion = () => {
    setUserData(null);
    window.localStorage.removeItem('sessionUser');
    navigate("/login");
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={onClose} userData={userData} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      
      <MobileNav onOpen={onOpen} userData={userData} handleDeletSesion={handleDeletSesion} />
      <Box ml={{ base: 0, md: 60 }} p="1">
            <Outlet/>
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;