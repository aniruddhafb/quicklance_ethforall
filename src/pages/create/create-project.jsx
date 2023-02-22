import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { useRouter } from "next/router";
import axios from "axios";
import dayjs from "dayjs";
const createProject = ({ provider, userAddress }) => {
  const Router = useRouter();
  const [data, setData] = useState({
    title: "",
    short_desc: "",
    description: "",
    budget: "",
    deadline: "",
    pdf: "",
    image: [],
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const storage = new ThirdwebStorage();

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (
        !data.title &&
        !data.description &&
        !data.budget &&
        !data.deadline &&
        !data.image
      )
        return alert("Please Fill Out The Complete Form");

      let date = new Date();
      let deadline_date = dayjs(data.deadline).unix();

      const ipfs_pdf = storage.upload(data.pdf);
      const ipfs_image = storage.upload(data.image);
      const ipfs_url = await Promise.all([ipfs_pdf, ipfs_image]);

      const budget = ethers.utils.parseEther(data.budget).toString();

      const txn = await provider.createProject(
        data.title,
        data.short_desc,
        data.description,
        ipfs_url[0],
        ipfs_url[1],
        budget,
        deadline_date,
        {
          value: budget,
        }
      );

      await txn.wait();
      setTimeout(() => {
        setMessage(
          "Project Successfully Created, redirecting to projects page"
        );
        Router.push("/projects");
      }, 2000);
    } catch (error) {
      setMessage({ type: "error", message: "Something went wrong" });
    }
    setLoading(false);
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
        if (res.status == 200) {
          setIsRegistered(true);
        }
      }
    } catch (error) {
      setIsRegistered(false);
      alert("Please Create Your Account");
      Router.push("/create/create-profile");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userAddress]);

  return (
    <>
      {message.message && (
        <div
          className={`w-full h-10 text-center text-white font-bold pt-2 ${message.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
        >
          {message.message}
        </div>
      )}
      {loading && (
        <div className="w-full bg-green-500 h-10 text-center text-white font-bold pt-2">
          Please wait while we process..
        </div>
      )}
      <div className="min-h-[100vh] max-h-[100%] bg-[#111827] pt-6">
        <section className="max-w-4xl p-6 mx-auto my-20 rounded-md shadow-md ">
          <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
            Create Project
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="username"
                >
                  Title *
                </label>
                <input
                  onChange={onChange}
                  maxLength={100}
                  name="title"
                  id="title"
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-[#111827] dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  placeholder="One Liner Title Recommended"
                  required
                />
              </div>

              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="shortDesc"
                >
                  Project Short Description *
                </label>
                <input
                  onChange={onChange}
                  maxLength={500}
                  name="short_desc"
                  id="description"
                  type="text"
                  placeholder="Explain what you want from the freelancer in short"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-[#111827] dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  required
                />
              </div>

              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="longDesc"
                >
                  Project Detailed Description *
                </label>
                <textarea
                  onChange={onChange}
                  maxLength={1200}
                  name="description"
                  id="description"
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-[#111827] dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  placeholder="Explain your project requirements, tech stack, instructions, etc in detail"
                  required
                />
              </div>

              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="budget"
                >
                  Enter Budget *
                </label>
                <input
                  onChange={onChange}
                  maxLength={10}
                  id="budget"
                  type="number"
                  name="budget"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-[#111827] dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  placeholder="eg - 0.1, 0.05"
                  required
                  step="any"
                />
              </div>

              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="passwordConfirmation"
                >
                  Project Deadline *
                </label>
                <input
                  onChange={onChange}
                  id="deadline"
                  type="date"
                  name="deadline"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-[#111827] dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  required
                />
              </div>
              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="passwordConfirmation"
                >
                  Upload Reference PDF *
                </label>
                <input
                  onChange={(e) => setData({ ...data, pdf: e.target.files[0] })}
                  id="pdf"
                  name="pdf"
                  type="file"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-[#111827] dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="text-gray-700 dark:text-gray-200 "
                htmlFor="passwordConfirmation"
              >
                Upload Cover Image*
              </label>
              <input
                onChange={(e) => setData({ ...data, image: e.target.files[0] })}
                id="images"
                name="image"
                type="file"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-[#111827] dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>

            <div className="flex justify-end mt-6">
              {loading ? (
                <button
                  disabled
                  className="flex items-center justify-between px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  <span>Creating Project </span>

                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  type="submit"
                  className="flex items-center justify-between px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  <span>Create Project </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 rtl:-scale-x-100"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default createProject;
