import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../../artifacts/contracts/ProjectFactory.sol/ProjectFactory.json";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  const contractMumbai = "0xC2aB8fbf39107c1bba09462509E8E206f7074b84";
  const contractOptimism = "0xC2aB8fbf39107c1bba09462509E8E206f7074b84";
  const contractFilecoin = "0xF53F0bFbd8Ed9217f673B61271d5C2e2eA9D1167";
  const contractMantle = "0xF53F0bFbd8Ed9217f673B61271d5C2e2eA9D1167";

  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [signer, setSigner] = useState();

  const connectToContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    setSigner(signer);

    let _user_address = await signer.getAddress();
    setUserAddress(_user_address);

    const network = await provider.getNetwork();
    let contractAddress;
    let chainIdMain = network.chainId;
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
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }

    connectToContract();
  }, [userAddress]);

  return (
    <>
      <Navbar
        connectToContract={connectToContract}
        userAddress={userAddress}
        provider={provider}
      />
      <Component
        {...pageProps}
        provider={provider}
        connectToContract={connectToContract}
        userAddress={userAddress}
        signer={signer}
      />
      <Footer />
    </>
  );
}
