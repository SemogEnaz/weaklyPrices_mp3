/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['jipel.law.nyu.edu'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
}

module.exports = nextConfig
