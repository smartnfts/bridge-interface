/* eslint-disable react/prop-types */
import React, { useEffect } from "react";

import { Chain } from "xp.network";

import { useDispatch, useSelector } from "react-redux";



import {
  setAccount,
  setConnectedWallet,
  setFrom,
  setTo,
  setSelectedNFTList,
  setReceiver,
  updateApprovedNFTs,
  setTxnHash,
  setNearRedirect
} from "../../../store/reducers/generalSlice";
import { setSigner } from "../../../store/reducers/signersSlice";

import { chains } from "../../values";

import { useNavigate } from "react-router";
import { getRightPath } from "../../../wallet/helpers";

export const withNearConnection = (Wrapped) =>
  function CB(props) {
    const { serviceContainer } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
   // const locationHook = useLocation()

    const {NFTList, selectedNFTList, afterNearRedirect } = useSelector((state) => ({
      NFTList: state.general.NFTList,
      selectedNFTList: state.general.selectedNFTList,
      afterNearRedirect: state.general.afterNearRedirect
    }));

    const params = new URLSearchParams(location.search.replace("?", ""));
    const nearAuth = params.get("all_keys") && params.get("account_id");
    const nearTrx = params.get("NEARTRX");
    const nearFlow = nearTrx || nearAuth;
    const approve = params.get("type") === "approve";
    const send =
      params.get("type") === "transfer" || params.get("type") === "unfreeze";

    useEffect(() => {
      (async () => {
        if (serviceContainer.bridge) {
          if (nearFlow && serviceContainer.bridge.config) {
            const chainWrapper = await serviceContainer?.bridge?.getChain(
              Chain.NEAR
            );

           
            //const nearParams = serviceContainer?.bridge?.config?.nearParams;
            const walletConnection = await chainWrapper?.connect();
            const address = walletConnection.getAccountId();
            console.log(address, "account");
            const signer = walletConnection.account();
            console.log(signer);

            if (address && signer) {
              dispatch(setAccount(address));
              dispatch(setSigner(signer));
              serviceContainer.bridge.setCurrentType(chainWrapper);
              dispatch(setConnectedWallet("Near Wallet"));
              chainWrapper.setSigner(signer);
              dispatch(setFrom(chains.find((c) => c.nonce === Chain.NEAR)));

              if (nearTrx) {
                console.log("NEAR: jump to wallet");
                const to = params.get("to");
                dispatch(setTo(chains.find((c) => c.nonce === Number(to))));
                navigate(getRightPath());
              }
            }
          }
        }
      })();
    }, [serviceContainer]);

    useEffect(() => {

      if (Array.isArray(NFTList) &&  nearTrx && afterNearRedirect) {
        dispatch(setNearRedirect())
        const tokenId = params.get("tokenId");
        const contract = params.get("contract");
        const chainId = String(Chain.NEAR);
        const receiver = params.get("receiver");
        const hash = params.get("transactionHashes");
        
        if (approve) {
            const selectedNft =  NFTList.find(
                (nft) => nft.native.tokenId === tokenId
              );

          console.log("NEAR: inApprove");
          const alreadyS = selectedNFTList.some(
            (nft) => nft.native.tokenId === tokenId
          );

          !alreadyS && dispatch(setSelectedNFTList(selectedNft));
          dispatch(setReceiver(receiver));
          dispatch(updateApprovedNFTs(selectedNft));
        }

        if (send && hash && serviceContainer.bridge) {
          console.log("NEAR: in send");

          let selectedNft = NFTList.find(
            (nft) => nft.native.tokenId === tokenId
          );
  
          if (!selectedNft) {
              const xp_near_transfered_nft = window.safeLocalStorage?.getItem('_xp_near_transfered_nft');
              selectedNft = JSON.parse(xp_near_transfered_nft);
           
          }
  

          const nft = {
            image: selectedNft.image || selectedNft.media,
            name: selectedNft.title,
            uri: '',
            native: {
              tokenId,
              contract,
              chainId,
            },
          };

          serviceContainer.bridge.getChain(
            Chain.NEAR
          ).then(chainWrapper => {
            console.log(`about to notify ${hash}`);
              const {chain} = chainWrapper;
              chain.notify(hash)

          })
          dispatch(setReceiver(receiver));
          dispatch(setSelectedNFTList(nft));
          dispatch(
            setTxnHash({
              txn: { hash },
              nft,
            })
          );


        }
      }
    }, [NFTList, serviceContainer]);

    return <Wrapped {...props} />;
  };

/****
   * 
   * 
   *     const umt = await chain.chain.getUserMinter(
                  "",
                  "dimabrook-testnet.testnet"
                );

                console.log(umt);

                const trx = await chain.chain.mintNft(
                  await umt.account("dimabrook-testnet.testnet"),
                  {
                    contract: "usernftminter.testnet",
                    token_id: `NFT#{${Math.ceil(Math.random() * 10000000)}}`,
                    token_owner_id: address,
                    metadata: {
                      image:
                        "https://ipfs.featured.market/ipfs/QmdUhQt8ksfgpxjCYNYFY9134j9H2VUUdNRNsKCs6wFZxb",
                      name: "Halloween Party Girls ",
                      description:
                        "Halloween is all about supernatural, unrealistic and eccentric costumes.\nAdd this Rare NFT in your collection.",
                      attributes: [
                        {
                          trait_type: "eyes",
                          value: "green",
                        },
                      ],
                    },
                  }
                );

                console.log(trx);
   */
