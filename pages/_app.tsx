import React from "react";
import {
  ChakraProvider,
  Divider,
  Container,
  Heading,
  Image,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/dist/shared/lib/router/router";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  // FC functional Component
  return (
    <ChakraProvider theme={theme}>
      {/* // asi se le pasaba los custom theme a chakra GANSOOOOOO */}
      <Box padding={4}>
        <Container
          bgColor="white"
          boxShadow="md"
          marginY={4}
          maxW="container.xl"
          p={4}
        >
          <VStack mb={6}>
            <Image borderRadius="full" src="//placehold.it/128x128" />
            <Heading textTransform="uppercase">Shop</Heading>
            <Text textTransform="uppercase" fontWeight="semibold">
              El nombre de tu local
            </Text>
          </VStack>
          <Divider my={6} />
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default App;
