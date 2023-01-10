import {
  Box,
  CircularProgress,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  Skeleton,
  Avatar,
} from "@chakra-ui/react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { ALCHEMY_API_KEY, ALCHEMY_API_KEY_POLYGON } from "./components/env";
import { polygon } from "@wagmi/chains";
import { isAddress } from "ethers/lib/utils.js";
import HeaderToolBar from "./components/HeaderToolBar";
import WalletInfo from "./components/WalletInfo";
import Hash from "./components/Hash";

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

  useEffect(() => {
    if (userAddress) {
      getTokenBalance();
    }
  }, [userAddress]);

  return (
    <Box w={"100vw"} h={"100vh"}>
      <HeaderToolBar
        userAddress={userAddress}
        setUserAddress={setUserAddress}
      />
      <Container maxW="8xl" my={8}>
        <Flex
          minWidth="max-content"
          alignItems={"start"}
          justifyContent="center"
          flexDirection={"row"}
        >
          <Box w="250px">
            <WalletInfo address={userAddress || address} />
          </Box>
          <Box flex={1}>
            <Heading>Wallet</Heading>
            {isLoading ? (
              <Flex
                alignItems={"center"}
                justifyContent="center"
                flexDirection={"column"}
              >
                <CircularProgress isIndeterminate />
                This may take a few seconds...
                <Stack>
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>{" "}
              </Flex>
            ) : hasQueried ? (
              results &&
              results.tokenBalances &&
              results.tokenBalances.length ? (
                <TableContainer>
                  <Table variant="simple" size={"lg"}>
                    <Thead>
                      <Tr>
                        <Th>Asset</Th>
                        <Th>Symbol</Th>
                        <Th>Contract Address</Th>
                        <Th isNumeric>Quantity</Th>
                        {/* <Th>Price</Th> */}
                        {/* <Th isNumeric>multiply by</Th> */}
                        {/* <Th isNumeric>multiply by</Th> */}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {results.tokenBalances.map((e, i) => {
                        return (
                          <Tr key={i}>
                            <Td>
                              <Flex alignItems={"center"} gap={2}>
                                <Avatar
                                  name={tokenDataObjects[i].name}
                                  src={tokenDataObjects[i].logo}
                                />
                                {tokenDataObjects[i].name}
                              </Flex>
                            </Td>
                            <Td>{tokenDataObjects[i].symbol}</Td>
                            <Td>
                              <Hash hash={e.contractAddress} path={"Token"} />
                            </Td>
                            <Td isNumeric>
                              {parseFloat(
                                Utils.formatUnits(
                                  e.tokenBalance,
                                  tokenDataObjects[i].decimals
                                )
                              ).toPrecision(8)}
                            </Td>
                            {/* <Td isNumeric>
                                {parseFloat(
                                  Utils.formatUnits(
                                    e.tokenBalance,
                                    tokenDataObjects[i].decimals
                                  )
                                ).toPrecision(8)}
                              </Td> */}
                            {/* <Td>{JSON.stringify(e)}</Td> */}
                            {/* <Td>{JSON.stringify(tokenDataObjects[i])}</Td> */}
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                "No tokens!"
              )
            ) : (
              "Please make a query!"
            )}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default App;
