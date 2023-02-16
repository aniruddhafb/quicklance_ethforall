import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import abi from "../../../../artifacts/contracts/Project.sol/Project.json";
import dayjs from "dayjs";
import Image from "next/image";
import * as PushAPI from "@pushprotocol/restapi";
import Link from "next/link";

const project = ({ userAddress, signer, provider, chainImg, blockURL }) => {
  const router = useRouter();
  const [isPropsalBox, setIsPropsalBox] = useState(false);
  const [isPropsalForOwner, setIsPropsalForOwner] = useState(false);
  const [isMarkedComplete, setIsMarkedComplete] = useState(false);
  const [proposalData, setProposalData] = useState({
    coatation: "",
    description: "",
    completion_date: "",
  });
  const [activeFreelancer, setActiveFreelancer] = useState("");
  const [project_owner, setProjectOwner] = useState("");
  const [project_status, setProject_status] = useState();
  const [projectData, setProjectData] = useState({
    id: "",
    title: "",
    short_description: "",
    description: "",
    pdf: "",
    images: "",
    budget: "",
    time: "",
    deadLine: "",
    owner: "",
    project: "",
  });

  const [projectInfo, setProjectInfo] = useState({
    isProjectApproved: undefined,
    proposal_provider: "",
    proposals: [],
  });

  const { address, projectId } = router.query;

  const fetch_project_info = async () => {
    const proposal_info = new ethers.Contract(address, abi.abi, signer);
    setProjectInfo({ ...projectInfo, proposal_provider: proposal_info });

    // Get Project owner
    const projectOwner = await proposal_info.projectOwner();
    setProjectOwner(projectOwner);

    //Checks the project status if project assigned or not
    const projectStatus = await proposal_info.getProjectStatus();
    setProject_status(projectStatus);

    // Checks if project is assigned to anyone
    const isProjectApproved = await proposal_info.isProjectApproved();
    setProjectInfo({ ...projectInfo, isProjectApproved: isProjectApproved });

    // Fetches All Proposals
    const proposals = await proposal_info.getProposals();
    setProjectInfo({ ...projectInfo, proposals: proposals });

    // getting active freelancer
    const approvedFreelancer = await proposal_info.approvedFreelancer();
    setActiveFreelancer(approvedFreelancer);
  };

  const fetch_project_by_id = async () => {
    const project_overview = await provider.getProjectbyId(projectId);

    const {
      id,
      title,
      short_description,
      description,
      pdf,
      images,
      budget,
      time,
      deadLine,
      owner,
      project,
    } = project_overview;

    const parsedBudget = ethers.utils.formatEther(budget.toString());
    const date = dayjs(parseInt(deadLine));
    const deadline_date = date.format("DD/MM/YYYY");

    setProjectData({
      id,
      title,
      short_description,
      description,
      pdf,
      images,
      budget: parsedBudget,
      time,
      deadLine: deadline_date,
      owner,
      project,
    });
  };

  const onChangeProposal = (e) => {
    setProposalData({ ...proposalData, [e.target.name]: e.target.value });
  };

  //Create Proposal
  const handleSubmit = async (e) => {
    e.preventDefault();

    const project_info = new ethers.Contract(address, abi.abi, signer);
    const date = new Date();
    const date_of_completion = date.getTime(proposalData.completion_date);
    const txn = await project_info.createProposal(
      proposalData.description,
      ethers.utils.parseEther(proposalData.coatation),
      date_of_completion
    );
    sendProposalNoti();
  };

  // sending notification
  const sendProposalNoti = async () => {
    const signer = new ethers.Wallet(
      "236f1df78499017b1e172e8a28c5636a8676bfec50f661ab2b741fedf2b1ac48"
    );
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3,
        identityType: 2,
        notification: {
          title: `You project recieved a coatation of ${proposalData.coatation}`,
          body: `Information from ${userAddress}`,
        },
        payload: {
          title: `You project recieved a coatation of ${proposalData.coatation}`,
          body: `Information from ${userAddress} : ${proposalData.description}`,
          cta: `${blockURL} ${address}`,
        },
        recipients: `eip155:5:${project_owner}`,
        channel: "eip155:5:0xe7ac0B19e48D5369db1d70e899A18063E1f19021",
        env: "staging",
      });
      // console.log('API response: ', apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  // sending notification
  const sendMarkedCompleteNoti = async () => {
    const signer = new ethers.Wallet(
      "236f1df78499017b1e172e8a28c5636a8676bfec50f661ab2b741fedf2b1ac48"
    );
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3,
        identityType: 2,
        notification: {
          title: `You project is completed`,
          body: `Your project ${address} is marked as completed from ${activeFreelancer}`,
        },
        payload: {
          title: `You project is completed`,
          body: `Your project ${address} is marked as completed from ${activeFreelancer}`,
          cta: `${blockURL} ${address}`,
        },
        recipients: `eip155:5:${project_owner}`,
        channel: "eip155:5:0xe7ac0B19e48D5369db1d70e899A18063E1f19021",
        env: "staging",
      });
      // console.log('API response: ', apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  // sending notification
  const sendFinalizedNoti = async () => {
    const signer = new ethers.Wallet(
      "236f1df78499017b1e172e8a28c5636a8676bfec50f661ab2b741fedf2b1ac48"
    );
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3,
        identityType: 2,
        notification: {
          title: `Congratulations! Your project is completed`,
          body: `You received a payment from ${project_owner} for compeleting ${address}`,
        },
        payload: {
          title: `Congratulations! Your project is completed`,
          body: `You received a payment from ${project_owner} for compeleting ${address}`,
          cta: `${blockURL} ${address}`,
        },
        recipients: `eip155:5:${activeFreelancer}`,
        channel: "eip155:5:0xe7ac0B19e48D5369db1d70e899A18063E1f19021",
        env: "staging",
      });
      // console.log('API response: ', apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  // sending notification
  const sendAcceptNoti = async () => {
    const signer = new ethers.Wallet(
      "236f1df78499017b1e172e8a28c5636a8676bfec50f661ab2b741fedf2b1ac48"
    );
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3,
        identityType: 2,
        notification: {
          title: `Congratulations! Your proposal is accepted`,
          body: `Your proposal for project : ${address} is accepted, you can start working asap`,
        },
        payload: {
          title: `Congratulations! Your proposal is accepted`,
          body: `Your proposal for project : ${address} is accepted, you can start working asap`,
          cta: `${blockURL} ${address}`,
        },
        recipients: `eip155:5:${activeFreelancer}`,
        channel: "eip155:5:0xe7ac0B19e48D5369db1d70e899A18063E1f19021",
        env: "staging",
      });
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  //Accept Proposal
  const accept_proposal = async (proposalId) => {
    const txn = await projectInfo.proposal_provider.approveProposal(proposalId);
    sendAcceptNoti();
  };

  const completeProject = async () => {
    const txn = await projectInfo.proposal_provider.markProjectAsComplete();
    sendMarkedCompleteNoti();
    // console.log(txn);
  };

  const finalizeProject = async () => {
    if (userAddress === project_owner) {
      const txn = await projectInfo.proposal_provider.finalizeProject();
      sendFinalizedNoti();
    } else {
      console.log("you cannot finalize this project");
    }
  };

  useEffect(() => {
    if (signer && provider && address) {
      fetch_project_info();
      fetch_project_by_id();
    }
  }, [userAddress, signer]);

  let ipfsURL = projectData.images;
  let ipfsNewURL = ipfsURL.replace(
    "ipfs://",
    "https://gateway.ipfscdn.io/ipfs/"
  );

  return (
    <>
      <section className="text-gray-400 bg-gray-900 body-font overflow-hidden relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <div className="inline-flex items-center gap-x-3">
                <Link href="#">
                  <div className="flex items-center gap-x-2">
                    <img
                      className="object-cover w-10 h-10 rounded-full"
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                      alt=""
                    />
                    <div>
                      <h2 className="font-medium text-gray-800 dark:text-white ">
                        shravan
                      </h2>
                      <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                        EMPLOYER
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
              <h1 className="text-white text-3xl title-font font-medium mb-2">
                {projectData.title}
              </h1>
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {projectData.short_description}
              </h2>
              <div className="flex mb-4">
                <a className="flex-grow text-indigo-400 border-b-2 border-indigo-500 py-2 text-lg px-1">
                  Project Information
                </a>
                {/* <a className="flex-grow border-b-2 border-gray-800 py-2 text-lg px-1">
                  Other Details
                </a> */}
              </div>
              <p className="leading-relaxed mb-4">{projectData.description}</p>
              <div className="flex border-t border-gray-800 py-2">
                <span className="text-gray-500">Project Status</span>
                <span className="ml-auto text-white">{project_status}</span>
              </div>
              <div className="flex border-t border-gray-800 py-2">
                <span className="text-gray-500">Budget</span>
                <span className="ml-auto text-white flex flex-row">
                  <p className="mr-1">{projectData.budget}</p>
                  <Image src={chainImg} height={20} width={25} />
                </span>
              </div>
              <div className="flex border-t border-gray-800 py-2">
                <span className="text-gray-500">Deadline</span>
                <span className="ml-auto text-white">
                  {projectData.deadLine.toString()}
                </span>
              </div>
              <div className="flex border-t border-gray-800 py-2">
                <span className="text-gray-500">On Chain</span>
                <span className="ml-auto text-white">
                  <a href={blockURL + address} target="_blank">
                    View Contract 🔗
                  </a>
                </span>
              </div>
              <div className="flex border-t border-b mb-6 border-gray-800 py-2">
                <span className="text-gray-500">Detailed Info</span>
                <span className="ml-auto text-white">
                  <a
                    href={projectData.pdf.replace(
                      "ipfs://",
                      "https://gateway.ipfscdn.io/ipfs/"
                    )}
                    target="_blank"
                  >
                    View PDF 📁
                  </a>
                </span>
              </div>
              <div className="flex">
                {/* <span className="title-font font-medium text-2xl text-white">$58.00</span> */}

                {/* when project status is open  */}
                {project_status === "Open" &&
                  (project_owner === userAddress ? (
                    <button
                      onClick={() => setIsPropsalForOwner(true)}
                      className="flex ml-auto text-white bg-gray-700 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                    >
                      Create a proposal 🔒
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsPropsalBox(true)}
                      className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                    >
                      Create a proposal
                    </button>
                  ))}

                {/* when project status is in progress  */}
                {project_status === "In Progress" &&
                  userAddress === project_owner &&
                  (project_status === "Marked As Complete" ? (
                    <button
                      className="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                      onClick={finalizeProject}
                    >
                      Finalize Project
                    </button>
                  ) : (
                    <button
                      className="flex ml-auto text-white bg-gray-700 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                      onClick={() => setIsMarkedComplete(true)}
                    >
                      Finalize Project 🔒
                    </button>
                  ))}
                {project_status === "In Progress" &&
                  userAddress === activeFreelancer && (
                    <button
                      onClick={completeProject}
                      className="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                    >
                      Complete Project
                    </button>
                  )}
                {project_status === "In Progress" &&
                  userAddress != activeFreelancer &&
                  userAddress != project_owner && (
                    <button className="flex ml-auto text-white bg-orange-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                      Project is occupied
                    </button>
                  )}

                {/* when project status is marked as coemplete to project owner  */}
                {project_status === "Marked As Complete" &&
                  userAddress === project_owner && (
                    <button
                      className="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                      onClick={finalizeProject}
                    >
                      Finalize Project
                    </button>
                  )}

                {/* when project status is marked as coemplete from freelancer */}
                {project_status === "Marked As Complete" &&
                  (userAddress === activeFreelancer ? (
                    <button className="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                      Marked As Completed
                    </button>
                  ) : (
                    userAddress != project_owner && (
                      <button className="flex ml-auto text-white bg-orange-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                        Project is occupied
                      </button>
                    )
                  ))}

                {/* when project status is compeleted  */}
                {project_status === "Completed" && (
                  <button className="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                    Project is completed
                  </button>
                )}

                <button className="rounded-full w-10 h-10 bg-gray-800 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <Image
              src={ipfsNewURL}
              height={100}
              width={100}
              class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            />
          </div>
        </div>

        {/* all proposals section */}
        <section className="container px-4 mx-auto mb-40">
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              All Proposals
            </h2>
            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
              {projectInfo.proposals.length}
            </span>
          </div>

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
                          <div className="flex items-center gap-x-3">
                            <span>Name</span>
                          </div>
                        </th>

                        <th
                          scope="col"
                          className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <button className="flex items-center gap-x-2">
                            <span>Status</span>
                            <svg
                              className="h-3"
                              viewBox="0 0 10 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.1"
                              />
                              <path
                                d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.1"
                              />
                              <path
                                d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.3"
                              />
                            </svg>
                          </button>
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <button className="flex items-center gap-x-2">
                            <span>Budget</span>
                          </button>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Description
                        </th>
                        {userAddress === project_owner && (
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                          >
                            Action
                          </th>
                        )}
                      </tr>
                    </thead>
                    {projectInfo.proposals.map((e) => {
                      let date = new Date();
                      let completionDate = date.toISOString(
                        e.time_of_completion.toString()
                      );
                      return (
                        <tbody
                          key={e.id}
                          className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900"
                        >
                          <tr>
                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                              <div className="inline-flex items-center gap-x-3">
                                <div className="flex items-center gap-x-2">
                                  <img
                                    className="object-cover w-10 h-10 rounded-full"
                                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                                    alt=""
                                  />
                                  <div>
                                    <h2 className="font-medium text-gray-800 dark:text-white ">
                                      shravan
                                    </h2>
                                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                      {e.owner.slice(0, 5) +
                                        "..." +
                                        e.owner.slice(38)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                              {project_status === "Open" && (
                                <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                                  <h2 className="text-sm font-normal text-orange-500">
                                    Pending
                                  </h2>
                                </div>
                              )}
                              {project_status === "In Progress" &&
                                (e.owner === activeFreelancer ? (
                                  <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                    <h2 className="text-sm font-normal text-emerald-500">
                                      Active
                                    </h2>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                    <h2 className="text-sm font-normal text-red-500">
                                      Rejected
                                    </h2>
                                  </div>
                                ))}
                              {project_status === "Marked As Complete" &&
                                (e.owner === activeFreelancer ? (
                                  <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                    <h2 className="text-sm font-normal text-emerald-500">
                                      Active
                                    </h2>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                    <h2 className="text-sm font-normal text-red-500">
                                      Rejected
                                    </h2>
                                  </div>
                                ))}
                              {project_status === "Completed" &&
                              e.owner === activeFreelancer ? (
                                <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                  <h2 className="text-sm font-normal text-emerald-500">
                                    Completed
                                  </h2>
                                </div>
                              ) : (
                                <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                  <h2 className="text-sm font-normal text-red-500">
                                    Rejected
                                  </h2>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowra flex flex-row mt-3">
                              <p className=" flex flex-row mr-1">
                                {ethers.utils.formatEther(
                                  e.asked_amount.toString()
                                )}{" "}
                              </p>
                              <Image src={chainImg} height={20} width={25} />
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                              {e.description}
                            </td>

                            {userAddress === project_owner && (
                              <td className="px-4 py-4 text-sm whitespace-nowrap">
                                <div className="flex items-center gap-x-2">
                                  {!e.isApproved &&
                                  userAddress === project_owner
                                    ? project_status === "Open" && (
                                        <button
                                          onClick={() => accept_proposal(e.id)}
                                        >
                                          <p className="px-3 py-1 text-xs text-blue-500 rounded-full dark:bg-gray-800 bg-blue-100/60">
                                            Accept
                                          </p>
                                        </button>
                                      )
                                    : project_status === "In Progress" &&
                                      project_status ===
                                        "Marked As Complete" && (
                                        <button>
                                          <p className="px-3 py-1 text-xs text-orange-500 rounded-full dark:bg-gray-800 bg-blue-100/60">
                                            Project Is Live
                                          </p>
                                        </button>
                                      )}

                                  {project_status === "Completed" && (
                                    <button>
                                      <p className="px-3 py-1 text-xs text-blue-500 rounded-full dark:bg-gray-800 bg-blue-100/60">
                                        Project Is Completed
                                      </p>
                                    </button>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        </tbody>
                      );
                    })}
                    {projectInfo.proposals.length === "0" && (
                      <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                        <tr>No proposals yet!</tr>
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* create proposal box */}
      {isPropsalBox && (
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
                <h3
                  className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white"
                  id="modal-title"
                >
                  Create a proposal
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Create a coat by adding your coatation, description and
                  deadline for the project
                </p>

                <form className="mt-4" action="#" onSubmit={handleSubmit}>
                  <label className="block mt-3" htmlFor="amount">
                    <input
                      step="any"
                      required
                      onChange={onChangeProposal}
                      type="number"
                      name="coatation"
                      id="coatation"
                      placeholder="enter your coatation"
                      className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
                    />
                  </label>

                  <label className="block mt-3" htmlFor="description">
                    <textarea
                      required
                      onChange={onChangeProposal}
                      maxLength={300}
                      name="description"
                      placeholder="Mention your tech stack and other requirements"
                      id="description"
                      cols="10"
                      rows="4"
                      className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
                    ></textarea>
                  </label>

                  <label className="block mt-3" htmlFor="completion_date">
                    <input
                      required
                      onChange={onChangeProposal}
                      type="date"
                      name="completion_date"
                      id="deadline"
                      placeholder="deadline"
                      className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-300"
                    />
                  </label>

                  <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                    <button
                      onClick={() => setIsPropsalBox(false)}
                      type="button"
                      className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-500 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                    >
                      Create Proposal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* create proposal box for owner */}
      {isPropsalForOwner && (
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
                <h3
                  className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white"
                  id="modal-title"
                >
                  Oops !!
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You are the owner of the project, you cannot create a proposal
                  for your own project
                </p>

                <form className="mt-4" action="#" onSubmit={handleSubmit}>
                  <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                    <button
                      onClick={() => setIsPropsalForOwner(false)}
                      type="button"
                      className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                    >
                      Ok
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* finalize box when project is not marked comeplete by freelancer */}
      {isMarkedComplete && (
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
                <h3
                  className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white"
                  id="modal-title"
                >
                  Oops !!
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Freelancer has not marked the project to completed from his
                  side
                </p>

                <form className="mt-4" action="#" onSubmit={handleSubmit}>
                  <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                    <button
                      onClick={() => setIsMarkedComplete(false)}
                      type="button"
                      className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                    >
                      Ok
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default project;
