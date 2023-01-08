const env = import.meta.env;

export const NODE_ENV = env.NODE_ENV || "";

// Alchemy's default API key used if no ALCHEMY_RPC_URL or ALCHEMY_WSS_URL defined.
// You can get your own at https://dashboard.alchemyapi.io
export const ALCHEMY_RPC_URL =
  env.VITE_ALCHEMY_RPC_URL ||
  "https://eth-mainnet.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";

export const ALCHEMY_WSS_URL =
  env.VITE_ALCHEMY_WSS_URL ||
  "wss://eth-mainnet.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";

// Alchemy's default API key used if no ALCHEMY_API_KEY defined.
// You can get your own at https://dashboard.alchemyapi.io
export const ALCHEMY_API_KEY =
  env.VITE_ALCHEMY_API_KEY || "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";


// Alchemy's default API key used if no ALCHEMY_RPC_URL or ALCHEMY_WSS_URL defined.
// You can get your own at https://dashboard.alchemyapi.io
export const ALCHEMY_RPC_URL_POLYGON =
  env.VITE_ALCHEMY_RPC_URL_POLYGON ||
  "https://polygon-mainnet.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";

export const ALCHEMY_WSS_URL_POLYGON =
  env.VITE_ALCHEMY_WSS_URL_POLYGON ||
  "wss://polygon-mainnet.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";

// Alchemy's default API key used if no ALCHEMY_API_KEY defined.
// You can get your own at https://dashboard.alchemyapi.io
export const ALCHEMY_API_KEY_POLYGON =
  env.VITE_ALCHEMY_API_KEY_POLYGON || "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";
