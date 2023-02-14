import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { useRouter } from "next/router";
const createProject = ({ provider, userId }) => {
  const router = useRouter();
  const [data, setData] = useState({
    title: "",
    short_desc: "",
    description: "",
    budget: "",
    deadline: "",
    pdf: "",
    image: [],
  });
  const storage = new ThirdwebStorage();

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Please Create Your Profile First");
      router.push("/create/create-profile");
      return;
    }
    if (
      !data.title &&
      !data.description &&
      !data.budget &&
      !data.deadline &&
      !data.image
    )
      return alert("Please Fill Out The Complete Form");
    let date = new Date();
    let deadline_date = date.getTime(data.budget);

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
    console.log(txn);
  };

  useEffect(() => {
    console.log({ userId });
    if (!userId) {
      router.push("/create/create-profile");
      return;
    }
  }, []);

  return (
    <div className="h-[100vh] bg-[#111827] pt-6">
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
                name="title"
                id="title"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-[#111827] dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                placeholder="Project Title"
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
                name="short_desc"
                id="description"
                type="text"
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
                id="budget"
                type="text"
                name="budget"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-[#111827] dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                placeholder="Maximum Budget"
                required
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
            {/* <button
              type="submit"
              className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            >
              Create Project
            </button> */}
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
          </div>
        </form>
      </section>
    </div>
  );
};

export default createProject;
