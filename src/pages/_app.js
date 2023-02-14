import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../../artifacts/contracts/ProjectFactory.sol/ProjectFactory.json";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  const contractMumbai = "0x2d8f29c2c21335fcB19f727ed24C0389208A6E66";
  // const contractMumbai = "0x398A4EEfe25b0e4f0Fada6C192Ab0F0d09f10952";
  const contractOptimism = "0xC2aB8fbf39107c1bba09462509E8E206f7074b84";
  const contractFilecoin = "0xF53F0bFbd8Ed9217f673B61271d5C2e2eA9D1167";
  const contractMantle = "0xF53F0bFbd8Ed9217f673B61271d5C2e2eA9D1167";

  const [userId, setUserId] = useState("");
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [signer, setSigner] = useState();

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
      } else if (chainIdMain == 3141) {
        contractAddress = contractFilecoin;
      } else if (chainIdMain == 5001) {
        contractAddress = contractMantle;
      } else {
        contractAddress = contractMumbai;
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
    const userId = localStorage.getItem("userInfo");
    console.log(userId);
    setUserId(userId);
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
        userId={userId}
      />
      <Component
        {...pageProps}
        provider={provider}
        connectToContract={connectToContract}
        userAddress={userAddress}
        signer={signer}
        userId={userId}
      />
      <Footer
        userAddress={userAddress}
      />
    </>
  );
}
