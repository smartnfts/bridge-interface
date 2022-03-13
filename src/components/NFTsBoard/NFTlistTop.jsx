import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import Search from "../../assets/img/icons/Search.svg";
import ListView from "../../assets/img/icons/ListView.svg";
import GridView from "../../assets/img/icons/GridView.svg";
import { useDispatch } from "react-redux";
import {setSearchNFTList, allSelected, setNFTsListView, setSwitchDestination, cleanSelectedNFTList } from "../../store/reducers/generalSlice";
import { useSelector } from "react-redux";
import { setNFTS } from "../../wallet/helpers";
import Refresh from "../../assets/img/refresh.svg";
import { ReactComponent as SearchComp } from "../../assets/img/icons/Search.svg";
import { ReactComponent as ListViewComp } from "../../assets/img/icons/ListView.svg";
import { ReactComponent as GridViewComp } from "../../assets/img/icons/GridView.svg";
import { ReactComponent as RefreshComp } from "../../assets/img/refresh.svg";
import ChainListBox from "../Chains/ChainListBox";
import NFTSearch from "./NFTSearch";


function NFTlistTop() { 
  const dispatch = useDispatch();
  const nfts = useSelector((state) => state.general.NFTList);
  const { algorandAccount, tronWallet, elrondAccount, tezosAccount, account, bigLoader } = useSelector((state) => state.general);
  const selectedNFTs = useSelector((state) => state.general.selectedNFTList);
  const NFTListView = useSelector((state) => state.general.NFTListView);
  const OFF = { opacity: 0.6, pointerEvents: "none" };
  const from = useSelector((state) => state.general.from);
  const widget = useSelector((state) => state.general.widget);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e) => {
    dispatch(setSearchNFTList(e.target.value));
  };

  const handleClose = () => {
    dispatch(setSwitchDestination(false));
  };

  const handleView = () => {
    dispatch(setNFTsListView());
  };
  const refresh = async () => {
    if (!bigLoader || !nfts) {
      let w;
      if (from.type === "EVM") w = account;
      else if (from.type === "Tezos") w = tezosAccount;
      else if (from.type === "Algorand") w = algorandAccount;
      else if (from.type === "Elrond") w = elrondAccount;
      else if (from.type === "Tron") w = tronWallet;
      await setNFTS(w, from.key);
    }
  };

  const refreshStyle = {
    cursor: bigLoader ? "" : "pointer",
    opacity: bigLoader ? 0.6 : 1,
  };


  const off = { display: "none" };
  return (
    <>
      <div className="yourNft--mobile">
        <span className="yourNft__title">Your NFTs on </span>
        <div className="yourNft__chain">
          <span>
            <img
              style={{ width: "30px" }}
              src={from.image.src}
              alt="NFT Name"
            />{" "}
            {from.key === "xDai" ? "Gnosis Chain" : from.key}
          </span>
          <span style={refreshStyle} onClick={refresh}>
            {widget ? (
              <RefreshComp className="svgWidget" />
            ) : (
              <img className="refreshnfts" src={Refresh} />
            )}
          </span>
        </div>
      </div>
      <div className="nftListTop">
        <ChainListBox />
        <div className="yourNft desktopOnly">
          Your NFTs on{" "}
          <span>
            <img
              style={{ width: "29px" }}
              src={from.image.src}
              alt="NFT Name"
            />{" "}
            {from.key === "xDai" ? "Gnosis Chain" : from.key}
          </span>
          <span style={refreshStyle} onClick={refresh}>
            {widget ? (
              <RefreshComp className="svgWidget" />
            ) : (
              <img className="refreshnfts" src={Refresh} alt="#" />
            )}
          </span>
        </div>
        <div className="mobileOnly seleNftMob">
          Selected <span>{`/ ${nfts ? nfts.length : ""} `}</span>
        </div>
        <div className="nftTopRIght">
          <NFTSearch />
          <div onClick={() => handleView()} className="change-view__button">
          { NFTListView ? <div className="grid-icon"></div>:<div className="list-icon"></div> }
          </div>
          {/* <span onClick={() => setShowSearch(prev => prev = !prev)} className="mobileOnly search-btn"><img src={Search} /></span> */}
          {nfts?.length === selectedNFTs?.length ? <div className="delete-all" onClick={() => dispatch(cleanSelectedNFTList())}></div>
          :<div style={nfts ? {} : OFF} onClick={() => dispatch(allSelected())} className="select-all"></div>
          }
        </div>
        {/* !!! Show on click */}
        <div style={!showSearch ? {} : off} className="mobileOnly mobSearch">
          <form action="#">
            <input
              type="search"
              placeholder="Search NFT"
              onChange={(e) => handleSearch(e)}
            />
            <button type="button">
              <img src={Search} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default NFTlistTop;
