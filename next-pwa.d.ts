declare module "next-pwa" {
  import { NextConfig } from "next";

  function withPWA(config: {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    runtimeCaching?: any[];
    publicExcludes?: string[];
    buildExcludes?: any[];
    cacheStartUrl?: boolean;
    dynamicStartUrl?: boolean;
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    customWorkerDir?: string;
    fallbacks?: any;
    subdomainPrefix?: string;
    skipWaiting?: boolean;
    cleanDistFolder?: boolean;
  }): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
