import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import profileImg from "../../public/images/profile.png";
import Link from "next/link";
import polygonPng from "../../public/images/polygon.png";
import optimismPng from "../../public/images/optimism.png";
import filPng from "../../public/images/fil.png";
import mantlePng from "../../public/images/mantle.png";
import goerliImg from "../../public/images/ethereumOG.png";
import quickImg from "../../public/images/quick.png";
import quickFav from "../../public/images/quickFav.png";
import defaultAvatar from "../../public/images/avatar.png";
import { BsChevronDown } from "react-icons/bs";
import { useDispatch } from "react-redux";
import axios from "axios";
import * as PushAPI from "@pushprotocol/restapi";

const Navbar = ({ connectToContract, userAddress, provider }) => {
  const [userData, setUserData] = useState([]);

  const [showNotifications, SetShowNotifications] = useState(false);
  const [showProfile, SetShowProfile] = useState(false);
  const [showNetworkPopup, setShowNetworkPopup] = useState(false);
  const [navDropDown, setnavDropDown] = useState(true);
  const [optedIn, setOptedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const [notificationData, setNotificationData] = useState();
  const [chainIdMain, setChainIdMain] = useState();
  const [trueSigner, setTrueSigner] = useState();
  const [userInfo, setUserInfo] = useState({ image: "", username: "" });

  const QUICKLANCE_CHANNEL_ADDRESS =
    "0xe7ac0B19e48D5369db1d70e899A18063E1f19021";

  const connectToWallet = async () => {
    if (window?.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );

      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setTrueSigner(signer);
      connectToContract(signer);
      const { chainId } = await provider.getNetwork();
      setChainIdMain(chainId);
    } else {
      alert("Please install Metamask or any other web3 enabled browser");
    }
  };
  const getNotifications = () => {
    PushAPI.user
      .getFeeds({
        user: `eip155:${chainIdMain}:${userAddress}`, // user address in CAIP
        env: "staging",
        page: 1,
        limit: 10,
      })
      .then((feeds) => {
        // console.log("user notifications: ", feeds);
        setNotificationData(feeds);
      })
      .catch((err) => {
        console.error("failed to get user notifications: ", err);
      });
  };
  const getChats = () => {
    PushAPI.chat
      .chats({
        account: `${userAddress}`,
        env: "staging",
      })
      .then((chats) => {
        // console.log("user chats: ", chats);
      })
      .catch((err) => {
        console.error("user chats: ", err);
      });
  };
  const getUser = async () => {
    await PushAPI.user
      .get({
        account: `${userAddress}`,
        env: "staging",
      })
      .then((data) => {
        // console.log("user info: ", data);
      })
      .catch((err) => {
        console.error("user info: ", err);
      });
  };
  const optInToChannel = async () => {
    await PushAPI.channels.subscribe({
      env: "staging",
      signer: trueSigner,
      channelAddress: `eip155:${chainIdMain}:${QUICKLANCE_CHANNEL_ADDRESS}`, // channel address in CAIP
      userAddress: `eip155:${chainIdMain}:${userAddress}`, // user address in CAIP
      onSuccess: () => {
        // console.log("opt-in success");
        setOptedIn(true);
      },
      onError: (err) => {
        console.error("opt-in error", err);
      },
    });
  };
  const fetchUserData = async () => {
    try {
      if (userAddress) {
        const res = await axios({
          url: `${process.env.NEXT_PUBLIC_PROD_SERVER}/api/users/getUserByWalletAddress`,
          method: "POST",
          data: {
            wallet: userAddress,
          },
        });

        console.log({ navabr: res.data });
        if (res.status == 200) {
          const { image, username } = res.data;
          // console.log({ image });
          setUserInfo({ image, username });
          setIsRegistered(true);
        }
      }
    } catch (error) {
      console.log(error.response.data);
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    connectToWallet();
    getNotifications();
    getUser();
    getChats();
    fetchUserData();
    // fetchFreelancers();
  }, [chainIdMain, userAddress]);

  // switch or add chain mainnets
  const switchoptimismChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1A4" }],
      });
      setChainIdMain("420");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x1A4",
                chainName: "Optimism Goerli",
                nativeCurrency: {
                  name: "Optimism Goerli",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://goerli-optimism.etherscan.io/"],
                rpcUrls: ["https://endpoints.omniatech.io/v1/op/goerli/public"],
              },
            ],
          });
          setChainIdMain("5");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchFilChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xC45" }],
      });
      setChainIdMain("3141");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xC45",
                chainName: "Filecoin - Filecoin testnet",
                nativeCurrency: {
                  name: "Filecoin",
                  symbol: "Fil",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://fil.com"],
                rpcUrls: ["https://api.Filecoin.node.glif.io/rpc/v1	"],
              },
            ],
          });
          setChainIdMain("3141");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchPolygonChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });
      setChainIdMain("80001");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x89",
                chainName: "Mumbai",
                nativeCurrency: {
                  name: "Polygon",
                  symbol: "MATIC",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://polygonscan.com/"],
                rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
              },
            ],
          });
          setChainIdMain("80001");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchMantleChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1389" }],
      });
      setChainIdMain("5001");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "1389",
                chainName: "Mantle",
                nativeCurrency: {
                  name: "Mantle",
                  symbol: "BIT",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://mantle.xyz/"],
                rpcUrls: ["https://rpc.testnet.mantle.xyz"],
              },
            ],
          });
          setChainIdMain("5001");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  return (
    <nav
      x-data="{ isOpen: false }"
      className="relative bg-white shadow dark:bg-gray-800"
    >
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between text-center">
            <Link href="/" className="flex flex-row justify-center align-middle">
              <Image className="w-auto h-10 sm:h-10" src={quickFav} alt="quickLogo" height={100} width={100} />
              <h1 className="text-xl font-[400] text-yellow-50 text-center mt-1">QUICKLANCE</h1>
            </Link>

            {/* action button  */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                aria-label="toggle menu"
              >
                <svg
                  x-show="!isOpen"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  onClick={() => {
                    setnavDropDown(!navDropDown);
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* navbar drop down  */}
          {navDropDown ? (
            <div className="absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center">
              <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
                <Link
                  href="/projects"
                  className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Find Projects
                </Link>
                <Link
                  href="/freelancers"
                  className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Hire Freelancers
                </Link>
                {/* <Link
                  href="/web3jobs"
                  className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Web3 Jobs
                </Link> */}
              </div>

              {userAddress ? (
                <div className="flex flex-row">
                  <div className="relative mr-20 z-[100]">
                    {/* network nav div  */}
                    <button
                      onClick={() => setShowNetworkPopup(!showNetworkPopup)}
                      className="relative hidden sm:block"
                    >
                      <div className="flex flex-row justify-center align-middle w-[200px]">
                        {chainIdMain == 420 && (
                          <>
                            <Image
                              src={optimismPng}
                              height={25}
                              width={35}
                              alt="ethPng"
                            />
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Optimism
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 text-white" />
                          </>
                        )}
                        {chainIdMain == 80001 && (
                          <>
                            <Image
                              src={polygonPng}
                              height={20}
                              width={30}
                              alt="maticPng"
                            />
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Polygon
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 text-white" />
                          </>
                        )}
                        {chainIdMain == 3141 && (
                          <>
                            <Image
                              src={filPng}
                              height={25}
                              width={35}
                              alt="filPng"
                            />
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Filecoin
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 text-white" />
                          </>
                        )}
                        {chainIdMain == 5001 && (
                          <>
                            <Image
                              src={mantlePng}
                              height={25}
                              width={35}
                              alt="filPng"
                            />
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Mantle
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 text-white" />
                          </>
                        )}
                        {chainIdMain == 5 && (
                          <>
                            <Image
                              src={goerliImg}
                              height={25}
                              width={35}
                              alt="filPng"
                            />
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Goerli
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 text-white" />
                          </>
                        )}
                        {chainIdMain == 1 && (
                          <>
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Unsupported Chain
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 text-white" />
                          </>
                        )}
                        {chainIdMain == 56 && (
                          <>
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Unsupported Chain
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 text-white" />
                          </>
                        )}
                        {chainIdMain == 137 && (
                          <>
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Unsupported Chain
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 text-white" />
                          </>
                        )}
                        {chainIdMain == 43114 && (
                          <>
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Unsupported Chain
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 text-white" />
                          </>
                        )}
                        {chainIdMain == 97 && (
                          <>
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Unsupported Chain
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 text-white" />
                          </>
                        )}
                      </div>
                    </button>

                    {/* network drop down  */}
                    {showNetworkPopup && (
                      <div className="flex flex-col justify-center w-[200px] absolute top-[24px] right-0 mt-7 shadow-lg bg-gray-800 z-10 text-sm shadow-4xl rounded-b-lg cursor-pointer">
                        {chainIdMain != 420 && (
                          <div
                            className="flex flex-row justify-center mt-4 mb-2"
                            onClick={() => switchoptimismChain()}
                          >
                            <Image
                              src={optimismPng}
                              height={25}
                              width={35}
                              alt="ethPng"
                            />
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Optimism
                            </p>
                          </div>
                        )}
                        {chainIdMain != 3141 && (
                          <div
                            className="flex flex-row justify-center mt-4 mb-2"
                            onClick={() => switchFilChain()}
                          >
                            <Image
                              src={filPng}
                              height={25}
                              width={35}
                              alt="filPng"
                            />
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Filecoin
                            </p>
                          </div>
                        )}
                        {chainIdMain != 80001 && (
                          <div
                            className="flex flex-row justify-center mt-2 mb-4"
                            onClick={() => switchPolygonChain()}
                          >
                            <Image
                              src={polygonPng}
                              height={20}
                              width={30}
                              alt="maticPng"
                            />
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Polygon
                            </p>
                          </div>
                        )}
                        {chainIdMain != 5001 && (
                          <div
                            className="flex flex-row justify-center mt-2 mb-4"
                            onClick={() => switchMantleChain()}
                          >
                            <Image
                              src={mantlePng}
                              height={20}
                              width={30}
                              alt="maticPng"
                            />
                            <p className="pl-1 pr-2 mt-1 font-bold text-white">
                              Mantle
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative flex items-center mt-4 lg:mt-0">
                    {/* notification button  */}
                    <button
                      onClick={() => SetShowNotifications(!showNotifications)}
                      className="hidden mx-4 text-gray-600 transition-colors duration-300 transform lg:block dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none"
                      aria-label="show notifications"
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {showNotifications && (
                      <div className="relative inline-block">
                        <div className="absolute right-0 z-20 w-64 mt-8 overflow-hidden origin-top-right bg-white rounded-md shadow-lg sm:w-80 dark:bg-gray-800">
                          {notificationData?.map((e, i) => {
                            return (
                              i < 6 &&
                              e.app === "Quicklance" && (
                                <div key={e.sid}>
                                  <a
                                    href={e.cta}
                                    rel="noreferrer"
                                    target="_blank"
                                    className="flex items-center px-4 py-3 -mx-2 transition-colors duration-300 transform border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700"
                                  >
                                    <Image
                                      className="flex-shrink-0 object-cover w-8 h-8 mx-1 rounded-full"
                                      src={e.image}
                                      alt="avatar"
                                      height={100}
                                      width={100}
                                    />
                                    <p className="mx-2 text-sm text-gray-600 dark:text-white flex flex-col">
                                      <a
                                        className="font-bold text-[12px]"
                                        href={e.cta}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {e.notification.title}
                                      </a>
                                      <span className="font-mono text-[10px]">
                                        {e.notification.body}
                                      </span>
                                    </p>
                                  </a>
                                </div>
                              )
                            );
                          })}
                          {notificationData.length === 0 && (
                            <div>
                              <a
                                href="#"
                                rel="noreferrer"
                                className="flex items-center px-4 py-3 -mx-2 transition-colors duration-300 transform border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700"
                              >
                                <p className="mx-2 text-sm text-gray-600 dark:text-white flex flex-col">
                                  <a
                                    className="font-bold text-[12px]"
                                    href="#"
                                    rel="noreferrer"
                                  >
                                    No Notifications
                                  </a>
                                </p>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* profile button  */}
                    <button
                      type="button"
                      className="flex items-center focus:outline-none"
                      aria-label="toggle profile dropdown"
                      onClick={() => SetShowProfile(!showProfile)}
                    >
                      <div className="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full object-cover">
                        {userInfo.image ?
                          <Image
                            src={userInfo.image.replace(
                              "ipfs://",
                              "https://gateway.ipfscdn.io/ipfs/"
                            )}
                            height={100}
                            width={100}
                            alt="avatar"
                            style={{
                              borderRadius: "50%",
                              width: "40px",
                              height: "33px",
                            }}
                          /> :
                          <Image
                            src={defaultAvatar}
                            height={100}
                            width={100}
                            alt="avatar"
                            style={{
                              borderRadius: "50%",
                              width: "40px",
                              height: "33px",
                            }}
                          />
                        }
                      </div>
                    </button>

                    {showProfile && (
                      <div className="absolute left-[-60px] top-11 w-56 py-2 mt-2 overflow-hidden origin-top-right bg-white rounded-md shadow-xl dark:bg-gray-800">
                        <a
                          href="#"
                          rel="noreferrer"
                          className="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          {userInfo.image ?
                            <Image
                              src={userInfo.image.replace(
                                "ipfs://",
                                "https://gateway.ipfscdn.io/ipfs/"
                              )}
                              height={80}
                              width={50}
                              alt="avatar"
                              style={{
                                borderRadius: "50%",
                                width: "40px",
                                height: "33px",
                              }}
                            />
                            :
                            <Image
                              src={defaultAvatar}
                              height={80}
                              width={50}
                              alt="avatar"
                              style={{
                                borderRadius: "50%",
                                width: "40px",
                                height: "33px",
                              }}
                            />
                          }
                          <div className="mx-1">
                            {/* <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{userData.username}</h1> */}
                            {userInfo.username}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {userAddress.slice(0, 5) +
                                "..." +
                                userAddress.slice(38)}
                            </p>
                          </div>
                        </a>

                        <hr className="border-gray-200 dark:border-gray-700 " />
                        {isRegistered && (
                          <Link
                            href={`/freelancers/${userAddress}`}
                            className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            <svg
                              className="w-5 h-5 mx-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M6.34315 16.3431C4.84285 17.8434 4 19.8783 4 22H6C6 20.4087 6.63214 18.8826 7.75736 17.7574C8.88258 16.6321 10.4087 16 12 16C13.5913 16 15.1174 16.6321 16.2426 17.7574C17.3679 18.8826 18 20.4087 18 22H20C20 19.8783 19.1571 17.8434 17.6569 16.3431C16.1566 14.8429 14.1217 14 12 14C9.87827 14 7.84344 14.8429 6.34315 16.3431Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                            <span className="mx-1">view profile</span>
                          </Link>
                        )}

                        <Link
                          href="/create/create-profile"
                          className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <svg
                            className="w-5 h-5 mx-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.8199 22H10.1799C9.71003 22 9.30347 21.673 9.20292 21.214L8.79592 19.33C8.25297 19.0921 7.73814 18.7946 7.26092 18.443L5.42392 19.028C4.97592 19.1709 4.48891 18.9823 4.25392 18.575L2.42992 15.424C2.19751 15.0165 2.27758 14.5025 2.62292 14.185L4.04792 12.885C3.98312 12.2961 3.98312 11.7019 4.04792 11.113L2.62292 9.816C2.27707 9.49837 2.19697 8.98372 2.42992 8.576L4.24992 5.423C4.48491 5.0157 4.97192 4.82714 5.41992 4.97L7.25692 5.555C7.50098 5.37416 7.75505 5.20722 8.01792 5.055C8.27026 4.91269 8.52995 4.78385 8.79592 4.669L9.20392 2.787C9.30399 2.32797 9.71011 2.00049 10.1799 2H13.8199C14.2897 2.00049 14.6958 2.32797 14.7959 2.787L15.2079 4.67C15.4887 4.79352 15.7622 4.93308 16.0269 5.088C16.2739 5.23081 16.5126 5.38739 16.7419 5.557L18.5799 4.972C19.0276 4.82967 19.514 5.01816 19.7489 5.425L21.5689 8.578C21.8013 8.98548 21.7213 9.49951 21.3759 9.817L19.9509 11.117C20.0157 11.7059 20.0157 12.3001 19.9509 12.889L21.3759 14.189C21.7213 14.5065 21.8013 15.0205 21.5689 15.428L19.7489 18.581C19.514 18.9878 19.0276 19.1763 18.5799 19.034L16.7419 18.449C16.5093 18.6203 16.2677 18.7789 16.0179 18.924C15.7557 19.0759 15.4853 19.2131 15.2079 19.335L14.7959 21.214C14.6954 21.6726 14.2894 21.9996 13.8199 22ZM7.61992 16.229L8.43992 16.829C8.62477 16.9652 8.81743 17.0904 9.01692 17.204C9.20462 17.3127 9.39788 17.4115 9.59592 17.5L10.5289 17.909L10.9859 20H13.0159L13.4729 17.908L14.4059 17.499C14.8132 17.3194 15.1998 17.0961 15.5589 16.833L16.3799 16.233L18.4209 16.883L19.4359 15.125L17.8529 13.682L17.9649 12.67C18.0141 12.2274 18.0141 11.7806 17.9649 11.338L17.8529 10.326L19.4369 8.88L18.4209 7.121L16.3799 7.771L15.5589 7.171C15.1997 6.90671 14.8132 6.68175 14.4059 6.5L13.4729 6.091L13.0159 4H10.9859L10.5269 6.092L9.59592 6.5C9.39772 6.58704 9.20444 6.68486 9.01692 6.793C8.81866 6.90633 8.62701 7.03086 8.44292 7.166L7.62192 7.766L5.58192 7.116L4.56492 8.88L6.14792 10.321L6.03592 11.334C5.98672 11.7766 5.98672 12.2234 6.03592 12.666L6.14792 13.678L4.56492 15.121L5.57992 16.879L7.61992 16.229ZM11.9959 16C9.78678 16 7.99592 14.2091 7.99592 12C7.99592 9.79086 9.78678 8 11.9959 8C14.2051 8 15.9959 9.79086 15.9959 12C15.9932 14.208 14.2039 15.9972 11.9959 16ZM11.9959 10C10.9033 10.0011 10.0138 10.8788 9.99815 11.9713C9.98249 13.0638 10.8465 13.9667 11.9386 13.9991C13.0307 14.0315 13.9468 13.1815 13.9959 12.09V12.49V12C13.9959 10.8954 13.1005 10 11.9959 10Z"
                              fill="currentColor"
                            ></path>
                          </svg>

                          <span className="mx-1">
                            {userInfo.username ? "Edit Profile" : "Create Profile"}
                          </span>
                        </Link>
                        {isRegistered && (
                          <Link
                            href="/create/create-project"
                            className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            <svg
                              className="w-5 h-5 mx-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 19H3C1.89543 19 1 18.1046 1 17V16H3V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V16H23V17C23 18.1046 22.1046 19 21 19ZM5 7V16H19V7H5Z"
                                fill="currentColor"
                              ></path>
                            </svg>

                            <span className="mx-1">Create Project</span>
                          </Link>
                        )}

                        {/* {isRegistered && (
                          <Link
                            href="/create/create-job"
                            className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            <svg
                              className="w-5 h-5 mx-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 19H3C1.89543 19 1 18.1046 1 17V16H3V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V16H23V17C23 18.1046 22.1046 19 21 19ZM5 7V16H19V7H5Z"
                                fill="currentColor"
                              ></path>
                            </svg>

                            <span className="mx-1">Create Job</span>
                          </Link>
                        )} */}

                        <hr className="border-gray-200 dark:border-gray-700 " />

                        {optedIn && isRegistered ? (
                          <Link
                            href="#"
                            className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            <svg
                              className="w-6 h-6"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="mx-1">
                              Opted For Notifications
                            </span>
                          </Link>
                        ) : (
                          <Link
                            onClick={() => optInToChannel()}
                            href="#"
                            className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            <svg
                              className="w-6 h-6"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="mx-1">Opt-in Notifications</span>
                          </Link>
                        )}
                        {isRegistered && (
                          <a
                            href="#"
                            rel="noreferrer"
                            className="flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            <svg
                              className="w-5 h-5 mx-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M19 21H10C8.89543 21 8 20.1046 8 19V15H10V19H19V5H10V9H8V5C8 3.89543 8.89543 3 10 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM12 16V13H3V11H12V8L17 12L12 16Z"
                                fill="currentColor"
                              ></path>
                            </svg>

                            <span className="mx-1">Sign Out</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center mt-4 lg:mt-0">
                  <button
                    onClick={connectToContract}
                    className="w-full px-5 py-2 mr-4 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                  >
                    Connect Wallet
                  </button>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
