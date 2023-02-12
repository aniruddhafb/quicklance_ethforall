import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import abi from "../../../../artifacts/contracts/Project.sol/Project.json";

const project = ({ userAddress, signer, provider }) => {
  const router = useRouter();

  const [isPropsalBox, setIsPropsalBox] = useState(false);
  const [isProjectApproved, setIsProjectApproved] = useState(false);
  const [proposal_provider, setProposalProivder] = useState();
  const [project_owner, setProjectOwner] = useState("");
  const [projectOverview, setProjectOverview] = useState({
    id: "",
    title: "",
    description: "",
    images: "",
    budget: "",
    time: "",
    deadLine: "",
    owner: "",
    project: "",
  });
  const [proposalData, setProposalData] = useState({
    title: "",
    description: "",
    amount: "",
    completion_date: "",
  });
  const [all_proposals, setAllProposals] = useState([]);

  const { address, projectId } = router.query;

  const fetch_project_info = async () => {
    const project_info = new ethers.Contract(address, abi.abi, signer);
    setProposalProivder(project_info);

    // Get Project owner
    const projectOwner = await project_info.projectOwner();
    setProjectOwner(projectOwner);
    // Checks if project is assigned to anyone
    const isProjectApproved = await project_info.isProjectApproved();
    setIsProjectApproved(isProjectApproved);
    console.log({ isProjectApproved });
    const proposals = await project_info.getProposals();
    setAllProposals(proposals);
  };

  const fetch_project_by_id = async () => {
    const project_overview = await provider.getProjectbyId(projectId);
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
    } = project_overview;

    setProjectOverview({
      id,
      title,
      description,
      images,
      budget,
      time,
      deadLine,
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
      proposalData.title,
      proposalData.description,
      ethers.utils.parseEther(proposalData.amount),
      date_of_completion
    );
    console.log(txn);
  };

  //Accept Proposal
  const accept_proposal = async (proposalId) => {
    const txn = await proposal_provider.approveProposal(proposalId);
  };

  useEffect(() => {
    if (signer && provider && address) {
      fetch_project_info();
      fetch_project_by_id();
    }
  }, [provider]);

  return (
    <>
      <section className="text-gray-400 bg-gray-900 body-font overflow-hidden relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                3293993
              </h2>
              <h1 className="text-white text-3xl title-font font-medium mb-4">
                {projectOverview.title}
              </h1>
              <div className="flex mb-4">
                <a className="flex-grow text-indigo-400 border-b-2 border-indigo-500 py-2 text-lg px-1">
                  Description
                </a>
                <a className="flex-grow border-b-2 border-gray-800 py-2 text-lg px-1">
                  Coatations
                </a>
                <a className="flex-grow border-b-2 border-gray-800 py-2 text-lg px-1">
                  Other Details
                </a>
              </div>
              <p className="leading-relaxed mb-4">
                {projectOverview.description}
              </p>
              <div className="flex border-t border-gray-800 py-2">
                <span className="text-gray-500">Budget</span>
                <span className="ml-auto text-white">
                  {projectOverview.budget.toString()}
                </span>
              </div>
              <div className="flex border-t border-gray-800 py-2">
                <span className="text-gray-500">Deadline</span>
                <span className="ml-auto text-white">
                  {projectOverview.deadLine.toString()}
                </span>
              </div>
              <div className="flex border-t border-b mb-6 border-gray-800 py-2">
                <span className="text-gray-500">Total Coatations</span>
                <span className="ml-auto text-white">20</span>
              </div>
              <div className="flex">
                {/* <span className="title-font font-medium text-2xl text-white">$58.00</span> */}
                <button
                  onClick={() => setIsPropsalBox(true)}
                  className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                >
                  Coat your proposal
                </button>
                <button className="rounded-full w-10 h-10 bg-gray-800 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                  <svg
                    fill="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src="https://dummyimage.com/400x400"
            />
          </div>
        </div>
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

              <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                <h3
                  className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white"
                  id="modal-title"
                >
                  Invite your team
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Your new project has been created. Invite your team to
                  collaborate on this project.
                </p>

                <form className="mt-4" action="#">
                  <label
                    for="emails-list"
                    className="text-sm text-gray-700 dark:text-gray-200"
                  >
                    Email address
                  </label>

                  <label className="block mt-3" for="email">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="user@email.xyz"
                      value="devdhaif@gmail.com"
                      className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                    />
                  </label>

                  <label className="block mt-3" for="email">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="user@email.xyz"
                      className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                    />
                  </label>

                  <label className="block mt-3" for="email">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="user@email.xyz"
                      className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                    />
                  </label>

                  <button
                    type="button"
                    className="mt-2 flex items-center rounded py-1.5 px-2 text-sm text-blue-600 transition-colors duration-300 hover:text-blue-400 focus:outline-none dark:text-blue-400 dark:hover:text-blue-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>

                    <span className="mx-2">Add another</span>
                  </button>

                  <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                    <button
                      onClick={() => setIsPropsalBox(false)}
                      type="button"
                      className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                    >
                      Send invites
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* main  */}
      <div>
        <img src={projectOverview.images} alt="" />
        <div>
          <h1>{projectOverview.title}</h1>
          <p>{projectOverview.description}</p>
        </div>

        <div>
          <h1>Proposals:</h1>
          <form onSubmit={handleSubmit}>
            <h1>Create Proposal</h1>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="title"
                name="title"
                onChange={onChangeProposal}
              />
              <input
                type="text"
                placeholder="description"
                name="description"
                onChange={onChangeProposal}
              />
              <input
                type="number"
                placeholder="amount"
                name="amount"
                step="any"
                onChange={onChangeProposal}
              />
              <input
                type="date"
                name="completion_date"
                id=""
                onChange={onChangeProposal}
              />
            </div>
            <button type="submit">create proposal</button>
          </form>
        </div>

        <div className="mt-10">
          All proposals:-
          {!isProjectApproved && (
            <div className="flex gap-10">
              {all_proposals.map((e) => {
                let date = new Date();
                let completionDate = date.toISOString(
                  e.time_of_completion.toString()
                );
                return (
                  <div key={e.id} className="gap-10">
                    <h1>{e.title}</h1>
                    <p>{e.description}</p>
                    <p>{completionDate}</p>
                    {project_owner === userAddress ? (
                      <button onClick={() => accept_proposal(e.id)}>
                        Accept proposal
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default project;
