import React, { useState } from "react";
import hashpack from "../../../assets/img/wallet/hashpack.svg";
import { HashConnect } from "hashconnect";

import HigherHEDERA from "./HigherHEDERA";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

//import { biz } from "../../values";

function Hashpack({ connect }) {
    const [loading, setLoading] = useState(false);

    const OFF = { opacity: 0.6, pointerEvents: "none" };
    const temporaryFrom = useSelector((state) => state.general.temporaryFrom);
    const from = useSelector((state) => state.general.from);
    let hashConnect = new HashConnect(true);

    const getStyle = () => {
        /*if (!biz) {
            return { display: "none" };
        }*/
        if (temporaryFrom?.type === "Hedera") {
            return {};
        } else if (temporaryFrom && temporaryFrom?.type !== "Hedera") {
            return OFF;
        } else if (from && from?.text !== "Hedera") return OFF;
        else if (loading) return OFF;
        else return {};
    };
    return (
        <li
            onClick={() => {
                setLoading(true);
                connect("HashPack", hashConnect);
                setTimeout(() => setLoading(false), 2000);
            }}
            className="wllListItem"
            style={getStyle()}
            data-wallet="Hashpack"
        >
            <img style={{ width: "28px" }} src={hashpack} alt="Hashpack Icon" />
            <p>Hashpack</p>
        </li>
    );
}

Hashpack.propTypes = {
    getStyles: PropTypes.func,
    connect: PropTypes.func,
    bridge: PropTypes.object,
    connected: PropTypes.func,
};

export default HigherHEDERA(Hashpack);
