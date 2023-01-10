import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkRgbaIn } from "../../Settings/helpers";

import {
  setWidget,
  setWSettings,
  setWid,
} from "../../../store/reducers/widgetSlice";
import { setSettings } from "../../../store/reducers/settingsSlice";
import mobileBanner from "../../Settings/assets/img/mobileOnlyBanner.svg";

import { initialState as initialWidget } from "../../../store/reducers/settingsSlice";
import { inIframe } from "../../Settings/helpers";

import WService from "../wservice";
import { useSearchParams } from "react-router-dom";

const wservice = WService();

//.nft-list__wrappera
const mobileOnlyBanner = `
<div class="mobileOnlyBanner"><img src=${mobileBanner} alt="mobileOnlyXP"/><div class="testComp">
    <h2>Widget</h2>
    <p>Mobile is not yet supported, please use widget on desktop.</p>
</div></div>  
`;

const overlay = document.createElement("div");

overlay.classList.add("bannerOverlay");

overlay.innerHTML = mobileOnlyBanner;

function initFromQuery() {
  const p = new URLSearchParams(window.location.search);

  const settings = {
    backgroundColor: p.get("background"),
    panelBackground: p.get("panelBackground"),
    modalBackground: p.get("modalBackground"),
    color: p.get("color"),
    fontFamily: p.get("fontFamily"),
    fontSize: p.get("fontSize"),
    btnColor: p.get("btnColor"),
    btnBackground: p.get("btnBackground"),
    btnRadius: p.get("btnRadius"),
    selectedChains: p.get("chains")?.split("-"),
    selectedWallets: p.get("wallets")?.split("-"),
    cardBackground: p.get("cardBackground"),
    cardBackgroundBot: p.get("cardBackgroundBot"),
    cardColor: p.get("cardColor"),
    cardRadius: p.get("cardRadius"),
    accentColor: p.get("accentColor"),
    secondaryColor: p.get("secondaryColor"),
    borderColor: p.get("borderColor"),
    tooltipColor: p.get("tooltipColor"),
    tooltipBg: p.get("tooltipBg"),
    iconColor: p.get("iconColor"),
    showLink: p.get("showLink"),
    affiliationFees: p.get("affiliationFees"),
    fromChain: p.get("from"),
    toChain: p.get("to"),
  };

  return settings;
}

async function initFormId(id) {
  if (id === "create" && window.ethereum) {
    const { signature, address } = await wservice.sign(undefined, true);

    const res = await wservice.add(
      address,
      signature,
      initialWidget,
      new URLSearchParams(window.location.search).get("name")
    );

    if (!res?.newWidget) {
      return;
    } //show error msg

    return window.open(
      `/${window.location.search
        .replace("create", res?.newWidget?._id)
        .replace(/&name=\S*/, "")}`,
      "_self"
    );
  }

  return (await wservice.get(id))?.settings;
}

const parentAccountChange = async (event) => {
  console.log(event.data?.type, 'type');
  if (event.data?.type === "ethAddress" && window.ethereum) {
<<<<<<< HEAD
    const parentAddress = event.data.address;
    console.log(parentAddress, 'parentAddress');
=======
    const parentAddress = event.data?.address;
    console.log(parentAddress);
>>>>>>> c5dd4bf4bd69849fbc15800e12356c6a981d83f8
    if (!parentAddress) return;
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    if (parentAddress.toLowerCase() !== account.toLowerCase()) {
      window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
    }
  }
};

