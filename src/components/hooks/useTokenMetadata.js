import useSWR from "swr";
import { getTokenMetadata } from "../AlchemySDK/commons";

function _getTokenMetadata(contractAddress) {
  return async () => {
    return getTokenMetadata(contractAddress);
  };
}

export default function useTokenMetadata(contractAddress) {
  const shouldFetch = !!contractAddress;

  return useSWR(
    shouldFetch ? [`/metadata/${contractAddress}`] : null,
    _getTokenMetadata(contractAddress),
    {
      refreshInterval: 1800 * 1000, // 30 minutes - 600 seconds
    }
  );
}
