/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        search: '',
      },
    ],
  },
  reactStrictMode: false
};

export default nextConfig;
