import React, { useState } from "react";
import { ethers } from "ethers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

const createProject = ({ provider }) => {
  const [data, setData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    images: [],
  });
  const storage = new ThirdwebStorage();

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !data.title &&
      !data.description &&
      !data.budget &&
      !data.deadline &&
      !data.images
    )
      return alert("Please Fill Out The Complete Form");
    let date = new Date();
    let deadline_date = date.getTime(data.budget);

    const ipfs_image = storage.upload(data.images);

    const txn = await provider.createProject(
      data.title,
      data.description,
      ipfs_image,
      ethers.utils.parseEther(data.budget),
      deadline_date,
      {
        value: ethers.utils.parseEther(data.budget),
      }
    );

    console.log(txn);
  };

  return (
    <section className="max-w-4xl p-6 mx-auto my-20 bg-white rounded-md shadow-md dark:bg-gray-800">
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
              Enter Project Title
            </label>
            <input
              onChange={onChange}
              name="title"
              id="title"
              type="text"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="emailAddress"
            >
              Enter Your Project Description
            </label>
            <textarea
              onChange={onChange}
              name="description"
              id="description"
              type="text"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="budget"
            >
              Enter Budget
            </label>
            <input
              onChange={onChange}
              id="budget"
              type="text"
              name="budget"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="passwordConfirmation"
            >
              Project Deadline
            </label>
            <input
              onChange={onChange}
              id="deadline"
              type="date"
              name="deadline"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>
        </div>
        <div>
          <label
            className="text-gray-700 dark:text-gray-200 "
            htmlFor="passwordConfirmation"
          >
            Project Reference Images
          </label>
          <input
            onChange={(e) => setData({ ...data, images: e.target.files[0] })}
            id="images"
            name="images"
            type="file"
            multiple
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
};

export default createProject;
