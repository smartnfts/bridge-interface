//import Resolution from "@unstoppabledomains/resolution";
import axios from "axios";
import { CHAIN_INFO } from "../components/values";

//const resolution = new Resolution();

const endings = [
  ".crypto",
  ".nft",
  ".wallet",
  ".blockchain",
  ".x",
  ".bitcoin",
  ".dao",
  ".888",
  ".zil",
];

export const getFromDomain = async (domain, to) => {
  debugger;
  const { type, key } = to;
  const currency = CHAIN_INFO[key].native;
  const ending = domain.slice(domain.lastIndexOf("."), domain.length);
  const isUnstoppableDomain = endings.some((e) => e === ending);
  let address;
  if (isUnstoppableDomain && type !== "EVM") {
    console.log("Not supported");
  } else if (isUnstoppableDomain && type === "EVM") {
    const data = await fetchData(domain);
    const { multicoinAddresses, addresses } = data;
    switch (currency) {
      case "MATIC":
        address = multicoinAddresses[currency][currency];
        break;
      case "FTM":
        address = multicoinAddresses[currency]["ERC20"];
        break;
      default:
        address = addresses[currency];
        break;
    }
  }
  return address;
};

const fetchData = async (domain) => {
  const baseURL = "https://unstoppabledomains.com/api/v1/";

  try {
    const { data } = await axios.get(`${baseURL}${domain}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// const resolve = (domain, currency) => {
//     let add;
//     resolution
//         .addr(domain, currency)
//         .then((address) => (add = address))
//         .catch(console.error);
//     return add;
// };

// function resolveMultiChain(domain, currency, chain) {
//     debugger;
//     let add;
//     resolution
//         .multiChainAddr(domain, currency, chain)
//         .then((address) => (add = address))
//         .catch(console.error);
//     return add;
// }