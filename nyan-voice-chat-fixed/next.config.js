/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ablyのウェブソケット接続を許可
  webpack: (config) => {
    config.externals = [...(config.externals || []), { bufferutil: 'bufferutil', 'utf-8-validate': 'utf-8-validate' }];
    return config;
  },
  // スタンドアロンモードで出力
  output: 'standalone',
  // 画像最適化の設定
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
// next.config.js
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};
