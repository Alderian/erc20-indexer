import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ALCHEMY_API_KEY } from "./components/env";

const config = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const { address } = useAccount();

  async function getTokenBalance() {
    const addressToGet = userAddress || address;
    if (!addressToGet) return;
    setIsLoading(true);
    const data = await alchemy.core.getTokenBalances(addressToGet);

    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      );
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(true);
    setIsLoading(false);
  }

  useEffect(() => {
    if (address) {
      setUserAddress(address);
      getTokenBalance();
    }
  }, [address]);

  return (
    <Box w="100vw">
      <Center>
        <Flex
          alignItems={"center"}
          justifyContent="center"
          flexDirection={"column"}
        >
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={"center"}
      >
        <Heading fontSize={18} mt={42}>
          <ConnectButton />
        </Heading>
        <Heading fontSize={18} mt={2}>
          Or get all the ERC-20 token balances of this address:
        </Heading>
        <Input
          onChange={(e) => setUserAddress(e.target.value)}
          color="black"
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
          value={userAddress}
        />
        <Button fontSize={20} onClick={getTokenBalance} mt={8} bgColor="blue">
          Check ERC-20 Token Balances
        </Button>

        <Heading my={16}>ERC-20 token balances:</Heading>
        {isLoading ? "true" : "false"}
        {hasQueried ? "true" : "false"}
        {isLoading ? (
          <Flex
            alignItems={"center"}
            justifyContent="center"
            flexDirection={"column"}
          >
            <CircularProgress isIndeterminate />
            <br />
            This may take a few seconds...
          </Flex>
        ) : hasQueried ? (
          <SimpleGrid w={"90vw"} columns={4} spacing={24}>
            {results.tokenBalances.map((e, i) => {
              return (
                <Flex
                  flexDir={"column"}
                  color="white"
                  bg="blue"
                  w={"20vw"}
                  key={i}
                >
                  <Box>
                    <b>Symbol:</b> ${tokenDataObjects[i].symbol}&nbsp;
                  </Box>
                  <Box>
                    <b>Balance:</b>&nbsp;
                    {Utils.formatUnits(
                      e.tokenBalance,
                      tokenDataObjects[i].decimals
                    )}
                  </Box>
                  <Image src={tokenDataObjects[i].logo} />
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : (
          "Please make a query!"
        )}
      </Flex>
    </Box>
  );
}

export default App;
