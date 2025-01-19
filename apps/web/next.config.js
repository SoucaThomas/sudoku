/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/socket.io-types"], // Move to the top level
    experimental: {
        turbo: true,
    },
};

export default nextConfig;
