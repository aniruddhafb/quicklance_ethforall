import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import abi from "../../../artifacts/contracts/Project.sol/Project.json";

const project = ({ signer }) => {
  const router = useRouter();
  const { address } = router.query;

  const fetch_project = async () => {};

  useEffect(() => {
    fetch_project();
  }, [address, signer]);
  return <div></div>;
};

export default project;
