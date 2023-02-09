import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import abi from "../../../artifacts/contracts/Project.sol/Project.json";

const project = ({ signer }) => {
  const router = useRouter();
  const [project, setProject] = useState();
  const { address } = router.query;

  const fetch_project_info = async () => {
    if (signer && address) {
      const project_info = new ethers.Contract(address, abi.abi, signer);
      
    }
  };
  useEffect(() => {
    fetch_project_info();
  }, [address, signer]);
  return <div></div>;
};

export default project;
