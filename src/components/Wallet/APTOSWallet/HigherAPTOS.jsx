/* eslint-disable no-debugger */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    setAccount,
    setConnectedWallet,
    setFrom,
    setWalletsModal,
} from "../../../store/reducers/generalSlice";
import { getRightPath } from "../../../utils";
import { withServices } from "../../App/hocs/withServices";
import { Chain } from "xp.network";
import { chains } from "../../values";
import {
    googleAnalyticsCategories,
    handleGA4Event,
} from "../../../services/GA4";

//import { biz } from "../../values";

export default function HigherAPTOS(OriginalComponent) {
    const updatedComponent = withServices((props) => {
        const { serviceContainer, close } = props;
        const { bridge } = serviceContainer;
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const APTOS_CHAIN = chains.find((chains) => chains.type === "APTOS");
        const { from, to } = useSelector((state) => state.general);

        const navigateToAccountRoute = () => {
            if (from && to) navigate(getRightPath());
        };

        const getStyles = () => {
            /*if (!biz) {
                return { display: "none" };
            }*/
            let styles = {};
            if (from && from.type !== "APTOS") {
                styles = {
                    pointerEvents: "none",
                    opacity: "0.6",
                };
            }
            return styles;
        };

        const connectWallet = async (wallet) => {
            let signer;
            let address;
            const chainWrapper = await bridge.getChain(Chain.APTOS);

            switch (wallet) {
                case "Martian":
                    //signer = await connectMartian();
                    //dispatch(setWalletsModal(false));
                    //dispatch(setConnectedWallet("Martian"));
                    // signer = connected;
                    break;
                case "Petra": {
                    const petra = window.petra;
                    if (!petra)
                        return window.open("https://petra.app/", "_blank");
                    const account = await petra.connect();
                    address = account.address;
                    signer = petra;
                    chainWrapper.chain.setPetraSigner(signer);
                    dispatch(setWalletsModal(false));
                    dispatch(setConnectedWallet("Petra"));

                    break;
                }
                case "Pontem":
                    //signer = await connectPontem();
                    //dispatch(setWalletsModal(false));
                    //dispatch(setConnectedWallet("Pontem"));
                    // signer = connected;
                    break;
                default:
                    break;
            }

            chainWrapper.setSigner(signer);
            bridge.setCurrentType(chainWrapper);
            dispatch(setAccount(address));
            dispatch(setWalletsModal(false));
            dispatch(setFrom(APTOS_CHAIN));
            close();
            navigateToAccountRoute();
            handleGA4Event(
                googleAnalyticsCategories.Content,
                `Connected with: ${wallet}`
            );
        };

        return (
            <OriginalComponent
                styles={getStyles}
                connectWallet={connectWallet}
            />
        );
    });
    return updatedComponent;
}
