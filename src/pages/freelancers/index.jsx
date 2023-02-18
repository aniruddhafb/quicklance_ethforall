import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
const freelancers = ({ userAddress }) => {
  const [data, setData] = useState([]);
  const fetchFreelancers = async () => {
    const res = await axios({
      url: `${process.env.NEXT_PUBLIC_PROD_SERVER}/api/freelancers/getAllfreelancers`,
      method: "GET",
    });
    setData(res.data);
  };

  useEffect(() => {
    fetchFreelancers();
  }, [userAddress]);
  return (
    <div className="min-h-[100vh] max-h-[100%] bg-[#111827] pt-6">
      <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-10 mx-auto">
          <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
            Hire <span className="text-blue-500">Freelancers</span>
          </h1>

          <p className="max-w-2xl mx-auto my-6 text-center text-gray-500 dark:text-gray-300">
            Hire the people who are best for your jobs
          </p>

          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-4">
            {data.map((e) => {
              return (
                e.wallet !== userAddress && (
                  <div className="px-12 py-8 transition-colors duration-300 transform border cursor-pointer rounded-xl hover:border-transparent group dark:border-gray-700 dark:hover:border-blue-700">
                    <div className="flex flex-col sm:-mx-4 sm:flex-row">
                      <Image src={e.image?.replace(
                        "ipfs://",
                        "https://gateway.ipfscdn.io/ipfs/"
                      )} height={100} width={100} className="flex-shrink-0 object-cover w-24 h-24 rounded-full sm:mx-4 ring-4 ring-gray-300" alt="ipfs" />

                      <div className="mt-4 sm:mx-4 sm:mt-0">
                        <h1 className="text-xl font-semibold text-gray-700 capitalize md:text-2xl dark:text-white group-hover:text-white">
                          {e.username}
                        </h1>

                        <p className="mt-2 text-gray-500 capitalize dark:text-gray-300 group-hover:text-gray-300">
                          {e.role}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-gray-500 capitalize dark:text-gray-300 group-hover:text-gray-300">
                      {e.about}
                    </p>
                    <div className="flex mt-4 -mx-2">
                      <a
                        href={e.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="mx-2 text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 group-hover:text-white"
                        aria-label="Github"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 fill-current"
                        >
                          <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z" />
                        </svg>
                      </a>
                      <a
                        href={e.github}
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
                      <Link href={`/freelancers/${e.wallet}`}>
                        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-6 border-b-4 border-blue-700 hover:border-blue-500 rounded ml-7 text-sm">
                          View Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default freelancers;
