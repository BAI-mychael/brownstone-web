/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack options go here, not under 'experimental' if using newer versions
  // Or remove the 'turbo' block temporarily to see if it fixes the crash
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
