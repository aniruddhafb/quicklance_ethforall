import { providers, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as PushAPI from "@pushprotocol/restapi";
import abi from "../../../artifacts/contracts/ProjectFactory.sol/ProjectFactory.json";
import { Chat, ITheme } from "@pushprotocol/uiweb";
import axios from "axios";
import Image from "next/image";
import { Framework } from "@superfluid-finance/sdk-core";
import { GraphQLClient, gql } from "graphql-request";
import { InputNumber } from "antd";
import polygonPng from "../../../public/images/polygon.png";
import { BsFillPeopleFill } from "react-icons/bs";
import Link from "next/link";
const userProfile = ({ userAddress, chainId, signer, currentContract }) => {
  const tokens = [
    {
      name: "fDAIx",
      symbol: "fDAIx",
      address: "0xf2d68898557ccb2cf4c10c3ef2b034b2a69dad00",
      icon:
        "https://raw.githubusercontent.com/superfluid-finance/assets/master/public//tokens/dai/icon.svg",
    },
  ];

  const router = useRouter();
  const { walletAddress } = router.query;
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [provider, setProvider] = useState(null);

  const [useStreamBox, setUseStreamBox] = useState(false);
  const [useDataStreamBox, setUseDataStreamBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [superfluidSdk, setSuperfluidSdk] = useState(null);

  const [my_projects, set_my_projects] = useState([]);

  const [followData, setFollowData] = useState({
    isFollowing: undefined,
    followers_length: 0,
  });

  const [userIncome, SetUserIncome] = useState();
  const [userStreamData, SetUserStreamData] = useState([]);
  const [streamInput, setStreamInput] = useState({
    token: tokens[0].address,
    flowRate: 0.1,
  });

  const theme = {
    btnColorPrimary: "#3e89e6",
    bgColorSecondary: "#3e89e6",
    moduleColor: "#f0f0f0",
  };

  const sendStreamNoti = async () => {
    const signer = new ethers.Wallet(`${process.env.NEXT_PUBLIC_PKEY}`);
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3,
        identityType: 2,
        notification: {
          title: `You got a stream from ${userAddress}`,
          body: `Congratulations for recieving a new support stream, note you will get the stream in fDAIx`,
        },
        payload: {
          title: `You got a stream from ${userAddress}`,
          body: `Congratulations for recieving a new support stream, note you will get the stream in fDAIx`,
          cta: ``,
        },
        recipients: `eip155:5:${data.wallet}`,
        channel: "eip155:5:0xe7ac0B19e48D5369db1d70e899A18063E1f19021",
        env: "staging",
      });
      // console.log('API response: ', apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const sendDeleteStreamNoti = async () => {
    const signer = new ethers.Wallet(`${process.env.NEXT_PUBLIC_PKEY}`);
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3,
        identityType: 2,
        notification: {
          title: `You stopped donation stream to ${data.wallet}`,
          body: `You have successfully stopped streaming fDAIx`,
        },
        payload: {
          title: `You stopped donation stream to ${data.wallet}`,
          body: `You have successfully stopped streaming fDAIx`,
          cta: ``,
        },
        recipients: `eip155:5:${userAddress}`,
        channel: "eip155:5:0xe7ac0B19e48D5369db1d70e899A18063E1f19021",
        env: "staging",
      });
      // console.log('API response: ', apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const switchEthereumChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
      router.reload();
      // setChainIdMain("5");
    } catch (error) {
      console.error(error);
    }
  };

  const connectSF = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    setProvider(provider);
  };

  const getFreelancerData = async () => {
    try {
      if (walletAddress) {
        const res = await axios({
          url: `${process.env.NEXT_PUBLIC_PROD_SERVER}/api/users/getUserByWalletAddress`,
          method: "POST",
          data: {
            wallet: walletAddress,
          },
        });
        if (res.status == 200) {
          setData({ ...res.data });
        }
      }
    } catch (error) {
      setError("Cannot Find This User");
    }
  };

  const followUser = async () => {
    setLoading(true);
    try {
      const res = await axios({
        url: `${process.env.NEXT_PUBLIC_PROD_SERVER}/api/users/toggleFollow`,
        method: "POST",
        data: {
          to_follow_wallet: walletAddress,
          user_wallet: userAddress,
        },
      });
      if (res.status == 200) {
        check_follow_status();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const check_follow_status = async () => {
    try {
      const res = await axios({
        url: `${process.env.NEXT_PUBLIC_PROD_SERVER}/api/users/get_follow_status`,
        method: "POST",
        data: {
          to_follow_wallet: walletAddress,
          user_wallet: userAddress,
        },
      });
      if (res.status == 200) {
        setFollowData({ ...res.data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProjectsByAddress = async () => {
    if (currentContract) {
      const ProjectFactoryContract = new ethers.Contract(
        currentContract,
        abi.abi,
        signer
      );
      const addr = await signer.getAddress();
      const projects = await ProjectFactoryContract.getProjectsByOwner();
      let project_arr = [];
      projects.map((e) => {
        e.owner == walletAddress && project_arr.push(e);
      });

      set_my_projects(project_arr);
    }
  };

  const calculateFlowRate = (amount) => {
    if (amount) {
      return (ethers.utils.formatEther(amount) * 60 * 60 * 24 * 30).toFixed(2);
    }
    return 0;
  };

  const calculateFlowRateInWeiPerSecond = (amount) => {
    const flowRateInWeiPerSecond = ethers.utils
      .parseEther(amount.toString())
      .div(2592000)
      .toString();
    return flowRateInWeiPerSecond;
  };

  const handleCreateStream = async ({
    token,
    sender = userAddress,
    receiver = data.wallet,
    flowRate,
  }) => {
    if (chainId != 5) {
      alert("To create a stream you need to switch to goerli chain");
      switchEthereumChain();
    }
    try {
      setLoading(true);
      const { chainId } = await provider.getNetwork();
      const sf = await Framework.create({
        chainId,
        provider,
      });
      setSuperfluidSdk(sf);
      const superToken = await superfluidSdk.loadSuperToken(token);
      const flowRateInWeiPerSecond = calculateFlowRateInWeiPerSecond(flowRate);
      // console.log("flowRateInWeiPerSecond: ", flowRateInWeiPerSecond);
      let flowOp = superToken.createFlow({
        sender,
        receiver,
        flowRate: flowRateInWeiPerSecond,
      });

      await flowOp.exec(provider.getSigner());
      sendStreamNoti();
      setTimeout(() => {
        alert(
          "Stream created successfully, Please reload after transaction gets completed"
        );
        setLoading(false);
        setUseStreamBox(false);
      }, 5000);
    } catch (err) {
      alert("Something went wrong! Please try again");
      setLoading(false);
    }
  };

  const handleDeleteStream = async () => {
    try {
      setLoading(true);
      const { chainId } = await provider.getNetwork();
      const sf = await Framework.create({
        chainId,
        provider,
      });
      setSuperfluidSdk(sf);
      const superToken = await superfluidSdk.loadSuperToken("fDAIx");
      let flowOp = superToken.deleteFlow({
        sender: userAddress,
        receiver: data.wallet,
      });

      await flowOp.exec(provider.getSigner());
      sendDeleteStreamNoti();
      setTimeout(() => {
        alert(
          "Stream deleted Successfully, Please reload after transaction gets completed"
        );
        setLoading(false);
      }, 5000);
    } catch (err) {
      setLoading(false);
      alert("Something went wrong! Please try again");
    }
  };

  const fetchStreams = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    setProvider(provider);
    const { chainId } = await provider.getNetwork();
    if (chainId == 5) {
      const sf = await Framework.create({
        chainId,
        provider,
      });
      const daix = await sf.loadSuperToken("fDAIx");

      // fetch transactions
      const res = await daix.getFlow({
        sender: userAddress,
        receiver: walletAddress,
        providerOrSigner: provider,
      });
      SetUserStreamData(res);

      // user income in dia
      let earningData = await daix.getAccountFlowInfo({
        account: walletAddress,
        providerOrSigner: provider,
      });
      SetUserIncome(earningData.flowRate);
    }

  };

  useEffect(() => {
    if (userAddress) {
      connectSF();
      getFreelancerData();
      check_follow_status();
      fetchStreams();
      fetchProjectsByAddress();
    }
  }, [userAddress, followData.isFollowing, currentContract]);
  return (
    <div className="min-h-[100vh] max-h-[100%] bg-[#111827] pt-6">
      <div className={`w-full h-10 ${error && "bg-red-500"}`}>{error}</div>
      <div className="p-16">
        <div className="p-8 shadow mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="grid grid-cols-4 text-center order-last md:order-first mt-20 md:mt-0">
              <div>
                <p className="font-bold text-gray-200 text-xl">
                  {followData.followers_length}
                </p>
                <p className="text-gray-400">Followers</p>
              </div>
              <div>
                <p className="font-bold text-gray-200 text-xl">0</p>
                <p className="text-gray-400"> Projects</p>
              </div>
              <div>
                <p className="font-bold text-gray-200 text-xl">0</p>
                <p className="text-gray-400">Penalties</p>
              </div>
              <div>
                <p className="font-bold text-gray-200 text-xl flex flex-row text-center justify-center align-middle">
                  {calculateFlowRate(userIncome)}{" "}
                  <Image
                    height={20}
                    width={20}
                    src={tokens[0].icon}
                    className="ml-2"
                  />
                </p>
                <p className="text-gray-400">Stream Income </p>
              </div>
            </div>
            <div className="relative">
              <div className="w-36 h-36 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                <Image
                  src={data.image?.replace(
                    "ipfs://",
                    "https://gateway.ipfscdn.io/ipfs/"
                  )}
                  height={100}
                  width={100}
                  alt="profileImage"
                  className="flex-shrink-0 object-cover w-36 h-36 rounded-full sm:mx-4 ring-4 ring-gray-300"
                />
              </div>
            </div>
            {userAddress !== walletAddress && (
              <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                <button
                  onClick={followUser}
                  className={`flex flex-row justify-center align-bottom pt-4 text-white py-2 px-4 uppercase rounded ${!followData.isFollowing ? "bg-blue-400" : "bg-red-400"
                    }  shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5`}
                >
                  {!followData.isFollowing ? "Follow" : "Unfollow"}
                  {loading &&
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>}

                </button>
                <button
                  onClick={() => setUseStreamBox(true)}
                  className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                >
                  Support Via Stream
                </button>
                {calculateFlowRate(userStreamData.flowRate) > 0 && (
                  <button className="text-white py-2 px-4 uppercase rounded shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 flex flex-row">
                    <Image
                      height={30}
                      width={30}
                      src={tokens[0].icon}
                      className="ml-2"
                      onClick={() => setUseDataStreamBox(!useDataStreamBox)}
                    />
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* streams  */}
          {useDataStreamBox && calculateFlowRate(userStreamData.flowRate) > 0 && (
            <section className="container px-4 mx-auto">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white mt-16 text-center">
                Your streams to {data.username}'s account
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 text-center">
                Your all live streaming tips to this freelancer (Currently we
                only support donation streams in fDAIx token)
              </p>

              <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              <button className="flex items-center gap-x-3 focus:outline-none">
                                <span>Sender</span>
                              </button>
                            </th>

                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Reciever
                            </th>

                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Amount (fDAIx)
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                          <tr>
                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                              <div>
                                <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                  {userAddress}
                                </p>
                                <h4 className="text-gray-700 dark:text-gray-200">
                                  (You)
                                </h4>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                              <div>
                                <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                  {walletAddress}
                                </p>
                                <h4 className="text-gray-700 dark:text-gray-200">
                                  ({data.username})
                                </h4>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                              <div>
                                <h4 className="text-gray-700 dark:text-gray-200">
                                  {calculateFlowRate(userStreamData.flowRate)}
                                </h4>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                              <div>
                                {loading ? (
                                  <button
                                    disabled
                                    className="flex flex-row justify-center w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-500 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                  >
                                    <span>Stopping </span>
                                    <svg
                                      aria-hidden="true"
                                      className="w-6 h-6 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                      viewBox="0 0 100 101"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                      />
                                    </svg>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleDeleteStream()}
                                    className="flex flex-row justify-center w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-500 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                  >
                                    Stop Streaming
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="mt-20 text-center border-b pb-12">
            <h1 className="text-4xl font-medium text-gray-200">
              {data.fullName},
              <span className="font-light text-gray-400">{data.age}</span>
            </h1>
            <p className="font-light text-gray-600 mt-3 text-[12px]">
              {data.wallet}
            </p>
            <div className="font-light text-gray-600 mt-3 flex flex-row justify-center align-middle">
              <a
                href={data.twitter}
                className="mx-2 text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 group-hover:text-white"
                aria-label="Github"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 fill-current"
                >
                  <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z" />
                </svg>
              </a>
              <a
                href={data.github}
                className="mx-2 text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 group-hover:text-white"
                aria-label="Github"
              >
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z"></path>
                </svg>
              </a>
            </div>
            <p className="mt-8 text-gray-500">{data.about}</p>
          </div>
          <div className="mt-6 flex flex-col justify-center">
            <button className="text-indigo-500 py-2 px-4  font-medium mt-4">
              Recent Projects
            </button>
            <div className="flex justify-center">
              {my_projects.map((e, index) => {
                return (
                  <div
                    key={index}
                    className="w-[300px] h-[100%] overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 relative m-5"
                  >
                    <div className="px-4 py-2">
                      <h1 className="text-xl font-bold text-gray-800 uppercase dark:text-white">
                        {e.title}
                      </h1>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {e.short_description}
                      </p>
                    </div>
                    <div className="flex flex-row px-4">
                      <h1 className="text-white">Budget - </h1>
                      <p className="ml-2 text-gray-300">
                        {ethers.utils.formatEther(e.budget)}
                      </p>
                      <Image
                        src={polygonPng}
                        className="ml-2"
                        width={25}
                        height={20}
                        alt="matic"
                      />
                    </div>

                    <div className="flex flex-row px-4">
                      <h1 className="text-white">Deadline - </h1>
                      <p className="ml-2 text-gray-300">{e.deadLine.toString()}</p>
                    </div>

                    <Image
                      className="object-cover w-full h-48 mt-2"
                      src={e.images.replace(
                        "ipfs://",
                        "https://gateway.ipfscdn.io/ipfs/"
                      )}
                      alt="NIKE AIR"
                      height={100}
                      width={100}
                    />

                    <div className="flex items-center justify-between px-4 py-2 bg-gray-600">
                      <div className="text-sm w-full font-bold text-white flex flex-col">
                        <p>Coatations</p>
                        <span className="flex flex-row align-middle text-center">
                          0 <BsFillPeopleFill className="mt-1 ml-2" />
                        </span>
                      </div>
                      <Link
                        href={`/projects/${e.id}/${e.project}`}
                        className="w-full ml-2"
                      >
                        <button className="px-2 py-1 text-xs font-semibold text-gray-900 uppercase transition-colors duration-300 transform bg-white rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none">
                          View Project
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
              {my_projects == "" &&
                <button className="text-white py-2 px-4  font-medium mt-4">
                  No Project History Found
                </button>
              }
            </div>

          </div>
        </div>

        {/* chat area  */}
        {userAddress !== walletAddress && (
          <div>
            {userAddress && (
              <Chat
                account={userAddress}
                supportAddress={data.wallet}
                apiKey={process.env.NEXT_PUBLIC_PUSH_API_KEY}
                env="staging"
                greetingMsg={`Myself ${data.fullName} and I am a freelancer on quicklance`}
                modalTitle={`chat with ${data.username}`}
                theme={theme}
              />
            )}
          </div>
        )}

        {/* send stream area  */}
        {useStreamBox && (
          <div>
            <div
              className="fixed inset-0 z-10 overflow-y-auto"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <span
                  className="hidden sm:inline-block sm:h-screen sm:align-middle"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                  {loading && (
                    <div className="w-full text-center text-green-500 font-bold mb-2">
                      Please wait while we process..
                    </div>
                  )}
                  <h3
                    className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white"
                    id="modal-title"
                  >
                    Create a monthly stream
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Support freelancers by sending a monthly stream/tip to them,
                    the fDAIx you allow will automatically flow from your wallet
                    to the freelancers wallet
                  </p>

                  <form className="mt-4" action="#">
                    <div className="flex flex-row">
                      <InputNumber
                        name="flowRate"
                        placeholder="Flow Rate"
                        value={streamInput?.flowRate || 0}
                        onChange={(val) =>
                          setStreamInput({ ...streamInput, flowRate: val })
                        }
                        style={{
                          borderRadius: 5,
                          marginBottom: 10,
                          width: "100%",
                          border: "1px solid gray",
                          padding: "4px 0",
                          color: "white",
                        }}
                        className="border-gray-100 dark:bg-gray-700 dark:text-gray-100 "
                      />
                    </div>

                    <label className="block mt-3" htmlFor="amount">
                      <select
                        name="token"
                        onChange={(val) =>
                          setStreamInput({ ...streamInput, token: val })
                        }
                        id="countries"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option defaultValue value={tokens[0].address}>
                          {" "}
                          {tokens[0].symbol}{" "}
                        </option>
                      </select>
                    </label>

                    <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                      <button
                        onClick={() => setUseStreamBox(false)}
                        type="button"
                        className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                      >
                        Cancel
                      </button>
                      {loading ? (
                        <button
                          disabled
                          className=" flex flex-row justify-center w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-500 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                        >
                          <span>Creating </span>
                          <svg
                            aria-hidden="true"
                            className="w-6 h-6 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCreateStream(streamInput)}
                          className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-500 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                        >
                          Create Stream
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default userProfile;
