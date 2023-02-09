require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "mumbai",
  networks: {
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      chainId: 80001,
      accounts: [
        "edf38e734f43872ad5d9c6a42eab6c265200aa3486241be824601a7fc94575ba",
      ],
    },
    filecoin: {
      url: "https://api.hyperspace.node.glif.io/rpc/v1",
      chainId: 3141,
      accounts: [
        "edf38e734f43872ad5d9c6a42eab6c265200aa3486241be824601a7fc94575ba",
      ],
    },
    optimism: {
      url: "https://endpoints.omniatech.io/v1/op/goerli/public",
      chainId: 420,
      accounts: [
        "edf38e734f43872ad5d9c6a42eab6c265200aa3486241be824601a7fc94575ba",
      ],
    },
    mantle: {
      url: "https://rpc.testnet.mantle.xyz",
      chainId: 5001,
      accounts: [
        "edf38e734f43872ad5d9c6a42eab6c265200aa3486241be824601a7fc94575ba",
      ],
    },
  },
};
