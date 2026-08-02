import * as Schema from "effect/Schema";

import { PlatonProjectFile, PLATON_PROJECT_FILE_SCHEMA_URL } from "@platon/contracts";

import { fromLenientJson } from "./schemaJson.ts";

/**
 * Codec between the raw `platon.json` file contents (lenient JSONC string) and the
 * decoded {@link PlatonProjectFile}.
 */
export const PlatonProjectFileFromJson = fromLenientJson(PlatonProjectFile);

/**
 * Build the publishable JSON Schema document for `platon.json` (draft 2020-12).
 *
 * Served from the marketing site at {@link PLATON_PROJECT_FILE_SCHEMA_URL} so
 * editors get LSP support via a `$schema` reference.
 */
export function buildPlatonProjectFileJsonSchema(): Record<string, unknown> {
  const document = Schema.toJsonSchemaDocument(PlatonProjectFile);
  const jsonSchema: Record<string, unknown> = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: PLATON_PROJECT_FILE_SCHEMA_URL,
    ...document.schema,
  };
  if (document.definitions && Object.keys(document.definitions).length > 0) {
    jsonSchema.$defs = document.definitions;
  }
  return jsonSchema;
}
