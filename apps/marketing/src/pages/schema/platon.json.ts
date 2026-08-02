import type { APIRoute } from "astro";

import { buildPlatonProjectFileJsonSchema } from "@platon/shared/platonProjectFile";

// Rendered at build time; published at https://t3.codes/schema/platon.json so
// platon.json files can reference it via "$schema" for editor/LSP support.
export const GET: APIRoute = () =>
  new Response(`${JSON.stringify(buildPlatonProjectFileJsonSchema(), null, 2)}\n`, {
    headers: { "Content-Type": "application/json" },
  });
