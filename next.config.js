/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["https://agentic-996f52cd.vercel.app"],
      bodySizeLimit: "2mb"
    }
  }
};

module.exports = nextConfig;
