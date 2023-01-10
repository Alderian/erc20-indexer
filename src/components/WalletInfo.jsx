import { Avatar, Box, Flex } from "@chakra-ui/react";
import {
  useEnsAddress,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import Hash from "./Hash";

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
  return (
    <Box fontSize={24} fontWeight={"bold"}>
      <EnsAvatar address={address} />
      <Address address={address} />
      <Name address={address} />
    </Box>
  );
}
