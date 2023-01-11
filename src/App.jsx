import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { useParams } from "react-router";
import { useAccount } from "wagmi";
import HeaderToolBar from "./components/HeaderToolBar";
import WalletInfo from "./components/WalletInfo";
import WalletTokens from "./components/WalletTokens";

function App() {
  const { searchAddress } = useParams();
  const { address } = useAccount();

  return (
    <Box w={"100vw"} h={"100vh"}>
      <HeaderToolBar />
      <Container maxW="8xl" my={8}>
        <Flex
          minWidth="max-content"
          alignItems={"start"}
          justifyContent="center"
          flexDirection={"row"}
        >
          <Box w="250px">
            <WalletInfo address={address || searchAddress} />
          </Box>
          <Box flex={1}>
            <Heading>Wallet</Heading>
            <WalletTokens searchAddress={address || searchAddress} />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default App;
