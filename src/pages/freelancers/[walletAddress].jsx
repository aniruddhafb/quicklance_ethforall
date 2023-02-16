import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as PushAPI from "@pushprotocol/restapi";
import abi from "../../../artifacts/contracts/ProjectFactory.sol/ProjectFactory.json";
import { Chat, ITheme } from "@pushprotocol/uiweb";
import axios from "axios";
import Image from "next/image";

const userProfile = ({ userAddress, provider }) => {
  const theme = {
    btnColorPrimary: "#3e89e6",
    bgColorSecondary: "#3e89e6",
    moduleColor: "#f0f0f0",
  };

  const router = useRouter();
  const { walletAddress } = router.query;
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [followData, setFollowData] = useState({
    isFollowing: undefined,
    followers_length: 0,
  });

  const getFreelancerData = async () => {
    try {
      if (walletAddress) {
        const res = await axios({
          url: "http://localhost:3000/api/users/getUserByWalletAddress",
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
    try {
      const res = await axios({
        url: "http://localhost:3000/api/users/toggleFollow",
        method: "POST",
        data: {
          to_follow_wallet: walletAddress,
          user_wallet: userAddress,
        },
      });
      if (res.status == 200) {
        check_follow_status();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const check_follow_status = async () => {
    try {
      const res = await axios({
        url: "http://localhost:3000/api/users/get_follow_status",
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
    const txn = await provider.getProjectsByOwner();
    await txn.wait();

    console.log({ txn });
  };

  useEffect(() => {
    if (userAddress) {
      getFreelancerData();
      check_follow_status();
      // fetchProjectsByAddress();
    }
  }, [userAddress, followData.isFollowing]);
  return (
    <div className="h-[100vh] bg-[#111827] pt-6">
      <div className={`w-full h-10 ${error && "bg-red-500"}`}>{error}</div>
      <div className="p-16">
        <div className="p-8 shadow mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
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
                  className="flex-shrink-0 object-cover w-36 h-36 rounded-full sm:mx-4 ring-4 ring-gray-300"
                />
              </div>
            </div>
            {userAddress !== walletAddress && (
              <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                <button
                  onClick={followUser}
                  className={`text-white py-2 px-4 uppercase rounded ${!followData.isFollowing ? "bg-blue-400" : "bg-red-400"
                    }  shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5`}
                >
                  {!followData.isFollowing ? "Follow" : "Unfollow"}
                </button>
                <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                  Tip Freelancer
                </button>
              </div>
            )}
          </div>
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
          <div className="mt-12 flex flex-col justify-center">
            <button className="text-indigo-500 py-2 px-4  font-medium mt-4">
              No Project History Found
            </button>
          </div>
        </div>
        <div>
          {userAddress && (
            <Chat
              account={userAddress}
              supportAddress={data.wallet}
              apiKey={process.env.PUSH_API_KEY}
              env="staging"
              greetingMsg={`Myself ${data.fullName} and I am a freelancer on quicklance`}
              modalTitle={`chat with ${data.username}`}
              theme={theme}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default userProfile;
