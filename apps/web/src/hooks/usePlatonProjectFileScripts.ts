import {
  PLATON_PROJECT_FILE_NAME,
  type EnvironmentId,
  type PlatonProjectFileScript,
} from "@platon/contracts";
import { PlatonProjectFileFromJson } from "@platon/shared/platonProjectFile";
import * as Exit from "effect/Exit";
import * as Schema from "effect/Schema";
import { useMemo } from "react";

import { useProjectFileQuery } from "~/components/files/projectFilesQueryState";

const decodePlatonProjectFile = Schema.decodeExit(PlatonProjectFileFromJson);

const NO_SCRIPTS: ReadonlyArray<PlatonProjectFileScript> = [];

/**
 * Scripts declared in the project's checked-in `platon.json`, offered in the
 * scripts menu for import. Missing, truncated, or invalid files resolve to
 * an empty list.
 */
export function usePlatonProjectFileScripts(
  environmentId: EnvironmentId,
  cwd: string | null,
): ReadonlyArray<PlatonProjectFileScript> {
  const query = useProjectFileQuery(
    environmentId,
    cwd ?? "",
    PLATON_PROJECT_FILE_NAME,
    cwd !== null,
  );
  const contents = query.data && !query.data.truncated ? query.data.contents : null;
  return useMemo(() => {
    if (contents === null) return NO_SCRIPTS;
    const decoded = decodePlatonProjectFile(contents);
    if (Exit.isFailure(decoded)) return NO_SCRIPTS;
    return decoded.value.scripts ?? NO_SCRIPTS;
  }, [contents]);
}
