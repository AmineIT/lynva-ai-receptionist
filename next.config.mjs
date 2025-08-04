/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Keep the source directory as 'src'
  pageExtensions: ['tsx', 'ts'],
};

export default nextConfig; 