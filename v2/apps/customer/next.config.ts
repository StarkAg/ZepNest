import type { NextConfig } from 'next';
import path from 'node:path';

// Two build targets from one codebase:
//   BUILD_TARGET=app  -> static export, bundled into the Capacitor binary
//   (default)         -> normal Next build for the web
const isApp = process.env.BUILD_TARGET === 'app';

const nextConfig: NextConfig = {
  ...(isApp
    ? {
        output: 'export' as const,
        distDir: 'out',
        // Capacitor serves from file:// - relative asset paths are required.
        assetPrefix: './',
        images: { unoptimized: true },
        // Static export emits dir/index.html; trailing slashes keep those
        // URLs resolvable off the filesystem.
        trailingSlash: true,
      }
    : {}),
  // Pin the monorepo root; otherwise Next walks up and finds ~/package-lock.json.
  outputFileTracingRoot: path.join(__dirname, '../../'),
  reactStrictMode: true,
  typedRoutes: true,
};

export default nextConfig;
