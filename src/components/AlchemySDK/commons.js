import { Alchemy, Network } from "alchemy-sdk";
import { ALCHEMY_API_KEY } from "../env";

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

const MAX_ITEMS_PRE_PAGE = 20; //|| process.env.NEXT_PUBLIC_MAX_ITEMS_PER_PAGE;

// -- Address

export const getAddressBalance = async (_address) => {
  return {
    balance: await alchemy.core.getBalance(_address),
  };
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

    // Loop through all tokens with non-zero balance
    for (let token of tokenBalances) {
      // Get balance of token
      let balance = token.tokenBalance;

      // Get metadata of token
      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress
      );

      // Compute token balance in human-readable format
      balance = balance / Math.pow(10, metadata.decimals);
      balance = balance.toFixed(2);

      token.normalizedBalance = balance;

      Object.assign(token, metadata);
    }
  } else {
    tokenBalances = [];
  }

  return {
    tokenBalances,
  };
};
