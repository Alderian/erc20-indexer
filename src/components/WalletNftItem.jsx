import { Flex, Image, Heading } from "@chakra-ui/react";

export default function WalletNftItem({ nft, itemKey }) {
  const isLoading = false;
  const price = 0;

  console.log(JSON.stringify(nft));

  return (
    <Flex flexDir={"column"} w={"20vw"} key={itemKey}>
      {/* {JSON.stringify(nft)} */}
      {isLoading ? (
        <div className="m-10">
          <CircularProgress isIndeterminate />
        </div>
      ) : (
        nft && (
          <>
            <Image
              boxSize="150px"
              objectFit="cover"
              src={nft.rawMetadata.image}
              alt={nft.title}
              fallbackSrc={
                "https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5"
              }
            />
            <Heading fontSize={24}>{nft.title}</Heading>
          </>
        )
      )}
    </Flex>
  );
}
