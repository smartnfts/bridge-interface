/* eslint-disable no-unused-vars */
import {
    CHAIN_INFO,
    AppConfigs,
    ChainFactory,
    ChainFactoryConfigs,
    ChainType,
    Chain,
} from "xp.network";

import ChainInterface from "./chains";

import axios from "axios";
import {
    BridgeModes,
    chains,
    stagingWNFT,
    wnft,
    wnftPattern,
} from "../components/values";

class Bridge {
    chains = {};
    config;
    checkWallet = null;
    currentType;
    network;

    getChainIdByKey(key, testnet) {
        const c = chains.find((chain) => chain.key === key);
        if (!c) return;
        return testnet ? c.tnChainId : c.chainId;
    }

    getNonce(chainId) {
        return chains.find(
            (chain) => chain.chainId === chainId || chain.tnChainId === chainId
        )?.nonce;
    }

    setCheckWallet(wallet) {
        this.checkWallet = wallet;
    }

    async init(network) {
        const testnet = BridgeModes.TestNet === network ? true : false;
        const staging = BridgeModes.Staging === network ? true : false;
        try {
            let config;
            let app;

            switch (true) {
                case testnet: {
                    config = await ChainFactoryConfigs.TestNet();
                    this.network = "testnet";
                    app = AppConfigs.TestNet();
                    break;
                }
                case staging: {
                    config = await ChainFactoryConfigs.Staging();
                    this.network = "staging";
                    app = AppConfigs.Staging();

                    break;
                }
                default: {
                    config = await ChainFactoryConfigs.MainNet();
                    this.network = "mainnet";
                    app = AppConfigs.MainNet();
                }
            }

            this.config = config;

            this.bridge = ChainFactory(app, config);

            return this;
        } catch (e) {
            console.log(e, "on Init bridge");
        }
    }

    async isWhitelisted(nonce, nft) {
        try {
            const chainWrapper = await this.getChain(Number(nonce));
            if (chainWrapper.disableWhiteList) return true;
            const { chain } = chainWrapper;

            const isWNFT = await this.isWrapped(nft.uri);

            //if (chainWrapper.nativeNotWhitelised && !isWNFT) {
            //return false;
            //}

            if (
                isWNFT &&
                nft.uri.includes(stagingWNFT) &&
                !window.location.pathname.includes(BridgeModes.Staging)
            )
                return false;

            if (
                window.location.pathname.includes(BridgeModes.Staging) &&
                isWNFT &&
                wnft.some((url) => nft.uri.includes(url))
            )
                return false;

            if (
                isWNFT ||
                !chain.isNftWhitelisted ||
                nft.native.contract === "SingleNFt"
            )
                return true;

            return await chain.isNftWhitelisted(nft);
            //const x = await chain.isNftWhitelisted(nft);
            //console.log(x, nft.native.contract);
            //return x;
        } catch (e) {
            console.log(e, "in isWhitelisted");
            return false;
        }
    }

    async getChain(nonce, params = {}) {
        // eslint-disable-next-line no-debugger
        // debugger;
        const chainParams = CHAIN_INFO.get(nonce);
        const chainId = String(nonce);
        const chain = this.chains[chainId];
        const overwrite = params.overwrite;

        if (chain && !overwrite) return chain;

        try {
            const params = {
                nonce,
                chainParams,
                chain: await this.bridge.inner(nonce),
                bridge: this.bridge,
            };

            switch (chainParams.type) {
                case ChainType.EVM:
                    switch (true) {
                        case Object.values(this.config)
                            .filter((params) => params.noWhitelist)
                            .map((p) => p.nonce)
                            .includes(params.nonce): {
                            this.chains[
                                chainId
                            ] = new ChainInterface.NoWhiteListEVM(params);
                            return this.chains[chainId];
                        }

                        case Chain.VECHAIN === params.nonce: {
                            this.chains[chainId] = new ChainInterface.VeChain(
                                params
                            );
                            return this.chains[chainId];
                        }
                    }
                    this.chains[chainId] = new ChainInterface.EVM(params);
                    return this.chains[chainId];
                case ChainType.TRON:
                    this.chains[chainId] = new ChainInterface.Tron(params);
                    return this.chains[chainId];
                case ChainType.ELROND:
                    this.chains[chainId] = new ChainInterface.Elrond(params);
                    return this.chains[chainId];
                case ChainType.ALGORAND:
                    this.chains[chainId] = new ChainInterface.Algorand(params);
                    return this.chains[chainId];
                case ChainType.TEZOS:
                    this.chains[chainId] = new ChainInterface.Tezos(params);
                    return this.chains[chainId];
                case ChainType.COSMOS:
                    this.chains[chainId] = new ChainInterface.Cosmos(params);
                    return this.chains[chainId];
                case ChainType.TON:
                    this.chains[chainId] = new ChainInterface.TON(params);
                    return this.chains[chainId];
                case ChainType.NEAR:
                    this.chains[chainId] = new ChainInterface.Near(params);
                    return this.chains[chainId];
                case ChainType.SOLANA:
                    this.chains[chainId] = new ChainInterface.Solana(params);
                    return this.chains[chainId];
                case ChainType.APTOS:
                    this.chains[chainId] = new ChainInterface.APTOS(params);
                    return this.chains[chainId];
                case ChainType.HEDERA:
                    this.chains[chainId] = new ChainInterface.HEDERA(params);
                    return this.chains[chainId];
                case ChainType.DFINITY:
                    this.chains[chainId] = new ChainInterface.ICP(params);
                    return this.chains[chainId];
                case ChainType.CASPER:
                    this.chains[chainId] = new ChainInterface.Casper(params);
                    return this.chains[chainId];
                default:
                    throw new Error("unsuported chain");
            }
        } catch (e) {
            console.log(e.message || e, "error in getChain");
            throw e;
        }
    }

    async isWrapped(uri) {
        if (/^data:application\/json/.test(uri)) {
            const res = await (await axios(uri)).data;
            return Boolean(res.wrapped) && res;
        }
        return new RegExp(wnftPattern).test(uri);
    }

    async unwrap(nft) {
        const wnft = await this.isWrapped(nft.uri);

        if (wnft) {
            if (/.+\/$/.test(nft.uri)) {
                nft.uri = nft.uri + nft.native.tokenId;
            }

            try {
                const res =
                    typeof wnft === "object"
                        ? { data: wnft }
                        : await axios(nft.uri);

                const { data } = res;

                const origin = data.wrapped?.origin;

                const chain = await this.getChain(Number(origin)).catch(
                    async (e) => {
                        if (
                            e.message.includes(
                                "Cannot read properties of undefined "
                            )
                        ) {
                            const mainnetBridge = await this.init();
                            return await mainnetBridge.getChain(Number(origin));
                        }
                    }
                );

                nft.isWrappedNft = true;
                //nft.origin = origin;

                return chain.unwrap(nft, data);
            } catch (e) {
                console.log(e.message);
            }
        }

        return {
            nft,
            chainId: nft.native?.chainId,
            tokenId: nft.native?.tokenId,
            contract: nft.collectionIdent,
        };
    }

    setCurrentType({ chainParams }) {
        this.currentType = chainParams.type;
    }
}

export default () => new Bridge();
