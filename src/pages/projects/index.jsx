import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import Link from "next/link";
import testImg from "../../../public/images/fil.png";
import { BsFillPeopleFill } from "react-icons/bs";
import polygonPng from "../../../public/images/polygon.png";

const projects = ({ provider }) => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    if (!provider) return;
    const projects = await provider.getAllProjects();
    console.log(projects);
    const date = new Date();
    let projectData = [];
    projects.map((e) => {
      const {
        id,
        title,
        description,
        images,
        budget,
        time,
        deadLine,
        owner,
        project,
      } = e;

      projectData.push({
        id,
        title,
        description,
        budget,
        deadLine: deadLine,
        images,
        time: date.toLocaleDateString(time),
        owner,
        project,
      });
    });
    setProjects(projectData);
  };

  useEffect(() => {
    fetchProjects();
  }, [provider]);

  return (
    <div className="h-[100vh] bg-[#111827] pt-6">
      {/* <div className="flex m-10 gap-10 h-auto">
        {projects.map((e) => (
          <div className="project_card p-2 bg-red-400 w-48 rounded-md h-56 flex flex-col justify-between">Link
            <img src={e.images} className="h-12" />
            <div>
              <div>{e.title}</div>
              <div>{e.description}</div>
              <div className="flex">Deadline: {e.deadLine.toString()}</div>
              <div className="flex">
                Budget: {ethers.utils.formatEther(e.budget)} Matic
              </div>
            </div>
            <Link href={`/projects/${e.project}`} className="w-full">
              <button className="bg-green-500 rounded-md w-full">Click</button>
            </Link>
          </div>
        ))}
      </div> */}
      <div>
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
          Available <span className="text-blue-500">Projects</span>
        </h1>

        <p className="max-w-2xl mx-auto my-6 text-center text-gray-500 dark:text-gray-300">
          Find the best projects which match your profile
        </p>
      </div>
      <div className="flex flex-wrap m-10 gap-10 h-auto justify-center">
        {projects.map((e) => (
          <div class="w-[300px] overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 relative">
            <div class="px-4 py-2">
              <h1 class="text-xl font-bold text-gray-800 uppercase dark:text-white">
                {e.title}
              </h1>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {e.description}
              </p>
            </div>
            <div class="flex flex-row px-4">
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

            <div class="flex flex-row px-4">
              <h1 className="text-white">Deadline - </h1>
              <p className="ml-2 text-gray-300">{e.deadLine.toString()}</p>
            </div>

            <Image
              class="object-cover w-full h-48 mt-2"
              src={testImg}
              alt="NIKE AIR"
            />

            <div class="flex items-center justify-between px-4 py-2 bg-gray-600">
              <div class="text-sm w-full font-bold text-white flex flex-col">
                <p>Coatations</p>
                <span className="flex flex-row align-middle text-center">
                  20 <BsFillPeopleFill className="mt-1 ml-2" />
                </span>
              </div>
              <Link
                href={`/projects/${e.id}/${e.project}`}
                className="w-full ml-2"
              >
                <button class="px-2 py-1 text-xs font-semibold text-gray-900 uppercase transition-colors duration-300 transform bg-white rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none">
                  View Project
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default projects;
