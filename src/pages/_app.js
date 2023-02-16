import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../../artifacts/contracts/ProjectFactory.sol/ProjectFactory.json";
import Footer from "@/components/Footer";
import polygonPng from "../../public/images/polygon.png";
import filPng from "../../public/images/fil.png";
import mantlePng from "../../public/images/mantle.png";
import optimismPng from "../../public/images/optimism.png";


export default function App({ Component, pageProps }) {
  const contractMumbai = "0x4d5D1469EE0F9C878A87dd18f8A3895c83611194";
  // const contractMumbai = "0x398A4EEfe25b0e4f0Fada6C192Ab0F0d09f10952";
  const contractOptimism = "0xC2aB8fbf39107c1bba09462509E8E206f7074b84";
  const contractFilecoin = "0xF53F0bFbd8Ed9217f673B61271d5C2e2eA9D1167";
  const contractMantle = "0xF53F0bFbd8Ed9217f673B61271d5C2e2eA9D1167";

  const [userId, setUserId] = useState("");
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [signer, setSigner] = useState();

  const [chainImg, setChainImg] = useState();
  const [blockURL, setBlockURL] = useState("");

  const connectToContract = async () => {
    if (window?.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      setSigner(signer);

      let _user_address = await signer.getAddress();
      setUserAddress(_user_address);

      const network = await provider.getNetwork();
      let contractAddress;
      let chainIdMain = network.chainId;
      setChainId(chainIdMain);
      if (chainIdMain == 420) {
        contractAddress = contractOptimism;
        setChainImg(optimismPng);
        setBlockURL("https://goerli-optimism.etherscan.io/address/");
      } else if (chainIdMain == 3141) {
        contractAddress = contractFilecoin;
        setChainImg(filPng);
        setBlockURL("https://hyperspace.filfox.info/en/address/");
      } else if (chainIdMain == 5001) {
        contractAddress = contractMantle;
        setChainImg(mantlePng);
        setBlockURL("https://explorer.testnet.mantle.xyz/address/");
      } else {
        contractAddress = contractMumbai;
        setChainImg(polygonPng);
        setBlockURL("https://mumbai.polygonscan.com/address/");
      }

      const ProjectFactoryContract = new ethers.Contract(
        contractAddress,
        abi.abi,
        signer
      );

      setProvider(ProjectFactoryContract);
    } else {
      message.warn("Please install Metamask or any other web3 enabled browser");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }

    connectToContract();
  }, []);

  return (
    <>
      <Navbar
        connectToContract={connectToContract}
        userAddress={userAddress}
        provider={provider}
        chainId={chainId}
      />
      <Component
        {...pageProps}
        provider={provider}
        connectToContract={connectToContract}
        userAddress={userAddress}
        signer={signer}
        chainImg={chainImg}
        blockURL={blockURL}
      />
      <Footer userAddress={userAddress} />
    </>
  );
}
