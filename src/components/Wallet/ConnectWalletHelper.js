
import { TempleWallet } from "@temple-wallet/dapp";
import { injected, algoConnector } from "../../wallet/connectors"
import store  from "../../store/store"
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { WalletConnectProvider, ProxyProvider, ExtensionProvider } from "@elrondnetwork/erdjs"
import QRCode from 'qrcode'
import { setTronWallet, 
  setConfirmMaiarMob, 
  setTronLink, 
  setMetaMask, 
  setTronLoginError, 
  setStep, 
  setOnMaiar, 
  setElrondAccount, 
  setMaiarProvider, 
  setReset, 
  setError, 
  setTronPopUp, 
  setAlgoSigner, 
  setAlgorandAccount,
  setMyAlgo, 
  setTezosAccount, 
  setKukaiWallet, 
  setTempleWallet, 
  setQrImage, 
  setQrCodeString } from "../../store/reducers/generalSlice"


const { to, modalError } = store.getState()


export const connectMetaMask = async (activate, from, to) => {
// debugger
    try {
        if(!window.ethereum && window.innerWidth <= 600) {
            const uri = `https://metamask.app.link/dapp/${window.location.host + `?to=${to.text}&from=${from.text}`}/`
          window.open(uri)
        }
        await activate(injected);
        store.dispatch(setMetaMask(true))
      } 
      catch (ex) {
          store.dispatch(setError(ex))
          if(ex.data){
            console.log(ex.data.message);
          }
          else console.log(ex);
      }
}

// Algorand blockchain connection ( AlgoSigner )
export const connectAlgoSigner =async () => {
  if (typeof window.AlgoSigner !== undefined) {
      try {
        await window.AlgoSigner.connect()
        console.log("Algo: ", window.AlgoSigner);
        const algo = await window.AlgoSigner.accounts({
          ledger: 'MainNet'
        });
        const { address } = algo[0]
        
        store.dispatch(setAlgoSigner(true))
        store.dispatch(setAlgorandAccount(address))
      } catch (e) {
        console.error(e);
    return JSON.stringify(e, null, 2);
      }
    } else {
      console.log("Algo Signer not installed.");
    }
}

// Tezos blockchain connection ( Temple Wallet )
export const connectTempleWallet = async () => {
  // debugger
    try {
      const available = await TempleWallet.isAvailable();
      if (!available) {
        throw new Error("Temple Wallet not installed");
      }
      const wallet = new TempleWallet("XP.NETWORK Cross-Chain NFT Bridge");
      await wallet.connect("mainnet");
      const tezos = wallet.toTezos();
      const accountPkh = await tezos.wallet.pkh();
      store.dispatch(setTezosAccount(accountPkh))
      store.dispatch(setTempleWallet(true))

    } catch (error) {
      console.error(error);
    }
}
// Tezos blockchain connection ( Beacon )
export const connectBeacon = async () => {
  const Tezos = new TezosToolkit("https://mainnet-tezos.giganode.io");
  const wallet = new BeaconWallet({ name: "XP.NETWORK Cross-Chain NFT Bridge" });
  Tezos.setWalletProvider(wallet);
  console.log("Tezos: ", Tezos);
  try {
    const permissions = await wallet.client.requestPermissions();
    store.dispatch(setTezosAccount(permissions.address))
    store.dispatch(setKukaiWallet(true))
  } catch (error) {
    console.log("Got error:", error);
  }
}

 export const connectMyAlgo = async () => {
  const myAlgoConnect = new MyAlgoConnect();
  try {
    const accountsSharedByUser = await myAlgoConnect.connect()
    console.log("MY Algo: ", myAlgoConnect);
    store.dispatch(setAlgorandAccount(accountsSharedByUser[0].address))
    store.dispatch(setMyAlgo(true))
  } catch (error) {
    console.log(error);
  }
}

const onClientConnect = ( maiarProvider ) => {
  return {
    onClientLogin: async () => {
        const add = await maiarProvider.getAddress()
      store.dispatch(setConfirmMaiarMob(true))
      store.dispatch(setElrondAccount(add))
      store.dispatch(setMaiarProvider(maiarProvider))
      store.dispatch(setOnMaiar(true))
      store.dispatch(setStep(2))
    },
    onClientLogout: async () => {
      store.dispatch(setReset())
    }
  }
}
const generateQR = async text => {
  try {
    const QR = await QRCode.toDataURL(text)
    return QR
  } catch (err) {
    console.error(err)
  }
}
// Elrond blockchain connection ( Maiar )
export const connectMaiar = async () => {
  console.log("dsfsdfsdfsdfdf")
  // debugger
    const provider = new ProxyProvider( "https://gateway.elrond.com")
    const maiarProvider = new WalletConnectProvider(provider, 'https://bridge.walletconnect.org/', onClientConnect);
      try {
        await maiarProvider.init()
        maiarProvider.onClientConnect = onClientConnect(maiarProvider)
        const qrCodeString = await maiarProvider.login()
        store.dispatch(setQrCodeString(qrCodeString))
        const qr = await generateQR(qrCodeString)
        store.dispatch(setQrImage(qr))
      } catch (error) {
        store.dispatch(setError(error))
        if(error.data){
          console.log(error.data.message);
        }
        else console.log(error); 
      }
  }

// Elrond blockchain connection ( Maiar Extension )
  export const connectMaiarExtension = async () => {
    const instance = ExtensionProvider.getInstance()
    try {
      await instance.init()
      await instance.login()
      const { account } = instance
      store.dispatch(setOnMaiar(true))
      store.dispatch(setElrondAccount(account.address))
      store.dispatch(setMaiarProvider(instance))
    } 
    catch(err) {
      window.open('https://getmaiar.com/defi', '_blank');
      console.log(err)
    }
  }

// Tron blockchain connection ( TronLink )
  export const connectTronlink = async () => {
      if(window.innerWidth <= 600 && !window.tronWeb){
        store.dispatch(setTronPopUp(true))
      }
      else{
        try{
          try{
            const accounts = await window.tronLink.request({ method: 'tron_requestAccounts' });
            
            if(!accounts){
              store.dispatch(setTronLoginError("loggedOut"))``
            }
          } 
          catch(err){
            console.log(err);
            if(!window.tronWeb){
              store.dispatch(setTronLoginError("noTronWeb"))
            }
          }
          
          if(window.tronLink && window.tronWeb.defaultAddress.base58) {
            const publicAddress = window.tronWeb.defaultAddress.base58
            store.dispatch(setTronWallet(publicAddress))
            store.dispatch(setTronLink(true))

          }
        } 
        catch(error) {
          if(!modalError){
            store.dispatch(setError(error))
            if(error.data){
              console.log(error.data.message);
            }
            else console.log(error); 
          }
        }
      }
    }

// Algorand blockchain connection ( Algo Wallet )
    export const connectAlgoWallet = async () => {
      if (!algoConnector.connected) {
          algoConnector.createSession()   
      }
    }