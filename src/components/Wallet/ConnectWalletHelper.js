/* eslint-disable no-debugger */
/* eslint-disable valid-typeof */

import { injected, getAlgoConnector, web3Modal } from "../../wallet/connectors";
import store from "../../store/store";

import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletConnectProvider, ProxyProvider } from "@elrondnetwork/erdjs";
import QRCode from "qrcode";
import { ethers } from "ethers";

import {
    setTronWallet,
    setConfirmMaiarMob,
    setTronLink,
    setMetaMask,
    setTronLoginError,
    setStep,
    setOnMaiar,
    setElrondAccount,
    setMaiarProvider,
    setError,
    setTronPopUp,
    setQrImage,
    setQrCodeString,
    setWC,
    setAccount,
    setRedirectModal,
    setBitKeep,
    setConnectedWallet,
} from "../../store/reducers/generalSlice";

// import { getAddEthereumChain } from "../../wallet/chains";
import Web3 from "web3";

import { setSigner } from "../../store/reducers/signersSlice";

import { MainNetRpcUri, TestNetRpcUri } from "xp.network";
import { switchNetwork } from "../../services/chains/evm/evmService";

export const wallets = [
    "MetaMask",
    "WalletConnect",
    "Trust Wallet",
    "MyAlgo",
    "AlgoSigner",
    "Algorand Wallet",
    "TronLink",
    "Temple Wallet",
    "Beacon",
    "Maiar",
    "Maiar Extension",
    "Ledger",
    "Trezor",
    "Hashpack",
];

const { modalError } = store.getState();

export const connectUnstoppable = async (close) => {
    close();
    try {
        const provider = await web3Modal.connect();
        return provider.selectedAddress;
    } catch (error) {
        console.log(error);
    }
};

// export const switchNetWork = async (from) => {
//   // let fromChainId;
//   console.log(from, "from");
//   const chain = getAddEthereumChain()[parseInt(from.chainId).toString()];
//   console.log(chain);
//   const params = {
//     chainId: from.chainId, // A 0x-prefixed hexadecimal string
//     chainName: chain.name,
//     nativeCurrency: {
//       name: chain.nativeCurrency.name,
//       symbol: chain.nativeCurrency.symbol, // 2-6 characters long
//       decimals: chain.nativeCurrency.decimals,
//     },
//     rpcUrls: chain.rpc,
//     blockExplorerUrls: [
//       chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url
//         ? chain.explorers[0].url
//         : chain.infoURL,
//     ],
//   };
//   window.bitkeep?.ethereum &&
//     window.bitkeep?.ethereum
//       .request({
//         method: "wallet_switchEthereumChain",
//         params,
//       })
//       .then(() => {
//         console.log("Network Switch Success");
//       })
//       .catch((e) => {
//         console.log(e);
//       });
// };

const setBitKeepSigner = (account) => {
    const provider = new ethers.providers.Web3Provider(window.bitkeep.ethereum);
    const signer = provider.getSigner(account);
    store.dispatch(setSigner(signer));
};

