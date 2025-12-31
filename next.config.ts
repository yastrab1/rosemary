import type { NextConfig } from "next";
import * as Url from "node:url";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://o1lch815l2.ufs.sh/f/**")],
  },
};

export default nextConfig;
