import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
    connectAlgorandWalletClaim,
    removeFromNotWhiteListed,
    setShowAbout,
    setShowVideo,
    setTronPopUp,
} from "../../store/reducers/generalSlice";
import TonQeCodeModal from "./TonModal/TonQeCodeModal";
import About from "../../components/innercomponents/About";
import Video from "../../components/innercomponents//Video";
import ConnectAlgorand from "./AlgorandModal/ConnectAlgorand";
import SuccessModal from "./Success/SuccessModal";
import TechnicalSupport from "../innercomponents/TechnicalSupport";
import TransferLoader from "../innercomponents/TransferLoader";

export default function Modals() {
    const dispatch = useDispatch();

    const tronPopUp = useSelector((state) => state.general.tronPopUp);
    const tonQRCodeModal = useSelector((state) => state.tonStore.qrCode);
    const show = useSelector((state) => state.general.about);
    const video = useSelector((state) => state.general.video);
    const connectClaimAlgorand = useSelector(
        (state) => state.general.connectClaimAlgorand
    );
    const txnHashArr = useSelector((state) => state.general.txnHashArr);
    const nftsToWhitelist = useSelector(
        (state) => state.general.nftsToWhitelist
    );
    const transferModalLoader = useSelector(
        (state) => state.general.transferModalLoader
    );

    function closeAboutModal() {
        dispatch(setShowAbout(false));
    }
    function closeVideoModal() {
        dispatch(setShowVideo(false));
    }
    const closeAlgorandClaimModal = () => {
        dispatch(connectAlgorandWalletClaim(false));
    };
    const toShowSuccess = () => {
        return txnHashArr?.length ? true : false;
        // return true;
    };
    function closeSupportModal() {
        dispatch(removeFromNotWhiteListed());
    }
    function handleTronClose() {
        dispatch(setTronPopUp(false));
    }

    return (
        <>
            <Modal show={tonQRCodeModal}>
                <TonQeCodeModal />
            </Modal>
            <Modal
                className="about-nft__modal"
                show={show}
                animation={false}
                onHide={closeAboutModal}
            >
                <About />
            </Modal>
            <Modal
                animation={false}
                show={video}
                onHide={closeVideoModal}
                className="video__modal"
            >
                <Video />
            </Modal>
            <Modal
                show={connectClaimAlgorand}
                onHide={closeAlgorandClaimModal}
                animation="false"
                className="ChainModal"
            >
                <ConnectAlgorand />
            </Modal>
            <Modal
                animation={false}
                className="success-modal"
                show={toShowSuccess()}
            >
                <SuccessModal />
            </Modal>
            {nftsToWhitelist.length ? (
                <Modal
                    className="ts-modal"
                    animation={false}
                    size="sm"
                    show={nftsToWhitelist}
                    onHide={closeSupportModal}
                >
                    <TechnicalSupport />
                </Modal>
            ) : (
                ""
            )}
            <Modal show={tronPopUp} onHide={handleTronClose}></Modal>
            <Modal
                className="transfer-loader-modal"
                animation={false}
                show={transferModalLoader}
                size="sm"
            >
                <TransferLoader />
            </Modal>
        </>
    );
}
