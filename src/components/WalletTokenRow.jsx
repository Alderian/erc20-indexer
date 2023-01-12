import { Flex, Tr, Th, Td, Skeleton, Avatar } from "@chakra-ui/react";
import Hash from "./Hash";
import useTokenMetadata from "./hooks/useTokenMetadata";

export function WalletTokenHeader() {
  return (
    <Tr>
      <Th>Asset</Th>
      <Th>Symbol</Th>
      <Th>Contract Address</Th>
      <Th isNumeric>Quantity</Th>
      {/* <Th>Price</Th> */}
    </Tr>
  );
}

export default function WalletTokenRow({ token, tokenKey }) {
  const { data, isLoading } = useTokenMetadata(token.contractAddress);

  return (
    <Tr key={tokenKey}>
      <Td>
        <Flex alignItems={"center"} gap={2}>
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              <Avatar name={data.name} src={data.logo} />
              {data.name}
            </>
          )}
        </Flex>
      </Td>
      <Td>{isLoading ? <Skeleton /> : data.symbol}</Td>
      <Td>
        <Hash hash={token.contractAddress} path={"Token"} />
      </Td>
      <Td isNumeric>
        {isLoading ? (
          <Skeleton />
        ) : (
          (token.tokenBalance / Math.pow(10, data.decimals)).toFixed(2)
        )}
      </Td>
      {/* <Td isNumeric>
                  {parseFloat(
                    Utils.formatUnits(
                      token.tokenBalance,
                      token.decimals
                    )
                  ).toPrecision(8)}
                </Td> */}
      {/* <Td>{JSON.stringify(token)}</Td> */}
    </Tr>
  );
}
