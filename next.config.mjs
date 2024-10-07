/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['reactkypprofilepics.s3.ap-south-1.amazonaws.com','lh3.googleusercontent.com'],
        unoptimized: true, // Ensure image optimization is disabled
    },
    reactStrictMode: false,
};

export default nextConfig;