export const connectBitKeep = async (from, navigate) => {
    let { to } = store.getState();
    // debugger;
    let provider;
    const isInstallBikeep = () => {
        return window.bitkeep && window.bitkeep?.ethereum;
    };
    if (!isInstallBikeep()) {
        if (window.innerWidth <= 600) {
            store.dispatch(setRedirectModal("BitKeep"));
        } else {
            window.open(
                "https://chrome.google.com/webstore/detail/bitkeep-bitcoin-crypto-wa/jiidiaalihmmhddjgbnbgdfflelocpak",
                "bitkeep installer",
                "width=500,height=500"
            );
        }
    } else {
        try {
            provider = window.bitkeep?.ethereum;
            await provider.request({ method: "eth_requestAccounts" });
            const web3 = new Web3(provider);
            const address = await web3.eth.getAccounts();
            const chainId = await web3.eth.getChainId();

            store.dispatch(setBitKeep(true));
            store.dispatch(setConnectedWallet("BitKeep"));
            store.dispatch(setAccount(address[0]));
            setBitKeepSigner(address[0]);

            if (from && from?.chainId !== chainId) {
                const switched = await switchNetwork(from);
                if (switched) {
                    store.dispatch(setBitKeep(true));
                    store.dispatch(setConnectedWallet("BitKeep"));
                    store.dispatch(setAccount(address[0]));
                    setBitKeepSigner(address[0]);
                }
                if (from && to) {
                    navigate();
                }
            } else {
                store.dispatch(setAccount(address[0]));
                setBitKeepSigner(address[0]);
                return true;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
};

export const connectMetaMask = async (
    activate,
    from,
    to,
    chainId,
    navigate
) => {
    const mobile = window.innerWidth <= 600;
    try {
        if (!window.ethereum && mobile) {
            const link = `dapp://${window.location.host}?to=${to}&from=${from}/`;
            window.open(link);
        }
        //d/
        if (!mobile && !window.safeLocalStorage?.getItem("XP_MM_CONNECTED"))
            await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [
                    {
                        eth_accounts: {},
                    },
                ],
            });

        if (to) {
            if (
                window.ethereum?.chainId ||
                chainId !== `0x${from?.chainId.toString(16)}`
            ) {
                await switchNetwork(from);
            }
        }

        await activate(injected);
        !mobile && window.safeLocalStorage?.setItem("XP_MM_CONNECTED", "true");
        store.dispatch(setMetaMask(true));
        if (from && to) {
            navigate();
        }
        return true;
    } catch (ex) {
        if (ex.code !== 4001) {
            store.dispatch(setError(ex));
        }
        if (ex.data) {
            console.log(ex.data.message);
        } else console.log(ex);
        return false;
    }
};

export const connectAlgoSigner = async (testnet) => {
    if (typeof window.AlgoSigner !== undefined) {
        try {
            await window.AlgoSigner.connect();
            const algo = await window.AlgoSigner.accounts({
                ledger: testnet ? "TestNet" : "MainNet",
            });
            // store.dispatch(setAlgoSigner(true));
            // store.dispatch(setAlgorandAccount(address));
            const address = algo[0].address;
            const signer = {
                address: algo[0],
                algoSigner: window.AlgoSigner,
                ledger: testnet ? "TestNet" : "MainNet",
            };
            // store.dispatch(setSigner(signer));
            return { signer, address };
        } catch (e) {
            console.error(e);
            return JSON.stringify(e, null, 2);
        }
    } else {
        console.log("Algo Signer not installed.");
        return false;
    }
};

export const connectTrustWallet = async (activate, from, chainId) => {
    const rpc = MainNetRpcUri[from.toUpperCase()];

    try {
        const walletConnect = new WalletConnectConnector({
            rpc: {
                [chainId]: rpc,
            },
            chainId,
            qrcode: true,
        });
        walletConnect.networkId = chainId;
        await activate(walletConnect, undefined, true);
        store.dispatch(setWC(walletConnect));
        return true;
    } catch (error) {
        store.dispatch(setError(error));
        if (error.data) {
            console.log(error.data.message);
        } else console.log(error);
        return false;
    }
};

export const onWalletConnect = async (activate, from, testnet, chainId) => {
    const key = from.toUpperCase();
    const rpc = testnet ? TestNetRpcUri[key] : MainNetRpcUri[key];
    try {
        const walletConnect = new WalletConnectConnector({
            rpc: {
                [chainId]: rpc,
                network: testnet ? "testnet" : "mainnet",
            },
            chainId,
            qrcode: true,
        });
        walletConnect.networkId = chainId;
        await activate(walletConnect, undefined, true);
        const account = await walletConnect.getAccount();
        store.dispatch(setAccount(account));
        store.dispatch(setWC(walletConnect));
        return true;
    } catch (error) {
        store.dispatch(setError(error));
        if (error.data) {
            console.log(error.data.message);
        } else console.log(error);
        return false;
    }
};

const onClientConnect = (maiarProvider) => {
    return {
        onClientLogin: async () => {
            const add = await maiarProvider.getAddress();
            store.dispatch(setConfirmMaiarMob(true));
            store.dispatch(setElrondAccount(add));

            store.dispatch(setMaiarProvider(maiarProvider));
            store.dispatch(setSigner(maiarProvider));
            store.dispatch(setOnMaiar(true));
            store.dispatch(setStep(2));
        },
        onClientLogout: async () => {
            store.dispatch(setQrCodeString(""));
        },
    };
};
const generateQR = async (text) => {
    try {
        const QR = await QRCode.toDataURL(text);
        return QR;
    } catch (err) {
        console.error(err);
    }
};
// Elrond blockchain connection ( Maiar )
export const connectMaiar = async () => {
    // debugger
    const provider = new ProxyProvider("https://gateway.elrond.com");
    const maiarProvider = new WalletConnectProvider(
        provider,
        "https://bridge.walletconnect.org/"
    );
    try {
        await maiarProvider.init();
        maiarProvider.onClientConnect = onClientConnect(maiarProvider);
        const qrCodeString = await maiarProvider.login();
        store.dispatch(setQrCodeString(qrCodeString));
        const qr = await generateQR(qrCodeString);
        store.dispatch(setQrImage(qr));
    } catch (error) {
        store.dispatch(setError(error));
        if (error.data) {
            console.log(error.data.message);
        } else console.log(error);
    }
};

// Tron blockchain connection ( TronLink )
export const connectTronlink = async () => {
    const {
        general: { factory },
    } = store.getState();
    if (window.innerWidth <= 600 && !window.tronWeb) {
        store.dispatch(setTronPopUp(true));
    } else {
        try {
            try {
                const accounts = await window.tronLink.request({
                    method: "tron_requestAccounts",
                });

                if (!accounts) {
                    store.dispatch(setTronLoginError("loggedOut"));
                }
            } catch (err) {
                console.log(err);
                if (!window.tronWeb) {
                    store.dispatch(setTronLoginError("noTronWeb"));
                }
            }

            if (window.tronLink && window.tronWeb.defaultAddress.base58) {
                console.log(window.tronLink);
                const publicAddress = window.tronWeb.defaultAddress.base58;

                await factory
                    .setProvider(9, window.tronWeb)
                    .catch((e) => console.log(e, "e"));

                store.dispatch(setTronWallet(publicAddress));
                store.dispatch(setTronLink(true));
                return true;
            }
        } catch (error) {
            if (!modalError) {
                store.dispatch(setError(error));
                if (error.data) {
                    console.log(error.data.message);
                } else console.log(error);
            }
            return false;
        }
    }
};

// Algorand blockchain connection ( Algo Wallet )
export const connectAlgoWallet = async () => {
    let connector = getAlgoConnector();
    if (!connector.connected) {
        connector.createSession();
    }
};
