import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  // walletConnected keeps track of whether user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // Create a reference to the Web3 Modal (used for connecting to metamask) which persists as long as the page is open
  const web3ModalRef = useRef();
  // ENS
  const [ens, setENS] = useState("");
  // Save the address of the currently connected account
  const [address, setAddress] = useState("");

  /**
   * Sets the ENS if the current connected address has an associated ENS or else it sets
   * the addresss of the connected wallet
   */
  const setENSOrAddress = async (address, web3Provider) => {
    // Lookup the ENS related to the given address
    let _ens = await web3Provider.lookupAddress(address);

    // If the address has an ENS associated, set the ENS, else just set the address
    if (_ens) {
      setENS(_ens);
    } else {
      setAddress(address);
    }
  };

  /**
   * A 'Provider' is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc
   * A 'Signer' is a special type of Provider used in case a 'write' transaction needs to be made to the blockchain, which involves
   * the connected account needing to make a digital signature to authorize the transaction being sent.
   * Metamask exposes a Signer API to allow your website to request signatures from the user using a Signer function.
   */
  const getProviderOrSigner = async () => {
    // Connect to Metamask
    // Since we store 'web3modal' as a reference, we need to access the 'current' value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to Goerli Network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("You are not connected to the Goerli Network!");
      throw new Error("Change network to Goerli");
    }

    const signer = web3Provider.getSigner();
    // Get the address associated to the signer which is connected to Metamask
    const address = await signer.getAddress();
    // Calls the function to set ENS or Address
    await setENSOrAddress(address, web3Provider);
    return signer;
  };

  /**
   * connectWallet: Connects the Metamask wallet
   */
  const connectWallet = async () => {
    // Get the provider from web3modal, which in our case is Metamask
    // When used for the first time, it prompts the user to connect their wallet
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * renderButton: Returns a button based on the state of the dapp
   */
  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet connected</div>;
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // If wallet is not connected, create a new instance of Web3Modal and connect to Metamask
    if (!walletConnected) {
      // Assign the web3modal class to the reference object by setting it's 'current' value
      // The 'current' value will persist throughout as long as the page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by LearnWeb3 Punks
      </footer>
    </div>
  );
}
