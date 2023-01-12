import { CircularProgress, Flex, SimpleGrid } from "@chakra-ui/react";
import useOwnedNFTs from "./hooks/useOwnedNtfs";
import WalletNftItem from "./WalletNftItem";

export default function WalletNfts({ searchAddress }) {
  const { data, isLoading } = useOwnedNFTs(searchAddress /*, startToken*/);

  return isLoading ? (
    <Flex
      alignItems={"center"}
      justifyContent="center"
      flexDirection={"column"}
    >
      <CircularProgress isIndeterminate />
      This may take a few seconds...
    </Flex>
  ) : data ? (
    data && data.nfts.ownedNfts && data.nfts.ownedNfts.length ? (
      <SimpleGrid w={"80vw"} columns={4} spacing={16}>
        {data.nfts.ownedNfts.map((e, i) => {
          return <WalletNftItem nft={e} key={i}></WalletNftItem>;
        })}
      </SimpleGrid>
    ) : (
      "No NFTs!"
    )
  ) : (
    "Please make a query!"
  );
}
