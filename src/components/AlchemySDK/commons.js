import { Alchemy, Network } from "alchemy-sdk";
import { ALCHEMY_API_KEY } from "../env";

export const MAX_ITEMS_PRE_PAGE = 20; //|| process.env.NEXT_PUBLIC_MAX_ITEMS_PER_PAGE;

// export const ALCHEMY_REFRESH_INTERVAL =
//   process.env.NEXT_PUBLIC_ALCHEMY_API_REFRESH_INERVAL;

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
export const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
export const alchemy = new Alchemy(settings);

// -- Address

export const getAddressBalance = async (_address) => {
  return {
    balance: await alchemy.core.getBalance(_address),
  };
};

export const getTokenMetadata = async (_contractAddress) => {
  return await alchemy.core.getTokenMetadata(_contractAddress);
};

export const getTokenBalances = async (_address) => {
  let tokenBalances = await alchemy.core.getTokenBalances(_address);
  if (tokenBalances && tokenBalances.tokenBalances) {
    tokenBalances = tokenBalances.tokenBalances.filter((token) => {
      return (
        token.tokenBalance !==
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
    });
  } else {
    tokenBalances = [];
  }

  return {
    tokenBalances,
  };
};

export const getOwnedNFTs = async (
  ownerAddress,
  startToken = 0,
  size = MAX_ITEMS_PRE_PAGE,
  contractAddresses,
  withMetadata = true
) => {
  console.log("Get NFTS for", ownerAddress);
  let nfts = await alchemy.nft.getNftsForOwner(ownerAddress, {
    pageKey: startToken,
    pageSize: size,
    omitMetadata: !withMetadata,
    contractAddresses,
  });

  return {
    nfts,
  };
};
