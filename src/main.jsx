import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ChakraProvider } from "@chakra-ui/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { goerli, mainnet } from "wagmi";
import { hardhat, localhost, polygon, polygonMumbai } from "@wagmi/chains";
import {
  ALCHEMY_RPC_URL,
  ALCHEMY_WSS_URL,
  ALCHEMY_RPC_URL_POLYGON,
  ALCHEMY_WSS_URL_POLYGON,
  NODE_ENV,
} from "./components/env";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const { chains, provider, webSocketProvider } = configureChains(
  [
    mainnet,
    polygon,
    ...(NODE_ENV === "testing" ? [goerli, polygonMumbai] : []),
    ...(NODE_ENV === "development" ? [hardhat, localhost] : []),
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain === polygon.id ? ALCHEMY_RPC_URL_POLYGON : ALCHEMY_RPC_URL,
        webSocket:
          chain === polygon.id ? ALCHEMY_WSS_URL_POLYGON : ALCHEMY_WSS_URL,
      }),
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
          <BrowserRouter>
            <Routes>
              <Route index element={<App />} />
              <Route path="/address/:searchAddress" element={<App />} />
            </Routes>
          </BrowserRouter>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  </React.StrictMode>
);
