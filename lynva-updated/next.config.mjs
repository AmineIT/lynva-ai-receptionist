/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove output: 'export' to enable API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Keep the source directory as 'src'
  pageExtensions: ['tsx', 'ts'],
};

export default nextConfig; 