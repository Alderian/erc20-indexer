import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ChakraProvider } from "@chakra-ui/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { goerli, mainnet } from "wagmi";
import { hardhat, localhost } from "@wagmi/chains";
import {
  ALCHEMY_API_KEY,
  ALCHEMY_RPC_URL,
  ALCHEMY_WSS_URL,
  NODE_ENV,
} from "./components/env";

const { chains, provider, webSocketProvider } = configureChains(
  [
    mainnet,
    ...(NODE_ENV === "testing" ? [goerli] : []),
    ...(NODE_ENV === "development" ? [hardhat, localhost] : []),
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: ALCHEMY_RPC_URL,
        webSocket: ALCHEMY_WSS_URL,
      }),
    }),
    alchemyProvider({
      apiKey: ALCHEMY_API_KEY,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "ERC20 Indexer",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  </React.StrictMode>
);
