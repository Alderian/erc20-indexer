import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { ALCHEMY_API_KEY, ALCHEMY_API_KEY_POLYGON } from "./components/env";
import { polygon } from "@wagmi/chains";
import { isAddress } from "ethers/lib/utils.js";

function App() {
  const { chain } = useNetwork();
  const [userAddress, setUserAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const { address } = useAccount();
  const provider = useProvider();

  async function getTokenBalance() {
    let searchAddress = userAddress || address;
    if (!searchAddress || searchAddress.trim() === "") {
      setAddressError(true);
      return;
    } else {
      if (!isAddress(searchAddress)) {
        // try to resolve ens like entered or adding .eth
        setIsLoading(true);
        const resolved = await provider.resolveName(searchAddress);
        if (!resolved)
          resolved = await provider.resolveName(searchAddress + ".eth");
        if (!resolved) {
          setAddressError(true);
          setIsLoading(false);
          return;
        }
        searchAddress = resolved;
      }
    }

    console.log(searchAddress);
    setAddressError(false);
    setIsLoading(true);

    const config = {
      apiKey:
        chain?.id === polygon.id ? ALCHEMY_API_KEY_POLYGON : ALCHEMY_API_KEY,
      network:
        chain?.id === polygon.id ? Network.MATIC_MAINNET : Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);

    const data = await alchemy.core.getTokenBalances(searchAddress);

    if (data) {
      // filter zero balance tokens if any
      data.tokenBalances = data.tokenBalances.filter((token) => {
        return (
          token.tokenBalance !==
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        );
      });
    }

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
      <FormControl isRequired isInvalid={addressError}>
        <Flex
          w="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent={"center"}
        >
          <Heading fontSize={18} mt={42}>
            <ConnectButton />
          </Heading>
          <FormLabel fontSize={18} mt={2}>
            Or get all the ERC-20 token balances of this address:
          </FormLabel>
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
          {!addressError ? (
            <FormHelperText> </FormHelperText>
          ) : (
            <FormErrorMessage>Valid address is required.</FormErrorMessage>
          )}

          <Button fontSize={20} onClick={getTokenBalance} mt={8} bgColor="blue">
            Check ERC-20 Token Balances
          </Button>
        </Flex>
      </FormControl>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={"center"}
      >
        <Heading my={16}>ERC-20 token balances:</Heading>
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
          results && results.tokenBalances && results.tokenBalances.length ? (
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
                      {parseFloat(
                        Utils.formatUnits(
                          e.tokenBalance,
                          tokenDataObjects[i].decimals
                        )
                      ).toPrecision(8)}
                    </Box>
                    <Image
                      boxSize="100px"
                      objectFit="cover"
                      alt={tokenDataObjects[i].name}
                      src={tokenDataObjects[i].logo}
                    />
                  </Flex>
                );
              })}
            </SimpleGrid>
          ) : (
            "No tokens!"
          )
        ) : (
          "Please make a query!"
        )}
      </Flex>
    </Box>
  );
}

export default App;
