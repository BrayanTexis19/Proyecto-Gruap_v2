import { Box, Text } from "@chakra-ui/react";
import styled, { keyframes } from "styled-components";

const CustomLoader = () => {
  const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

  const Spinner = styled.div`
    margin: 16px;
    animation: ${rotate360} 1s linear infinite;
    transform: translateZ(0);
    border-top: 3px solid #eaf2f8;
    border-right: 3px solid #eaf2f8;
    border-bottom: 3px solid #eaf2f8;
    border-left: 5px solid #2e86c1;
    background: transparent;
    width: 120px;
    height: 120px;
    border-radius: 50%;
  `;

  return (
    <Box
      display="flex"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      w="auto"
      h="auto"
    >
      <Spinner />
      <Text
        bgGradient="linear(to-l, blue.300, blue.500)"
        bgClip="text"
        fontSize="2xl"
        fontWeight={"extrabold"}
      >
        Cargando...
      </Text>
    </Box>
  );
};

export default CustomLoader;
