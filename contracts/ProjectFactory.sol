// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Project.sol";

contract ProjectFactory {
    using Counters for Counters.Counter;
    Counters.Counter private _projectId;

    address payable public admin;

    constructor() {
        admin = payable(msg.sender);
    }

    struct ProjectInfo {
        uint256 id;
        string title;
        string short_description;
        string description;
        string pdf;
        string images;
        uint256 budget;
        uint256 time;
        uint256 deadLine;
        address payable owner;
        Project project;
    }

    event ProjectCreated(
        uint256 id,
        string title,
        string short_description,
        string description,
        string pdf,
        string images,
        uint256 budget,
        uint256 time,
        uint256 deadLine,
        address payable owner,
        Project project
    );

    mapping(uint256 => ProjectInfo) private deployedprojects;
    mapping(address => mapping(uint256 => ProjectInfo)) public projectOwner;

    function createProject(
        string memory _title,
        string memory _short_description,
        string memory _description,
        string memory _pdf,
        string memory _images,
        uint256 _budget,
        uint256 _deadline
    ) public payable {
        require(
            msg.value == _budget,
            "Please Transfer The Amount Equal To Your Project Budget"
        );
        uint256 id = _projectId.current();
        Project newProject = new Project(
            payable(msg.sender),
            _deadline,
            _budget
        );
        ProjectInfo memory project = ProjectInfo(
            id,
            _title,
            _short_description,
            _description,
            _pdf,
            _images,
            _budget,
            block.timestamp,
            _deadline,
            payable(msg.sender),
            newProject
        );
        deployedprojects[id] = project;
        _projectId.increment();
        payable(address(newProject)).transfer(msg.value);
        emit ProjectCreated(
            id,
            _title,
            _short_description,
            _description,
            _pdf,
            _images,
            _budget,
            block.timestamp,
            _deadline,
            payable(msg.sender),
            newProject
        );
    }

    function getAllProjects() public view returns (ProjectInfo[] memory) {
        uint256 projects = _projectId.current();
        uint256 currentIndex = 0;
        ProjectInfo[] memory allProjects = new ProjectInfo[](projects);
        for (uint256 i = 0; i < projects; i++) {
            ProjectInfo memory currentProject = deployedprojects[i];
            allProjects[currentIndex] = currentProject;
            currentIndex++;
        }
        return allProjects;
    }

    function getProjectbyId(uint256 _id)
        public
        view
        returns (ProjectInfo memory)
    {
        ProjectInfo memory project = deployedprojects[_id];
        return project;
    }

    function getProjectsByOwner() public view returns (ProjectInfo[] memory) {
        uint256 projectCount = _projectId.current();
        ProjectInfo[] memory ownerProjects = new ProjectInfo[](projectCount);
        uint256 currentIndex;

        for (uint256 i = 0; i < projectCount; i++) {
            ProjectInfo storage currentProject = deployedprojects[i];
            if (currentProject.owner == msg.sender) {
                ownerProjects[currentIndex] = currentProject;
                currentIndex++;
            }
        }
        return ownerProjects;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function extendDeadline(uint256 project_id, uint256 new_deadline) public {
        ProjectInfo storage project = deployedprojects[project_id];
        require(
            msg.sender == project.owner,
            "Only project owner can extend deadline of this project"
        );
        require(
            new_deadline > project.deadLine,
            "please give a deadline of greater than current deadline"
        );

        project.deadLine = new_deadline;
    }

    receive() external payable {}
}
