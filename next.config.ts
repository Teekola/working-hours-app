import type { NextConfig } from "next";

import { env } from "./src/env";

if (!env) {
   console.log("No env imported");
}

const nextConfig: NextConfig = {
   cacheComponents: true,
   typedRoutes: true,
};

export default nextConfig;
