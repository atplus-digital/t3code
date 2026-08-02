import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  installCommand: "npm install -g vite-plus && vp install --filter '@platon/marketing...'",
  buildCommand: "vp run --filter @platon/marketing build",
  outputDirectory: "dist",
};
