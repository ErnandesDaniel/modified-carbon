import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    compress: true,
    reactCompiler: true,
    output: 'standalone',
    productionBrowserSourceMaps: false,
    //Нужно для работы standalone
    outputFileTracingRoot: path.join(__dirname),
    experimental: {
        authInterrupts: true,
    },
};

export default nextConfig;
