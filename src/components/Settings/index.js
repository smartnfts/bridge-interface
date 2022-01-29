import React, { useEffect, useState, useMemo } from "react";
import { Image, Dropdown, Accordion, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import power from "./assets/img/power.svg";

import {
  setSettings,
  chains,
  wallets,
} from "../../store/reducers/settingsSlice";
import "./Settings.css";

const debounce = (func, delay) => {
  let tm;

  return (...args) => {
    clearTimeout(tm);
    tm = setTimeout(() => {
      return func(...args);
    }, delay);
  };
};

function WSettings() {
  const { settings } = useSelector(({ settings }) => ({
    settings,
  }));

  const [copied, setCopied] = useState(false);

  const dispatch = useDispatch();

  const {
    backgroundColor,
    color,
    fontSize,
    btnColor,
    btnBackground,
    btnRadius,
    fontFamily,
    cardBackground,
    cardRadius,
    accentColor,
    secondaryColor,
    selectedChains,
    iconColor,
    borderColor,
    selectedWallets,
    showAlert,
    bridgeState,
  } = settings;

  const deboucedSet = (e, key) =>
    dispatch(setSettings({ ...settings, [key]: e }));

  const debounceCheck = (val) => {
    const checked = selectedChains.includes(val);
    const newSelected = checked
      ? selectedChains.filter((chain) => chain !== val)
      : [...selectedChains, val];
    dispatch(
      setSettings({
        ...settings,
        showAlert: newSelected.length < 2 ? "chains" : false,
        selectedChains: newSelected.length < 2 ? selectedChains : newSelected,
      })
    );
  };

  const walletCheck = (val) => {
    const checked = selectedWallets.includes(val);
    const newSelected = checked
      ? selectedWallets.filter((wallet) => wallet !== val)
      : [...selectedWallets, val];
    dispatch(
      setSettings({
        ...settings,
        showAlert: newSelected.length < 2 ? "wallets" : false,
        selectedWallets: newSelected.length < 2 ? selectedWallets : newSelected,
      })
    );
  };

  //const prod = false;

  const iframeSrc = useMemo(() => {
    console.log(bridgeState, "sa");
    return `${window.location.href
      .replace("#", "")
      .replace("wsettings=true&", "")}&background=${backgroundColor &&
      backgroundColor.split("#")[1]}&color=${color &&
      color.split("#")[1]}&fontSize=${fontSize &&
      fontSize}&btnColor=${btnColor &&
      btnColor.split("#")[1]}&btnBackground=${btnBackground &&
      btnBackground.split("#")[1]}&btnRadius=${btnRadius &&
      btnRadius}&fontFamily=${fontFamily &&
      fontFamily}&chains=${selectedChains.join(
      "-"
    )}&cardBackground=${cardBackground &&
      cardBackground.split("#")[1]}&cardRadius=${cardRadius &&
      cardRadius}&secondaryColor=${secondaryColor &&
      secondaryColor.split("#")[1]}&accentColor=${accentColor &&
      accentColor.split("#")[1]}&borderColor=${borderColor &&
      borderColor.split("#")[1]}&iconColor=${iconColor &&
      iconColor.split("#")[1]}&wallets=${selectedWallets.join(
      "-"
    )}&bridgeState=${JSON.stringify(bridgeState)}`;
  }, [settings]);

  return (
    <div className="setting_sidebar">
      <Alert
        show={showAlert}
        variant="danger"
        style={{ position: "absolute", zIndex: "999" }}
        onClose={() => dispatch(setSettings({ ...settings, showAlert: false }))}
        dismissible
      >
        <p style={{ marginTop: "15px" }}>
          You can't show less than two available {showAlert}
        </p>
      </Alert>

      <Alert
        show={copied}
        variant="info"
        style={{ position: "absolute", zIndex: "999", width: "100%" }}
        onClose={() => dispatch(setSettings({ ...settings, showAlert: false }))}
      >
        <p style={{ marginTop: "15px" }}>Copied!</p>
      </Alert>
      <div className="site_setting">
        <h2>Settings</h2>
      </div>
      <div className="sidebar_content">
        <div className="genarel_setting">
          <h6>WIDGET SETTINGS</h6>
        </div>
        <div className="setting_list">
          <Accordion defaultActiveKey="10">
            <Accordion.Item eventKey="1">
              <Accordion.Header>Integrated Blockchains</Accordion.Header>

              <Accordion.Body>
                <div className="blockChainCont">
                  <ul className="select_block_chain">
                    {chains.map((chain, i) => (
                      <li
                        key={i}
                        className="blockChain_item"
                        onClick={() => debounceCheck(chain)}
                      >
                        <div className="select_nft">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            checked={selectedChains.includes(chain)}
                            onChange={() => debounceCheck(chain)}
                          />
                          <span className="icon selectNfticon"></span>
                        </div>
                        <div className="blockChainItem">
                          <img
                            src={
                              require(`./assets/img/nft/${chain}.svg`).default
                            }
                            alt={chain}
                          />

                          {chain}
                          {chain === "Cardano" ||
                          chain === "Heco" ||
                          chain === "Solana" ? (
                            <span
                              style={{
                                color: "grey",
                                borderColor: "grey",
                                fontSize: "10px",
                              }}
                            >
                              coming soon
                            </span>
                          ) : (
                            ""
                          )}
                          {chain === "Velas" || chain === "Tezos" ? (
                            <span>new</span>
                          ) : (
                            ""
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion defaultActiveKey="11">
            <Accordion.Item eventKey="111">
              <Accordion.Header>Wallets</Accordion.Header>

              <Accordion.Body>
                <div className="blockChainCont">
                  <ul className="select_block_chain">
                    {wallets.map((wallet, i) => (
                      <li
                        key={i + "wallet"}
                        className="blockChain_item"
                        onClick={() => walletCheck(wallet)}
                      >
                        <div className="select_nft">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            checked={selectedWallets.includes(wallet)}
                            onChange={() => walletCheck(wallet)}
                          />
                          <span className="icon selectNfticon"></span>
                        </div>
                        <div className="blockChainItem">
                          <img
                            src={
                              wallet === "AlgoSigner"
                                ? require(`./assets/img/wallets/${wallet}.png`)
                                    .default
                                : require(`./assets/img/wallets/${wallet}.svg`)
                                    .default
                            }
                            alt={wallet}
                          />

                          {wallet}

                          {wallet === "Ledger" || wallet === "Trezor" ? (
                            <span
                              style={{
                                color: "grey",
                                borderColor: "grey",
                                fontSize: "10px",
                              }}
                            >
                              coming soon
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion defaultActiveKey="12">
            <Accordion.Item eventKey="2">
              <Accordion.Header>Background</Accordion.Header>
              <Accordion.Body>
                <div className="typographyContainer">
                  <div className="typographyBox ">
                    <div className="typo-sel header_color_select">
                      <h5>Color</h5>
                      <div className="select_color">
                        <div className="colorInp">
                          <input
                            type="color"
                            name="check_txt_fl2"
                            id="check_txt_f2"
                            value={backgroundColor}
                            onChange={(e) =>
                              deboucedSet(e.target.value, "backgroundColor")
                            }
                          />
                        </div>
                        <div className="colorCode">
                          <input
                            type="text"
                            placeholder="# 000000"
                            id="color_of_head"
                            value={backgroundColor}
                            onChange={(e) =>
                              deboucedSet(e.target.value, "backgroundColor")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion defaultActiveKey="13">
            <Accordion.Item eventKey="3">
              <Accordion.Header>Typography</Accordion.Header>

              <Accordion.Body>
                <div className="typographyContainer">
                  <div className="typographyBox ">
                    <h3>Body</h3>
                    <div className="typo-sel header_color_select">
                      <h5>Font Color</h5>
                      <div className="select_color">
                        <div className="colorInp">
                          <input
                            type="color"
                            name="check_txt_fl2"
                            id="check_txt_f2"
                            value={color}
                            onChange={(e) =>
                              deboucedSet(e.target.value, "color")
                            }
                          />
                        </div>
                        <div className="colorCode">
                          <input
                            type="text"
                            placeholder="# 000000"
                            id="color_of_head"
                            value={color}
                            onChange={(e) =>
                              deboucedSet(e.target.value, "color")
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="typo-sel header_color_select">
                      <h5>Secondary Font Color</h5>
                      <div className="select_color">
                        <div className="colorInp">
                          <input
                            type="color"
                            id=""
                            value={secondaryColor}
                            onChange={(e) =>
                              deboucedSet(e.target.value, "secondaryColor")
                            }
                          />
                        </div>
                        <div className="colorCode">
                          <input
                            type="text"
                            placeholder="# 000000"
                            id="color_of_head"
                            value={secondaryColor}
                            onChange={(e) =>
                              deboucedSet(e.target.value, "secondaryColor")
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="typo-sel header_color_select">
                      <h5>Accent Font Color</h5>
                      <div className="select_color">
                        <div className="colorInp">
                          <input
                            type="color"
                            id=""
                            value={accentColor}
                            onChange={(e) =>
                              deboucedSet(e.target.value, "accentColor")
                            }
                          />
                        </div>
                        <div className="colorCode">
                          <input
                            type="text"
                            placeholder="# 000000"
                            id="color_of_head"
                            value={accentColor}
                            onChange={(e) =>
                              deboucedSet(e.target.value, "accentColor")
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="typo-sel font-select">
                      <h5>Font family</h5>
                      <div className="select_font">
                        <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic">
                            {fontFamily}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <ul>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onClick={(e) =>
                                    deboucedSet("Roboto", "fontFamily")
                                  }
                                >
                                  Roboto
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onClick={(e) =>
                                    deboucedSet("Open Sans", "fontFamily")
                                  }
                                >
                                  Open Sance
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onClick={(e) =>
                                    deboucedSet("Inter", "fontFamily")
                                  }
                                >
                                  Inter
                                </a>
                              </li>
                            </ul>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="typo-sel font-size-sel">
                      <h5>Font size</h5>
                      <div className="select_font">
                        <div className="typo-sel header_color_select">
                          <div className="cornerRadi">
                            <input
                              type="text"
                              placeholder="16px"
                              //value={fontSize}
                              onChange={(e) =>
                                deboucedSet(e.target.value, "fontSize")
                              }
                            />
                          </div>
                        </div>
                        <Dropdown style={{ display: "none" }}>
                          <Dropdown.Toggle id="dropdown-basic">
                            {fontSize}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <ul>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onClick={(e) => deboucedSet("28", "fontSize")}
                                >
                                  Large (28px)
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onClick={(e) => deboucedSet("22", "fontSize")}
                                >
                                  Medium (22px)
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onClick={(e) => deboucedSet("16", "fontSize")}
                                >
                                  Normal (16px)
                                </a>
                              </li>
                            </ul>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                  <div className="typographyBox " style={{ display: "none" }}>
                    <h3>Body Text</h3>
                    <div className="typo-sel header_color_select">
                      <h5>Color</h5>
                      <div className="select_color">
                        <div className="colorInp">
                          <input type="color" id="" />
                        </div>
                        <div className="colorCode">
                          <input
                            type="text"
                            placeholder="# 000000"
                            id="color_of_head"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="typo-sel header_color_select">
                      <h5>Seconday Font Color</h5>
                      <div className="select_color">
                        <div className="colorInp">
                          <input type="color" id="" />
                        </div>
                        <div className="colorCode">
                          <input
                            type="text"
                            placeholder="# 000000"
                            id="color_of_head"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="typo-sel header_color_select">
                      <h5>Accent</h5>
                      <div className="select_color">
                        <div className="colorInp">
                          <input type="color" id="" />
                        </div>
                        <div className="colorCode">
                          <input
                            type="text"
                            placeholder="# 000000"
                            id="color_of_head"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="typo-sel font-select">
                      <h5>Font family</h5>
                      <div className="select_font">
                        <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic">
                            {fontFamily}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <ul>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onChange={(e) =>
                                    deboucedSet("Roboto", "fontFamily")
                                  }
                                >
                                  Roboto
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onChange={(e) =>
                                    deboucedSet("Open Sans", "fontFamily")
                                  }
                                >
                                  Open Sance
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onChange={(e) =>
                                    deboucedSet("Inter", "fontFamily")
                                  }
                                >
                                  Inter
                                </a>
                              </li>
                            </ul>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="typo-sel font-size-sel">
                      <h5>Font size</h5>
                      <div className="select_font">
                        <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic">
                            Large (28px)
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <ul>
                              <li>
                                <a className="dropdown-item" href="#">
                                  Medium (22px)
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  Normal (16px)
                                </a>
                              </li>
                            </ul>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion defaultActiveKey="14">
            <Accordion.Item eventKey="4">
              <Accordion.Header>Buttons</Accordion.Header>
              <Accordion.Body>
                <div className="button_settCont">
                  <div className="typo-sel header_color_select">
                    <h5>Color</h5>
                    <div className="select_color">
                      <div className="colorInp">
                        <input
                          type="color"
                          id="check_txt_fl3"
                          value={btnBackground}
                          onChange={(e) =>
                            deboucedSet(e.target.value, "btnBackground")
                          }
                        />
                      </div>
                      <div className="colorCode">
                        <input
                          type="text"
                          placeholder="# 000000"
                          id="color_of_head"
                          value={btnBackground}
                          onChange={(e) =>
                            deboucedSet(e.target.value, "btnBackground")
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="typo-sel header_color_select">
                    <h5>Text color</h5>
                    <div className="select_color">
                      <div className="colorInp">
                        <input
                          type="color"
                          id="check_txt_fl4"
                          value={btnColor}
                          onChange={(e) =>
                            deboucedSet(e.target.value, "btnColor")
                          }
                        />
                      </div>
                      <div className="colorCode">
                        <input
                          type="text"
                          placeholder="# 000000"
                          id="color_of_head"
                          value={btnColor}
                          onChange={(e) =>
                            deboucedSet(e.target.value, "btnColor")
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="typo-sel header_color_select">
                    <h5>Corner radius</h5>
                    <div className="cornerRadi">
                      <input
                        type="text"
                        placeholder="9px"
                        //value={state.btnRadius}
                        onChange={(e) =>
                          deboucedSet(e.target.value, "btnRadius")
                        }
                      />
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion defaultActiveKey="15">
            <Accordion.Item eventKey="7">
              <Accordion.Header>NFT Cards</Accordion.Header>
              <Accordion.Body>
                <div className="button_settCont">
                  <div className="typo-sel header_color_select">
                    <h5>Background</h5>
                    <div className="select_color">
                      <div className="colorInp">
                        <input
                          type="color"
                          id="check_txt_fl3"
                          value={cardBackground}
                          onChange={(e) =>
                            deboucedSet(e.target.value, "cardBackground")
                          }
                        />
                      </div>
                      <div className="colorCode">
                        <input
                          type="text"
                          placeholder="# 000000"
                          id="color_of_head"
                          value={cardBackground}
                          onChange={(e) =>
                            deboucedSet(e.target.value, "cardBackground")
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="typo-sel header_color_select">
                    <h5>Card corner radius</h5>
                    <div className="cornerRadi">
                      <input
                        type="text"
                        placeholder="25px"
                        //value={state.btnRadius}
                        onChange={(e) =>
                          deboucedSet(e.target.value, "cardRadius")
                        }
                      />
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion defaultActiveKey="16">
            <Accordion.Item eventKey="9">
              <Accordion.Header>Borders</Accordion.Header>
              <Accordion.Body>
                <div className="button_settCont">
                  <div className="typo-sel header_color_select">
                    <h5>Border Color</h5>
                    <div className="select_color">
                      <div className="colorInp">
                        <input
                          type="color"
                          id="check_txt_fl3"
                          value={borderColor}
                          onChange={(e) =>
                            deboucedSet(e.target.value, "borderColor")
                          }
                        />
                      </div>
                      <div className="colorCode">
                        <input
                          type="text"
                          placeholder="# 000000"
                          id="color_of_head"
                          value={borderColor}
                          onChange={(e) =>
                            deboucedSet(e.target.value, "borderColor")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion defaultActiveKey="17">
            <Accordion.Item eventKey="8">
              <Accordion.Header>Icons</Accordion.Header>
              <Accordion.Body>
                <div className="button_settCont">
                  <div className="typo-sel header_color_select">
                    <h5>Icon Color</h5>
                    <div className="select_color">
                      <div className="colorInp">
                        <input
                          type="color"
                          id="check_txt_fl3"
                          value={iconColor}
                          onChange={(e) =>
                            deboucedSet(e.target.value, "iconColor")
                          }
                        />
                      </div>
                      <div className="colorCode">
                        <input
                          type="text"
                          placeholder="# 000000"
                          id="color_of_head"
                          value={iconColor}
                          onChange={(e) =>
                            deboucedSet(e.target.value, "iconColor")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Accordion defaultActiveKey="18">
            <Accordion.Item eventKey="5">
              <Accordion.Header>Export Code</Accordion.Header>
              <Accordion.Body>
                <div className="export_code">
                  <div className="typo-sel header_color_select">
                    <h5>Paste this code</h5>
                    <div className="exportCodeCont">
                      <p id="iframeSrc">{`<iframe src='${iframeSrc}' frameborder='0' ></iframe>`}</p>
                      <button
                        className={`copyCode icon ${copied ? "copied" : ""}`}
                        onClick={() => {
                          var aux = document.createElement("div");
                          aux.setAttribute("contentEditable", true);
                          aux.innerHTML = document.getElementById(
                            "iframeSrc"
                          ).innerHTML;
                          aux.setAttribute(
                            "onfocus",
                            "document.execCommand('selectAll',false,null)"
                          );
                          document.body.appendChild(aux);
                          aux.focus();
                          document.execCommand("copy");
                          document.body.removeChild(aux);

                          // navigator.clipboard.writeText(
                          //</div> `<iframe src='${iframeSrc}' frameborder='0' ></iframe>`
                          //);
                          setCopied(true);

                          setTimeout(() => setCopied(false), 500);
                        }}
                      ></button>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
      <div className="sideFooter">
        <div className="help">
          <h3>Help</h3>
          <a href="#" className="help_icon">
            <span className="icon qustion_icon"></span>
          </a>
        </div>
        <div className="powerBySet">
          <a href="https://xp.network/" target={"_blank"} className="power_by">
            <img src={power} alt="XP.Network" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default WSettings;
