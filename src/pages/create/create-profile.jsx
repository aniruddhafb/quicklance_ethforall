import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
const CreateProfile = ({ userAddress }) => {
  const router = useRouter();
  const [data, setData] = useState({
    _id: "",
    username: "",
    email: "",
    fullName: "",
    wallet: "",
    age: "",
    role: "freelancer",
    about: "",
    twitter: "",
    github: "",
    linkedin: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    const res = await axios({
      url: `http://localhost:3000/api/users/signup`,
      method: "post",
      data: { ...data },
    });

    console.log(res.data);
    if (res.status == 200) {
      localStorage.setItem("userInfo", res.data._id);
      router.replace("/");
    }
  };

  const updateUserData = async () => {
    try {
      const res = await axios({
        url: `http://localhost:3000/api/users/updateUserProfile`,
        method: "post",
        data: { ...data },
      });
      setSuccess("Profile Successfully Updated");
      setTimeout(() => {
        router.reload();
      }, [1000]);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      if (userAddress) {
        const res = await axios({
          url: "http://localhost:3000/api/users/getUserByWalletAddress",
          method: "POST",
          data: {
            wallet: userAddress,
          },
        });
        if (res.status == 200) {
          setData({ ...res.data });
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchUserData();
    setData({ ...data, wallet: userAddress });
  }, [userAddress]);

  return (
    <>
      {error && <div className="w-full bg-green-500 h-10">{error}</div>}
      {success && <div className="w-full bg-green-500 h-10">{success}</div>}
      <div className="h-[100vh] bg-[#111827] pt-6">
        <section className="bg-white dark:bg-gray-900">
          <div className="flex justify-center min-h-screen">
            <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
              <div className="w-full">
                <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                  Create your account
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Get started on quicklance by creating your account
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
                >
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      Username
                    </label>
                    <input
                      onChange={onChange}
                      value={data.username}
                      type="text"
                      name="username"
                      placeholder="@sonu"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      Full Name
                    </label>

                    <input
                      value={data.fullName}
                      onChange={onChange}
                      type="text"
                      name="fullName"
                      placeholder="Raju Babu"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      Email
                    </label>
                    <input
                      onChange={onChange}
                      value={data.email}
                      type="email"
                      name="email"
                      placeholder="Raju Babu"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      Age
                    </label>
                    <input
                      onChange={onChange}
                      value={data.age}
                      type="number"
                      name="age"
                      placeholder="21"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      Who are you ?
                    </label>
                    <select
                      onChange={onChange}
                      defaultValue={data.role}
                      className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      name="role"
                      id="identity"
                    >
                      <option
                        selected={data.role == "freelancer"}
                        value="freelancer"
                      >
                        Freelancer
                      </option>
                      <option
                        selected={data.role == "employer"}
                        value="employer"
                      >
                        Employer
                      </option>
                      <option selected={data.role == "company"} value="company">
                        Company
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      About You
                    </label>
                    <textarea
                      value={data.about}
                      onChange={onChange}
                      name="about"
                      cols="20"
                      rows="1"
                      placeholder="Write a few lines about you"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      Twitter URL
                    </label>
                    <input
                      value={data.twitter}
                      onChange={onChange}
                      name="twitter"
                      type="text"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      Github URL
                    </label>
                    <input
                      value={data.github}
                      onChange={onChange}
                      name="github"
                      type="text"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      Linkedin URL
                    </label>
                    <input
                      value={data.linkedin}
                      onChange={onChange}
                      name="linkedin"
                      type="text"
                      className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>
                  {!data.username ? (
                    <button
                      type="submit"
                      className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    >
                      <span>Create Profile </span>

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
                  ) : (
                    <button
                      type="button"
                      onClick={updateUserData}
                      className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    >
                      <span>Update Profile </span>

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
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CreateProfile;
