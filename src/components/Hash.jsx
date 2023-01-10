import * as React from "react";
import { CopyTextToClip } from "./CopyTextToClip";
import { useNetwork } from "wagmi";
import { Flex, Link } from "@chakra-ui/react";

const ETHERSCAN_PREFIXES = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  5: "goerli.",
  42: "kovan.",
};

export function formatEtherscanLink(type, chainId = 1, hash) {
  const prefix = ETHERSCAN_PREFIXES[chainId] || "";
  switch (type) {
    case "Account": {
      return `https://${prefix}etherscan.io/address/${hash}`;
    }
    case "Token": {
      return `https://${prefix}etherscan.io/token/${hash}`;
    }
    case "Transaction": {
      return `https://${prefix}etherscan.io/tx/${hash}`;
    }
  }
}

export function shortenHex(hex, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
}

export function sliceHash(hash = "0x", length = 4) {
  return hash && hash !== "0x" ? shortenHex(hash, length) : "0x";
}

export default function Hash({
  hash = "0x",
  text,
  path = "Account",
  hasLink = true,
  hasCopy = true,
  isCompressed = true,
  length = 4,
}) {
  const { chain } = useNetwork();
  const hashText = text ? text : isCompressed ? sliceHash(hash, length) : hash;

  return (
    <Flex alignItems="center" gap="2">
      {hasLink ? (
        <Link href={formatEtherscanLink(path, chain?.id || 1, hash)} isExternal>
          {hashText}
        </Link>
      ) : (
        <span>{hashText}</span>
      )}
      {hasCopy && <CopyTextToClip text={hash} className="w5 h5" />}
    </Flex>
  );
}
