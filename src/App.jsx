import {
  Box,
  Container,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useParams } from "react-router";
import { useAccount } from "wagmi";
import HeaderToolBar from "./components/HeaderToolBar";
import WalletInfo from "./components/WalletInfo";
import WalletNfts from "./components/WalletNfts";
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
            <Tabs>
              <TabList>
                <Tab>Wallet</Tab>
                <Tab>NFTs</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <WalletTokens searchAddress={address || searchAddress} />
                </TabPanel>
                <TabPanel>
                  <WalletNfts searchAddress={address || searchAddress} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default App;
