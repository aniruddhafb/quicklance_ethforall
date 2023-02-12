/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs://"],
    // domains: ["https://gateway.ipfscdn.io/ipfs/"],
    // domains: ["https://gateway.ipfscdn.io/"],
    // domains: ["https://gateway.ipfscdn.io/ipfs/Qmcwsp9WtFJgMvqCDMuWdKmTz4roj545NfVypyNdwEfRmc/"],
    // domains: ["https://gateway.ipfscdn.io/ipfs/Qmcwsp9WtFJgMvqCDMuWdKmTz4roj545NfVypyNdwEfRmc/2021_9%24largeimg_335901924.jpg"],
  },
};

module.exports = nextConfig;
