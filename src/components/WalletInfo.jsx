import {
  Avatar,
  Box,
  Flex,
  Spinner,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { useBalance, useEnsAddress, useEnsAvatar, useEnsName } from "wagmi";
import { formatCurrency } from "./commons";
import Hash from "./Hash";
import { useEthPrice } from "./hooks/useEthPrice";
import { Utils } from "alchemy-sdk";

function EnsAvatar({ address }) {
  const { data, isError, isLoading } = useEnsAvatar({
    address: address,
    chainId: 1,
  });

  if (isLoading) return <div>Fetching avatar…</div>;
  if (isError) return <div>Error fetching avatar</div>;

  return (
    <Avatar
      size="xl"
      name="address"
      src={data ? data : `https://robohash.org/${address}?set=set3`}
    />
  );
}

function Address({ address }) {
  const { data, isError, isLoading } = useEnsAddress({
    name: address,
  });

  if (isLoading) return <div>Fetching address…</div>;
  if (isError) return <div>Error fetching address</div>;
  return <Hash hash={address} />;
}

function Name({ address }) {
  const { data, isError, isLoading } = useEnsName({
    address: address,
    chainId: 1,
  });

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <Flex> {data}</Flex>;
}

export default function WalletInfo({ address }) {
  const { data, isError, isLoading } = useBalance({
    address,
    watch: true,
    cacheTime: 2000,
  });
  const { eth } = useEthPrice();

  return (
    <Box fontSize={24} fontWeight={"bold"}>
      <EnsAvatar address={address} />
      <Address address={address} />
      <Name address={address} />

      <Stat marginY={"2em"}>
        <StatLabel>Ethereum balance</StatLabel>
        <StatNumber>
          {isLoading ? (
            <Spinner size={xs} />
          ) : (
            <Text>Ξ {Number(data?.formatted).toPrecision(6)}</Text>
          )}
        </StatNumber>
        <StatHelpText>
          <>
            {data &&
              eth &&
              eth.data &&
              formatCurrency(
                parseFloat(Utils.formatEther(data.value)) *
                  parseFloat(eth.data.price_usd)
              )}
            <br />
            (@ {formatCurrency(eth.data.price_usd)}/ETH)
          </>
        </StatHelpText>
      </Stat>
    </Box>
  );
}
