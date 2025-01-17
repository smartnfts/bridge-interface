import React from "react";
import icon from "../../../assets/img/wallet/WalletConnect.svg";
import PropTypes from "prop-types";
import HigherEVM from "./HigherEVM";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Modal } from "@web3modal/react";

import {
    setAccountWalletModal,
    setWalletsModal,
} from "../../../store/reducers/generalSlice";

function WalletConnect({ styles /*connectWallet*/ }) {
    const dispatch = useDispatch();
    const { open } = useWeb3Modal();
    const from = useSelector((state) => state.general.from);
    const testnet = useSelector((state) => state.general.testNet);

    const handleClick = async () => {
        dispatch(setWalletsModal(false));
        dispatch(setAccountWalletModal(false));
        open({ route: "SelectNetwork" });
    };

    return (
        <li
            style={
                !testnet && from
                    ? styles()
                    : { pointerEvents: "none", opacity: "0.7" }
            }
            onClick={handleClick}
            className="wllListItem"
            data-wallet="WalletConnect"
        >
            <img src={icon} alt="WalletConnect Icon" />
            <p>WalletConnect</p>
        </li>
    );
}
WalletConnect.propTypes = {
    styles: PropTypes.func,
    connectWallet: PropTypes.func,
};
export default HigherEVM(WalletConnect);
