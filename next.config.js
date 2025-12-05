/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    // FAISS is a native Node.js module - don't bundle it
    if (isServer) {
      config.externals = config.externals || []
      // Mark faiss-node as external so it's not bundled
      config.externals.push('faiss-node')
    }
    // Ignore FAISS in client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'faiss-node': false,
      }
    }
    return config
  },
}

module.exports = nextConfig

