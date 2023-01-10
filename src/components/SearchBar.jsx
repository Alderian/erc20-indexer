import { Input, Spinner } from "@chakra-ui/react";
import { isAddress } from "ethers/lib/utils.js";
import { useState } from "react";
import { useProvider } from "wagmi";

export default function SearchBar({ userAddress, setUserAddress }) {
  const provider = useProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [addressError, setAddressError] = useState(false);

  // let router = useRouter();

  // const goToAddressPage = async (text) => {
  //   let address = await getAddressBalance(text);

  //   if (!address) {
  //     return false;
  //   }
  //   router.push(`/address/${text}`);
  //   return true;
  // };

  // const goToBlockPage = async (text) => {
  //   let block = await getBlock(text);

  //   if (!block) {
  //     return false;
  //   }
  //   router.push(`/block/${text}`);
  //   return true;
  // };

  // const goToTransactionPage = async (text) => {
  //   let transaction = await getTransactionReceipt(text);

  //   if (!transaction) {
  //     return false;
  //   }
  //   router.push(`/transaction/${text}`);
  //   return true;
  // };

  const resolveSearch = async (searchAddress) => {
    let resolved;

    console.log("resolving:", searchAddress, "length:", searchAddress.length);
    setIsLoading(true);
    setAddressError(false);

    if (isAddress(searchAddress)) {
      console.log("is address");
      resolved = searchAddress;
    } else {
      // Try to load as ENS name
      resolved = await provider.resolveName(searchAddress);

      if (!resolved) {
        console.log("not resolved, try with .eth");
        resolved = await provider.resolveName(searchAddress + ".eth");
      }

      if (!resolved) {
        console.log("not resolved:", resolved);
        setAddressError(true);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);
    console.log("resolved:", resolved);
    setUserAddress(resolved);
  };

  return (
    <>
      <Input
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            resolveSearch(ev.target.value);
          }
        }}
        textAlign="center"
        placeholder="Search any address or ENS name"
        size="lg"
        minW={"48ch"}
        borderRadius="16px"
        isInvalid={addressError}
        _loading={isLoading}
      />
      {isLoading && <Spinner size="md" ml={-10} />}
    </>
  );
}
