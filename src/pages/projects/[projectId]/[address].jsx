import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import abi from "../../../../artifacts/contracts/Project.sol/Project.json";

const project = ({ userAddress, signer, provider }) => {
  const router = useRouter();

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
    const projectOwner = await project_info.projectOwner();
    setProjectOwner(projectOwner);
    const isProjectApproved = await project_info.isProjectApproved();
    setIsProjectApproved(isProjectApproved);
    const proposals = await project_info.getProposals();
    console.log(proposals);
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
  );
};

export default project;
