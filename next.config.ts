import type { NextConfig } from "next";

import { env } from "./src/env";

if (!env) {
   console.log("No env imported");
}

const nextConfig: NextConfig = {
   eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
