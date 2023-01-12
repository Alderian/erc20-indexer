import useSWR from "swr";
import { getTokenBalances } from "../AlchemySDK/commons";

function _getTokenBalances(address) {
  return async () => {
    return getTokenBalances(address);
  };
}

export default function useTokenBalances(address) {
  const shouldFetch = !!address;

  return useSWR(
    shouldFetch ? [`/tokens/${address}`] : null,
    _getTokenBalances(address),
    {
      refreshInterval: 10 * 1000, // 10 seconds
    }
  );
}
