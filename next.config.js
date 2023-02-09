/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs://"],
  },
};

module.exports = nextConfig;
