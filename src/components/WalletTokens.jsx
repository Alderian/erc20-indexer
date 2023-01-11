import {
  CircularProgress,
  Flex,
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
import Hash from "./Hash";
import useTokenBalances from "./hooks/useTokenBalance";

export default function WalletTokens({ searchAddress }) {
  const { data, isLoading } = useTokenBalances(searchAddress);

  return isLoading ? (
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
  ) : data ? (
    data && data.tokenBalances && data.tokenBalances.length ? (
      <TableContainer>
        <Table variant="simple" size={"lg"}>
          <Thead>
            <Tr>
              <Th>Asset</Th>
              <Th>Symbol</Th>
              <Th>Contract Address</Th>
              <Th isNumeric>Quantity</Th>
              {/* <Th>Price</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {data.tokenBalances.map((e, i) => {
              return (
                <Tr key={i}>
                  <Td>
                    <Flex alignItems={"center"} gap={2}>
                      <Avatar name={e.name} src={e.logo} />
                      {e.name}
                    </Flex>
                  </Td>
                  <Td>{e.symbol}</Td>
                  <Td>
                    <Hash hash={e.contractAddress} path={"Token"} />
                  </Td>
                  <Td isNumeric>{e.normalizedBalance}</Td>
                  {/* <Td isNumeric>
                                {parseFloat(
                                  Utils.formatUnits(
                                    e.tokenBalance,
                                    e.decimals
                                  )
                                ).toPrecision(8)}
                              </Td> */}
                  {/* <Td>{JSON.stringify(e)}</Td> */}
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
  );
}
