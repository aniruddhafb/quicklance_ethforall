// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/utils/Counters.sol";

contract Project {
    using Counters for Counters.Counter;
    Counters.Counter private proposalId;

    address payable public projectOwner;
    uint256 projectDeadline;
    uint256 projectBudget;
    bool private isProjectCompleted = false;

    enum project_status{
        open,
        in_progress,
        marked_as_complete,
        completed
    }

    project_status public currentProjectStatus;

    constructor(
        address payable _projectOwner,
        uint256 _projectDeadline,
        uint256 _projectBudget
    ) {
        projectOwner = _projectOwner;
        projectDeadline = _projectDeadline;
        projectBudget = _projectBudget;
        currentProjectStatus = project_status.open;
    }

    struct Proposal {
        uint256 id;
        string description;
        address payable owner;
        uint256 asked_amount;
        uint256 time_of_completion;
        bool isApproved;
        uint256 approvalDate;
        bool isCompleted;
        bool isFinalized;
    }

    event ProposalCreated(
        uint256 id,
        string description,
        address payable owner,
        uint256 asked_amount,
        uint256 time_of_completion,
        bool isApproved,
        uint256 approvalDate,
        bool isCompleted,
        bool isFinalized
    );

    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool) private hasCreatedProposal;
    mapping(address => bool) private markAsComplete;
    mapping(address => bool) private is_freelancer_occupied;
    bool public isProjectApproved = false;
    Proposal public selectedProposal;

    modifier onlyOwner() {
        require(
            msg.sender == projectOwner,
            "Only Project Owner Can Call This Function"
        );
        _;
    }

    //Implemented
    function createProposal(
        string memory _description,
        uint256 _amount,
        uint256 _time_of_completion
    ) public {
        // require(block.timestamp > projectDeadline, "This Project Is Already Completed You Cannot Create Proposals For This Project");
        require(
            !hasCreatedProposal[msg.sender],
            "You have already created a proposal for this project"
        );
        require(
            !is_freelancer_occupied[msg.sender],
            "Please first complete your previous projects"
        );
        require(currentProjectStatus != project_status.in_progress, "This project is already under progress");
        uint256 _proposalId = proposalId.current();
        Proposal memory newProposal = Proposal(
            _proposalId,
            _description,
            payable(msg.sender),
            _amount,
            _time_of_completion,
            false,
            0,
            false,
            false
        );
        hasCreatedProposal[msg.sender] = true;
        proposals[_proposalId] = newProposal;
        proposalId.increment();
        emit ProposalCreated(
            _proposalId,
            _description,
            payable(msg.sender),
            _amount,
            _time_of_completion,
            false,
            0,
            false,
            false
        );
    }

    //Implemented
    function approveProposal(uint256 _proposaId) public onlyOwner {
        Proposal storage proposal = proposals[_proposaId];
        require(
            currentProjectStatus != project_status.in_progress,
            "This Project Is Already Approved To Someone else"
        );
        require(
            msg.sender == projectOwner,
            "Only Project Owner Can Aprove The Proposals"
        );
        require(
            block.timestamp < projectDeadline,
            "This Project Is Already Completed You Cannot Make Anymore Approvals"
        );
        proposal.approvalDate = block.timestamp;
        proposal.isApproved = true;
        selectedProposal = proposal;
        is_freelancer_occupied[msg.sender] = true;
        currentProjectStatus = project_status.in_progress;
    }


    function markProjectAsComplete() public {
        require(
            currentProjectStatus == project_status.in_progress,
            "Your coatation is not yet approved"
        );
        require(currentProjectStatus != project_status.completed , "This Project Is Already Completed");
        require(
            msg.sender == selectedProposal.owner,
            "Only proposal owner can mark project as complete"
        );
        // require(block.timestamp < proposal.time_of_completion, "You Cannot Complete This Project, You Have Crossed The Deadline");
        require(
            currentProjectStatus != project_status.marked_as_complete,
            "You have already marked this project as complete"
        );

        currentProjectStatus = project_status.marked_as_complete;
    }

    function finalizeProject() public {
        require(currentProjectStatus != project_status.completed, "This Project Is Already Completed");
        require(
            msg.sender == projectOwner,
            "You Are Not Authorized To Finalize This Project"
        );
        require(
            currentProjectStatus == project_status.marked_as_complete,
            "Project is not yet completed"
        );
        require(
            currentProjectStatus == project_status.in_progress,
            "This Project Is Not Yet Approved"
        );

        uint256 refundAmount = projectBudget - selectedProposal.asked_amount;
        payable(projectOwner).transfer(refundAmount);
        payable(selectedProposal.owner).transfer(selectedProposal.asked_amount);
        selectedProposal.isFinalized = true;
        is_freelancer_occupied[selectedProposal.owner] = false;
        currentProjectStatus = project_status.completed;
    }

    // function getProjectStatus() public view returns (bool) {
    //     return markAsComplete[selectedProposal.owner];
    // }

    //Implemented
    function getProposals() public view returns (Proposal[] memory) {
        uint256 currentProposalCount = proposalId.current();
        Proposal[] memory allProposals = new Proposal[](currentProposalCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < currentProposalCount; i++) {
            Proposal memory currentProposal = proposals[i];
            allProposals[currentIndex] = currentProposal;
            currentIndex++;
        }
        return allProposals;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getProjectStatus() public view returns(string memory){
        if(currentProjectStatus == project_status.open) return "Open";
        if(currentProjectStatus == project_status.in_progress) return "In Progress";
        if(currentProjectStatus == project_status.marked_as_complete) return "Marked As Complete";
        if(currentProjectStatus == project_status.completed) return "Completed";
    }
    
    function getSelectedProposal() public view returns (Proposal memory) {
        require(
            msg.sender == projectOwner,
            "Only Project owner can access selected proposal's owner"
        );
        return selectedProposal;
    }

    // function extendDeadline(uint256 deadline) public {
    //     require(msg.sender == projectOwner, "Only Project Owner Can Extend Project Deadline");
    //     require(deadline >  projectDeadline, "New deadline should be greater than the current deadline");

    // }
    receive() external payable {}
}
