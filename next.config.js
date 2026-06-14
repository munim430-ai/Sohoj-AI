/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    // Keep the local embedding model out of the bundle; load it at runtime.
    serverComponentsExternalPackages: ['@huggingface/transformers'],
  },
}

module.exports = nextConfig
