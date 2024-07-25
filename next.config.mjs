/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imbuzi.in",
      },
      {
        protocol: "https",
        hostname: "classymenu.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
    ],
  },
};

export default nextConfig;
