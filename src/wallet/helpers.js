import { AppConfigs, ChainFactory, ChainFactoryConfigs } from "xp.network";

import { Chain } from "xp.network/dist/consts";
import { chainsConfig, CHAIN_INFO } from "../components/values";
import {
    setAlgorandClaimables,
    setBigLoader,
    setError,
    setFactory,
    setNFTList,
    setPreloadNFTs,
} from "../store/reducers/generalSlice";
import store from "../store/store";
import io from "socket.io-client";
import axios from "axios";
import { utils } from "ethers";
import { setIsEmpty } from "../store/reducers/paginationSlice";
import { setChainFactoryConfig } from "../store/reducers/signersSlice";
import Harmony from "@harmony-js/core";

const socketUrl = "wss://dev-explorer-api.herokuapp.com";
const testnet = window.location.href.includes("testnet");
const testnetSocketUrl = "wss://testnet-bridge-explorer.herokuapp.com/";

export const isApproved = async (c, nft) => {
    // debugger;

    const {
        signers: { signer },
        general: { factory },
    } = store.getState();

    const chain = await factory.inner(c);

    let isApproved;

    try {
        isApproved =
            c === 24
                ? await chain.isApprovedForMinter(signer, nft)
                : await chain.isApprovedForMinter(nft, signer);
    } catch (error) {
        console.log(error);
    }
    return isApproved;
};

export const convertTransactionHash = (txn) => {
    let convertedTxn;
    switch (true) {
        case txn.hash?.hash instanceof Uint8Array:
            convertedTxn = txn.hash = utils
                .hexlify(txn.hash?.hash)
                .replace(/^0x/, "");
            break;
        case txn.hash?.hash?.data instanceof Uint8Array:
            convertedTxn = utils
                .hexlify(txn.hash?.hash?.data)
                ?.replace(/^0x/, "");
            break;
        case txn.hash?.hash?.type === "Buffer":
            convertedTxn = utils
                .hexlify(txn.hash?.hash?.data)
                ?.replace(/^0x/, "");
            break;
        default:
            convertedTxn = txn.hash;
            break;
    }
    return convertedTxn;
};

export const socket = io(testnet ? testnetSocketUrl : socketUrl, {
    path: "/socket.io",
});
// const { Harmony } = require("@harmony-js/core");
// const axios = require("axios");

// export const setupURI = (uri) => {
//     // debugger
//     if (uri) {
//         if (uri.includes("https://ipfs.io")) {
//             return uri;
//         } else if (uri && uri.includes("ipfs://")) {
//             return "https://ipfs.io/" + uri.replace(":/", "");
//         } else if (uri && uri.includes("https://ipfs.io")) {
//             return uri;
//         } else if (
//             uri &&
//             (uri.includes("data:image/") || uri.includes("data:application/"))
//         ) {
//             return uri;
//         } else {
//             if (uri) return uri.replace("http://", "https://");
//         }
//     }
//     return uri;
// };

// const Rookie = async (nft) => {
//     let uri = nft.uri;
//     const { data } = await axios.get(setupURI(uri));
//     return data;
// };

export const isALLNFTsApproved = () => {
    const { selectedNFTList, approvedNFTList } = store.getState().general;
    if (selectedNFTList.length <= approvedNFTList.length) {
        const approvedNFTs = [];
        approvedNFTList.forEach((n) => {
            const { native } = n;
            const isInSelected = selectedNFTList.filter((y) => {
                const { tokenId, contract, chainId } = y.native;
                return (
                    tokenId === native.tokenId &&
                    contract === native.contract &&
                    chainId === native.chainId
                );
            })[0];
            if (isInSelected) approvedNFTs.push(isInSelected);
        });
        return approvedNFTs.length === selectedNFTList.length;
    } else return false;
};

export const transformToDate = (date) => {
    const dateObj = new Date(date);
    const month = dateObj.toLocaleDateString("en-US", {
        month: "short", //month: window.innerWidth > 480 ? "long" : "short",
        day: "numeric",
    });
    const year = dateObj.getFullYear();
    // const day = month.replace(/^\D+/g, "");

    const tm = month + ", " + year;
    return tm;
};

// export const getFactory = async () => {
//     // eslint-disable-next-line no-debugger
//     // debugger;
//     const f = store.getState().general.factory;
//     const {
//         general: { testnet, staging },
//     } = store.getState();

//     if (f) return f;
//     const testnetConfig = testnet
//         ? await ChainFactoryConfigs.TestNet()
//         : undefined;
//     const stagingConfig = staging
//         ? await ChainFactoryConfigs.Staging()
//         : undefined;
//     const mainnetConfig =
//         !testnetConfig && !testnetConfig
//             ? await ChainFactoryConfigs.MainNet()
//             : undefined;
//     store.dispatch(
//         setChainFactoryConfig(stagingConfig || mainnetConfig || testnetConfig)
//     );
//     // if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
//     //     mainnetConfig.tronParams.provider = window.tronWeb;
//     // }
//     const factory = ChainFactory(
//         testnet
//             ? AppConfigs.TestNet()
//             : staging
//             ? AppConfigs.Staging()
//             : AppConfigs.MainNet(),
//         testnet ? testnetConfig : staging ? stagingConfig : mainnetConfig
//     );
//     store.dispatch(setFactory(factory));
//     return factory;
// };

