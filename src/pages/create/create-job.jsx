import React, { useState } from "react";
import { ethers } from "ethers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { useRouter } from "next/router";
const createJob = ({ provider }) => {
  const [data, setData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    images: [],
  });
  const storage = new ThirdwebStorage();
  const [message, setMessage] = useState({ type: "", message: "" });
  const router = useRouter();

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      setTimeout(() => {
        setMessage(
          "Project Successfully Created, redirecting to projects page"
        );
        router.push("/projects");
      }, 1000);
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <>
      {message && (
        <div
          className={`w-full h-10 ${
            message.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {message.message}
        </div>
      )}
      <div className="h-[100vh] bg-[#111827] pt-6">
        <section className="max-w-4xl p-6 mx-auto my-20 rounded-md shadow-md dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
            Create Job
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="username"
                >
                  Job Role *
                </label>
                <input
                  onChange={onChange}
                  name="title"
                  id="title"
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  placeholder="Project Title"
                  required
                />
              </div>

              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="username"
                >
                  Job Location *
                </label>
                <input
                  onChange={onChange}
                  name="title"
                  id="title"
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  placeholder="Project Title"
                  required
                />
              </div>

              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="username"
                >
                  Job Type *
                </label>
                <input
                  onChange={onChange}
                  name="title"
                  id="title"
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  placeholder="Full time / part time"
                  required
                />
              </div>

              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="shortDesc"
                >
                  Job Short Description *
                </label>
                <input
                  onChange={onChange}
                  name="description"
                  id="description"
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  required
                />
              </div>

              <div>
                <label
                  className="text-gray-700 dark:text-gray-200"
                  htmlFor="longDesc"
                >
                  Job Long Description *
                </label>
                <textarea
                  onChange={onChange}
                  name="longDesc"
                  id="description"
                  type="text"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  placeholder="Explain in detail what are the requirements and skills required for the job, what will be the pay, etc "
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
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
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
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
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
                  // onChange={(e) => setData({ ...data, images: e.target.files[0] })}
                  id="pdf"
                  name="pdf"
                  type="file"
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
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
                onChange={(e) =>
                  setData({ ...data, images: e.target.files[0] })
                }
                id="images"
                name="images"
                type="file"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              >
                Post a job
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default createJob;
