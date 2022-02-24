import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setSelectedNFTList,
  removeFromSelectedNFTList,
} from "../../store/reducers/generalSlice";
import CheckGreen from "../../assets/img/icons/check_green.svg";
import NFTdetails from './NFTdetails'
import { useSelector } from "react-redux";
import { setupURI } from "../../wallet/oldHelper";
import { getUrl } from "./NFTHelper.js";
import "./NewNFT.css";
import { isValidHttpUrl } from "../../wallet/helpers";
import VideoOrImage from "./VideoOrImage";
import VideoAndImage from "./VideoAndImage"
import NotWhiteListed from "./NotWhiteListed"
import BrockenUtlGridView from "./BrockenUtlGridView";


export default function NFTcard({ nft, index }) {



    const dispatch = useDispatch();
    const selectedNFTs = useSelector((state) => state.general.selectedNFTList);
    const isSelected = selectedNFTs.filter(
      (n) =>
        n.native.tokenId === nft.native.tokenId &&
        n.native.contract === nft.native.contract &&
        n.native.chainId === nft.native.chainId
    )[0];
    const [onHover, setOnHover] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false);

    const { video, videoUrl, imageUrl, image, ipfsArr } = getUrl(nft);

    

    function addRemoveNFT(chosen) {
        if (!isSelected) {
            dispatch(setSelectedNFTList(chosen));
        } else {
            dispatch(removeFromSelectedNFTList(nft));
        }
    }

    const imageLoadedHandler = () => {
      setImageLoaded(true)
    }

    useEffect(() => {
        setTimeout(() => {
            setImageLoaded(true);
        }, 5000);
    }, [selectedNFTs]);

    
    return (
        <div className={`nft-box__wrapper`}
        onMouseEnter={() => setOnHover(true)}
        onMouseLeave={() => setOnHover(false)}>
            <div className={isSelected ? "nft-box__container--selected" : "nft-box__container"}>
              <div onClick={() => addRemoveNFT(nft, index)} className="nft-image__container">
                <div className="image__wrapper">
                  { nft.uri && isValidHttpUrl(nft.uri) ? 
                    video && image ? <VideoAndImage imageLoaded={() => imageLoadedHandler} videoUrl={videoUrl} imageUrl={imageUrl} />
                  : image && !video ? <img onLoad={() => imageLoadedHandler} alt="#" src={setupURI(imageUrl)} /> 
                  : (!image && video) ? <div>Only video</div> 
                  : ipfsArr?.length && <VideoOrImage urls={ipfsArr} i={index} />
                  : <BrockenUtlGridView />
                  }
                  <div className="radio__container">
                    {!isSelected ? (
                      <span className="selected-radio"></span>
                    ) : (
                      <img src={CheckGreen} alt="" />
                    )}
                  </div>
                </div>
              </div>
              <div className={`nft-content__container ${!imageLoaded ? "preload-content-container" : ""}`}>
                <span className="nft-name"><span className="name">{nft.name}</span><NFTdetails nftInf={nft} index={index} /></span>
                <span className="nft-number">{nft.native.tokenId}</span>
              </div>
            </div>
            { !imageLoaded && 
                <div className="preload__container">
                    <div className="preload__image"></div>
                    <div className="preload__content">
                        <div className="preload__name"></div>
                        <div className="preload__number"></div>
                    </div>
                </div>
            }
            { (!nft.whitelisted && onHover) && <NotWhiteListed /> }
        </div>
      );
}