export const getAndSetFactory = async (network) => {
    // eslint-disable-next-line no-debugger
    debugger;
    let config;
    let factory;
    switch (network) {
        case "testnet":
            config = await ChainFactoryConfigs.TestNet();
            factory = await ChainFactory(AppConfigs.TestNet(), config);
            break;
        case "staging":
            config = await ChainFactoryConfigs.Staging();
            factory = await ChainFactory(AppConfigs.Staging(), config);
            break;
        default:
            config = await ChainFactoryConfigs.MainNet();
            factory = await ChainFactory(AppConfigs.MainNet(), config);
            break;
    }
    store.dispatch(setFactory(factory));
    store.dispatch(setChainFactoryConfig(config));
    return factory;
};

// export const getFac = async () => {
//     const mainnetConfig = ChainFactoryConfigs.MainNet();
//     const factory = ChainFactory(AppConfigs.MainNet(), mainnetConfig);
//     return factory;
// };

export const handleChainFactory = async (someChain) => {
    // debugger;
    const { factory } = store.getState().general;

    try {
        switch (someChain) {
            case "Ethereum":
                return await factory.inner(Chain.ETHEREUM);
            case "BSC":
                return await factory.inner(Chain.BSC);
            case "Tron":
                return await factory.inner(Chain.TRON);
            case "Elrond":
                return await factory.inner(Chain.ELROND);
            case "Polygon":
                return await factory.inner(Chain.POLYGON);
            case "Avalanche":
                return await factory.inner(Chain.AVALANCHE);
            case "Fantom":
                return await factory.inner(Chain.FANTOM);
            case "Algorand":
                return await factory.inner(Chain.ALGORAND);
            case "xDai":
                return await factory.inner(Chain.XDAI);
            case "Gnosis":
                return await factory.inner(Chain.XDAI);
            case "Solana":
                return await factory.inner(Chain.SOLANA);
            case "Cardano":
                return await factory.inner(Chain.CARDANO);
            case "Fuse":
                return await factory.inner(Chain.FUSE);
            case "Velas":
                return await factory.inner(Chain.VELAS);
            case "Tezos":
                return await factory.inner(Chain.TEZOS);
            case "Iotex":
                return await factory.inner(Chain.IOTEX);
            case "Harmony":
                return await factory.inner(Chain.HARMONY);
            case "Aurora":
                return await factory.inner(Chain.AURORA);
            case "GateChain":
                return await factory.inner(Chain.GATECHAIN);
            case "VeChain":
                return await factory.inner(Chain.VECHAIN);
            case "Godwoken":
                return await factory.inner(Chain.GODWOKEN);
            case "Secret":
                return await factory.inner(Chain.SECRET);
            case "Hedera":
                return await factory.innner(Chain.HEDERA);
            case "Skale":
                return await factory.inner(Chain.SKALE);
            case "Abeychain":
                return await factory.inner(Chain.ABEYCHAIN);
            case "Moonbeam":
                return await factory.inner(Chain.MOONBEAM);
            default:
                return "";
        }
    } catch (error) {
        console.error(error);
    }
};

export const mintForTestNet = async (from, signer) => {
    const { factory } = store.getState().general;
    const chain = await factory.inner(chainsConfig[from].Chain);
    const uri = await prompt();

    //
    /*console.log(
    await p.getTransaction(
      "0xecdcc5a3769d036ad01b85c345219df0749e68ddb85d66c06a64c0a70ca891cd"
    )
  );

  return;*/
    try {
        const mint = await chain.mintNft(signer, {
            contract: "0x34933A5958378e7141AA2305Cdb5cDf514896035",
            uri,
        });

        return mint;
    } catch (error) {
        console.log(error);
    }
};

export const getNFTS = async (wallet, from) => {
    // eslint-disable-next-line no-debugger
    debugger;
    const { checkWallet, NFTList, factory } = store.getState().general;
    const chain = await factory.inner(chainsConfig[from].Chain);
    try {
        let response;
        response = await factory.nftList(
            chain,
            checkWallet ? checkWallet : wallet
        );
        const unique = {};
        try {
            const allNFTs = response.filter((n) => {
                const { tokenId, contract, chainId } = n.native;
                if (unique[`${tokenId}_${contract.toLowerCase()}_${chainId}`]) {
                    return false;
                } else {
                    unique[
                        `${tokenId}_${contract.toLowerCase()}_${chainId}`
                    ] = true;
                    return true;
                }
            });
            if (allNFTs.length < 1) {
                store.dispatch(setIsEmpty(true));
            } else {
                store.dispatch(setIsEmpty(false));
            }
            return allNFTs;
        } catch (err) {
            return [];
        }
    } catch (err) {
        console.log(err, "NFT Indexer error");
        if (!NFTList) {
            store.dispatch(
                setError({
                    message: "NFT-Indexer is temporarily under maintenance",
                })
            );
        }
        return [];
    }
};

