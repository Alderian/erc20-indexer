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
import WalletTokenRow, { WalletTokenHeader } from "./WalletTokenRow";

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
            <WalletTokenHeader />
          </Thead>
          <Tbody>
            {data.tokenBalances.map((e, i) => {
              return <WalletTokenRow token={e} key={i} tokenKey={i} />;
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
