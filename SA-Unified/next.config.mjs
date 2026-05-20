/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Prevent hot reload when data JSON files are saved via the editor
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/src/data/*.json"],
    };
    return config;
  },
};

export default nextConfig;
