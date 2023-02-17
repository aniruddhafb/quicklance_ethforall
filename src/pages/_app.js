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
import goerliImg from "../../public/images/ethereumOG.png";
import { Framework } from "@superfluid-finance/sdk-core";

export default function App({ Component, pageProps }) {
  const contractMumbai = "0x2B38061f4F0Ef5f9444dA5D727Bff14275D30a35";
  const contractOptimism = "0xC2aB8fbf39107c1bba09462509E8E206f7074b84";
  const contractFilecoin = "0xF53F0bFbd8Ed9217f673B61271d5C2e2eA9D1167";
  const contractMantle = "0xF53F0bFbd8Ed9217f673B61271d5C2e2eA9D1167";
  const contractGoerli = "0xF53F0bFbd8Ed9217f673B61271d5C2e2eA9D1167";

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
      } else if (chainIdMain == 5) {
        contractAddress = contractGoerli;
        setChainImg(goerliImg);
        setBlockURL("https://goerli.etherscan.io/address/");
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
      alert("Please install Metamask or any other web3 enabled browser");
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
        chainId={chainId}
      />
      <Footer userAddress={userAddress} />
    </>
  );
}
