import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import Link from "next/link";
const projects = ({ provider }) => {
  const [projects, setProjects] = useState([]);
  const fetchProjects = async () => {
    if (!provider) return;
    const projects = await provider.getAllProjects();
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
        deadLine: date.toLocaleDateString(deadLine),
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
    <div>
      <div className="flex m-10 gap-10 h-auto">
        {projects.map((e) => (
          <div className="project_card p-2 bg-red-400 w-48 rounded-md h-56 flex flex-col justify-between">
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
      </div>
    </div>
  );
};

export default projects;