export const InitWidget = (Wrapped) => {
  return function CB() {
    const dispatch = useDispatch();
    const [searchparams, setSearchParams] = useSearchParams();
    const { widget, wsettings, settings, wid } = useSelector(
      ({
        general: { from, to },
        settings,
        widget: { widget, wsettings, wid },
      }) => ({
        widget,
        settings,
        wsettings,
        wid,
        from,
        to,
      })
    );

    useEffect(() => {
      if (searchparams) {
        const wid = searchparams.get("wid");
        const widget = searchparams.get("widget") === "true" || wid;
        const wsettings = searchparams.get("wsettings") === "true";

        if (!widget && !wsettings && !wid) {
          setSearchParams({ widget: true, wsettings: true });
          return;
        }

        if (wsettings && window.innerWidth <= 600) {
          document.body.appendChild(overlay);
          document.body.style.pointerEvents = "none";
        }

        if (wsettings && window.innerWidth > 600) {
          dispatch(setWSettings(true));
          document.querySelector(".nftContainer").style = "margin-left: 300px";
        }

        dispatch(setWidget(true));
        console.log(wid, "wid");
        wid && dispatch(setWid(wid));
        document.body.classList.add("widget");

        inIframe() && window.addEventListener("message", parentAccountChange);

        return () => window.removeEventListener("message", parentAccountChange);
      }
    }, [searchparams]);

    useEffect(() => {
      let settings;

      widget &&
        (async () => {
          //document.body.classList.add("modal-open", "widgetBlur");

          if (!wsettings) {
            settings = wid ? await initFormId(wid) : initFromQuery();
          } else {
            settings = wid && (await initFormId(wid));
          }

          const {
            backgroundColor,
            panelBackground,
            modalBackground,
            color,
            secondaryColor,
            fontFamily,
            fontSize,
            btnColor,
            btnBackground,
            btnRadius,
            cardBackground,
            cardBackgroundBot,
            cardColor,
            cardRadius,
            accentColor,
            borderColor,
            iconColor,
            tooltipColor,
            tooltipBg,
            showLink,
            selectedChains,
            fromChain,
            toChain,
            selectedWallets,
            affiliationFees,
            affiliationWallet,
            affiliationSettings,
          } = settings || initialWidget;

          dispatch(
            setSettings({
              backgroundColor: checkRgbaIn("#" + backgroundColor),
              panelBackground: checkRgbaIn("#" + panelBackground),
              modalBackground: checkRgbaIn("#" + modalBackground),
              color: checkRgbaIn("#" + color),
              fontFamily,
              fontSize: String(fontSize).replace(/\D/g, ""),
              btnColor: checkRgbaIn("#" + btnColor),
              btnBackground: checkRgbaIn("#" + btnBackground),
              btnRadius: String(btnRadius).replace(/\D/g, ""),
              selectedChains: selectedChains?.map((c) =>
                c === "Gnosis" ? "xDai" : c
              ),
              selectedWallets,
              cardBackground: checkRgbaIn("#" + cardBackground),
              cardBackgroundBot: checkRgbaIn("#" + cardBackgroundBot),
              cardColor: checkRgbaIn("#" + cardColor),
              cardRadius: String(cardRadius).replace(/\D/g, ""),
              accentColor: checkRgbaIn("#" + accentColor),
              secondaryColor: checkRgbaIn("#" + secondaryColor),
              borderColor: checkRgbaIn("#" + borderColor),
              tooltipColor: checkRgbaIn("#" + tooltipColor),
              tooltipBg: checkRgbaIn("#" + tooltipBg),
              iconColor: checkRgbaIn("#" + iconColor),
              showLink: showLink === "true" ? true : false,
              affiliationWallet,
              affiliationFees: affiliationFees
                ? ((+affiliationFees - 1) * 100).toFixed(1)
                : 0,
              affiliationSettings: affiliationSettings?.map((feeSetting) => ({
                ...feeSetting,
                extraFees: feeSetting.extraFees
                  ? ((+feeSetting.extraFees - 1) * 100).toFixed(1)
                  : 0,
              })),
              fromChain: fromChain,
              toChain: toChain,
            })
          );
        })();
    }, [widget, wsettings, wid]);

    return (
      <Wrapped
        widget={widget}
        wsettings={wsettings}
        settings={settings}
        wid={wid}
      />
    );
  };
};