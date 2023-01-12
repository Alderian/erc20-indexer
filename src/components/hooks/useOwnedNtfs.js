import useSWR from "swr";
import { getOwnedNFTs, MAX_ITEMS_PRE_PAGE } from "../AlchemySDK/commons";

function _getOwnedNfts(
  ownerAddress,
  startToken = 0,
  size = MAX_ITEMS_PRE_PAGE,
  contractAddresses,
  withMetadata = true
) {
  return async () => {
    return getOwnedNFTs(
      ownerAddress,
      startToken,
      size,
      contractAddresses,
      withMetadata
    );
  };
}

export default function useOwnedNFTs(
  ownerAddress,
  startToken = 0,
  size = MAX_ITEMS_PRE_PAGE,
  contractAddresses,
  withMetadata = true
) {
  const shouldFetch = !!ownerAddress;

  return useSWR(
    shouldFetch
      ? [`/nfts/${ownerAddress}`, startToken, size, contractAddresses, withMetadata]
      : null,
    _getOwnedNfts(ownerAddress, startToken, size, contractAddresses, withMetadata),
    {
      refreshInterval: 10 * 1000, // 10 seconds
    }
  );
}
