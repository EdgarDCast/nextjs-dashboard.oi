import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: { ppr: true },
  outputFileTracingRoot: path.join(__dirname),

  // Agregar orígenes permitidos en desarrollo
  allowedDevOrigins: ['192.168.56.1', 'localhost'],
};

export default nextConfig;
