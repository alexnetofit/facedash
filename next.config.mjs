/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desabilitar a verificação ESLint durante o build para a Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig; 