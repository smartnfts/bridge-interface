import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedNFTList,removeFromSelectedNFTList, updateNFTs } from "../../store/reducers/generalSlice";
import NFTdetails from './NFTdetails'
import { useSelector } from "react-redux";
import { setupURI } from "../../wallet/oldHelper";
import { getUrl, isWhiteListed } from "./NFTHelper.js";
import { isValidHttpUrl, parseEachNFT } from "../../wallet/helpers";
import VideoOrImage from "./VideoOrImage";
import VideoAndImage from "./VideoAndImage"
import NotWhiteListed from "./NotWhiteListed"
import BrockenUtlGridView from "./BrockenUtlGridView";
import "./NewNFT.css";
// import "./NFTcard.css"
import Preload from "./Preload";


export default function NFTcard({ nft, index }) {

    const from = useSelector(state => state.general.from)
    const dispatch = useDispatch();
    const selectedNFTs = useSelector((state) => state.general.selectedNFTList);
    const isSelected = selectedNFTs.filter(
      (n) =>
        n.native.tokenId === nft.native.tokenId &&
        n.native.contract === nft.native.contract &&
        n.native.chainId === nft.native.chainId
    )[0];

    const [whiteListed, setWhitelisted] = useState(true)
    // const { video, videoUrl, imageUrl, image, ipfsArr } = getUrl(nft);
    const [dataLoaded, setDataloaded] = useState(false)
    

    useEffect(async() => {
       await parseEachNFT(nft, index)
    },[])
    

    function addRemoveNFT(chosen) {
        if (!isSelected) {
            dispatch(setSelectedNFTList(chosen));
        } else {
            dispatch(removeFromSelectedNFTList(nft));
        }
    }


  
    
    return (
        <div className={`nft-box__wrapper`}>
          { !nft.dataLoaded ? <Preload /> : 
          <div onClick={() => nft.whiteListed ? addRemoveNFT(nft, index): undefined } className={nft.whiteListed ? "nft__card--selected" : "nft__card"}>
            <div className="nft__main">
              { nft.uri && isValidHttpUrl(nft.uri, index) ? 
                nft.animation_url && nft.image ? <VideoAndImage index={index} videoUrl={nft.animation_url} imageUrl={nft.image} />
              : nft.image && !nft.animation_url ? <img alt=""  src={setupURI(nft.image)} /> 
              : !nft.image && nft.animation_url ? <video controls={false}  playsInline={true} autoPlay={true} loop={true}  muted={true} src={setupURI(nft.animation_url)} />
              : [nft.animation_url,nft.image]?.length > 0 && <VideoOrImage urls={[nft.animation_url,nft.image]} i={index} />
              : <BrockenUtlGridView />
              }
              { !isSelected ? <div className="nft-radio"></div> : <div className="nft-radio--selected"></div> }
              { !nft.whitelisted && <NotWhiteListed /> }
            </div>
            <div className="nft__footer">
                <span className="nft-name"><span className="name">{nft.name || nft.native.name}</span><NFTdetails nftInf={nft} index={index} /></span>
                <span className="nft-number">{nft.native.tokenId}</span>
            </div>
          </div>
          }
        </div>
      );
}


{/* <div className={isSelected ? "nft-box__container--selected" : "nft-box__container"}>
<div onClick={() => whiteListed ? addRemoveNFT(nft, index): undefined} className="nft-image__container">
  <div className="image__wrapper">
    { nft.uri && isValidHttpUrl(nft.uri, index) ? 
      video && image ? <VideoAndImage index={index} imageLoaded={() => imageLoadedHandler} videoUrl={videoUrl} imageUrl={imageUrl} />
    : image && !video ? <img onLoad={() => imageLoadedHandler} alt="only image"  src={setupURI(imageUrl)} /> 
    : !image && video ? <video onLoadedData={imageLoadedHandler} controls={false}  playsInline={true} autoPlay={true} loop={true}  muted={true} src={setupURI(videoUrl)} />
    : ipfsArr?.length > 0 && <VideoOrImage urls={ipfsArr} i={index} />
    : <BrockenUtlGridView />
    }
    { !isSelected ? <div className="nft-radio"></div> : <div className="nft-radio--selected"></div> }
  </div>
  { !whiteListed && <NotWhiteListed /> }
</div>
<div className={`nft-content__container ${!imageLoaded ? "preload-content-container" : ""}`}>
  <span className="nft-name"><span className="name">{nft.name || nft.native.name}</span><NFTdetails nftInf={nft} index={index} /></span>
  <span className="nft-number">{nft.native.tokenId}</span>
</div>
</div> */}