export const checkIfSmartContract = async (c, address) => {
    const { factory } = store.getState().general;
    const chain = await factory.inner(c);
    const isSC = await chain.isContractAddress(address);
    return isSC;
};

export const setClaimablesAlgorand = async (algorandAccount, returnList) => {
    const { factory } = store.getState().general;
    let claimables;
    try {
        if (algorandAccount && algorandAccount.length > 50) {
            claimables = await factory.claimableAlgorandNfts(algorandAccount);
            console.log(claimables, "claimablesNFT");
            if (claimables && claimables.length > 0) {
                if (returnList) return claimables;
                else store.dispatch(setAlgorandClaimables(claimables));
            }
        }
        return [];
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getAlgorandClaimables = async (account) => {
    const { checkWallet, factory } = store.getState().general;
    // debugger;
    let claimables;
    try {
        claimables = await factory.claimableAlgorandNfts(
            checkWallet || account
        );
        store.dispatch(setAlgorandClaimables(claimables));
    } catch (error) {
        console.error(error);
    }
};

export const setNFTS = async (w, from, testnet) => {
    store.dispatch(setBigLoader(true));
    const res = await getNFTS(w, from, testnet);
    store.dispatch(setPreloadNFTs(res.length));
    store.dispatch(setNFTList(res));
    store.dispatch(setBigLoader(false));
};

export function isValidHttpUrl(string) {
    let url;
    if (string.includes("data:image/") || string.includes("data:application/"))
        return true;
    if (string.includes("ipfs://")) return true;
    if (string.includes("ipfs")) return true;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

export const getTronNFTs = async (wallet) => {
    const res = await axios.get(
        `https://apilist.tronscan.org/api/account/tokens?address=${wallet}&start=0&limit=500&hidden=0&show=3&sortType=0&sortBy=0`
    );
    const { total, data } = res.data;

    if (total > 0) {
        const tokens = [];
        for await (let nft of data) {
            const { tokenId, balance, tokenName, tokenAbbr } = nft;
            const contract = await window.tronWeb.contract().at(tokenId);
            const array = new Array(parseInt(balance)).fill(0).map((n, i) => i);
            for await (let index of array) {
                try {
                    const token = await contract
                        .tokenOfOwnerByIndex(wallet, index)
                        .call();
                    const uri = await contract
                        .tokenURI(parseInt(token._hex))
                        .call();
                    const t = {
                        uri,
                        native: {
                            chainId: "9",
                            contract: tokenId,
                            contractType: "ERC721",
                            name: tokenName,
                            symbol: tokenAbbr,
                            tokenId: parseInt(token._hex),
                            uri,
                        },
                    };
                    tokens.push(t);
                } catch (err) {
                    console.log(err);
                }
            }
        }
        return tokens;
    }
    return [];
};

export const checkIfOne1 = (address) => {
    return address?.slice(0, 4) === "one1" ? true : false;
};

export const checkIfIo1 = (address) => {
    return address?.slice(0, 3) === "io1" ? true : false;
};

export const convertOne1 = (address) => {
    const hmySDK = new Harmony();
    const ethAddr = hmySDK.crypto.fromBech32(address);
    return ethAddr;
};

export const convert = (address) => {
    // debugger
    if (checkIfOne1(address)) {
        return convertOne1(address);
    }
    // else if(checkIfIo1(address)) return convertIo1(address)
};

export const checkMintWith = async (from, to, contract, tokenId) => {
    const { factory } = store.getState().general;
    const fromNonce = CHAIN_INFO[from.text].nonce;
    const toNonce = CHAIN_INFO[to.text].nonce;
    const mintWith = await factory.getVerifiedContract(
        contract,
        toNonce,
        fromNonce,
        tokenId
    );
    return mintWith;
};

export const saveForSearch = async (address, chain, data) => {
    const baseUrl = "https://server-bridge.herokuapp.com/saveUser";
    const body = {
        address,
        chain,
        data,
    };

    try {
        await axios.post(baseUrl, body);
        // console.log(response);
    } catch (error) {
        console.log(error);
    }
};

export const getSearched = async (address, searched, nonce) => {
    const url = `https://server-bridge.herokuapp.com/nft?address=${address}&nft=${searched}&chain=${nonce}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const errorToLog = async (error) => {
    try {
        const response = await axios.post(
            "https://bridge-error-logs.herokuapp.com/log/error",
            error,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*",
                },
            }
        );
        console.log("Log", response.data);
    } catch (e) {
        console.log(e);
    }
};

export const getRightPath = () => {
    const {
        general: { testNet, staging },
    } = store.getState();
    switch (true) {
        case testNet:
            return "/testnet/account";
        case staging:
            return "/staging/account";
        default:
            return "/account";
    }
};
