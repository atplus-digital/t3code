/**
 * PlatonProjectFileLoader - Effect service that loads the checked-in `platon.json`
 * project file from a workspace root.
 *
 * Loading is best-effort: a missing file resolves to `Option.none`, and
 * unreadable or invalid files are logged and treated as absent so callers
 * can fall back to their defaults.
 *
 * @module PlatonProjectFileLoader
 */
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as Schema from "effect/Schema";

import { PLATON_PROJECT_FILE_NAME, type PlatonProjectFile } from "@platon/contracts";
import { PlatonProjectFileFromJson } from "@platon/shared/platonProjectFile";

const decodePlatonProjectFileJson = Schema.decodeEffect(PlatonProjectFileFromJson);

export class PlatonProjectFileLoadError extends Schema.TaggedErrorClass<PlatonProjectFileLoadError>()(
  "PlatonProjectFileLoadError",
  {
    operation: Schema.Literals(["read", "decode"]),
    workspaceRoot: Schema.String,
    filePath: Schema.String,
    cause: Schema.Defect(),
  },
) {
  override get message(): string {
    return `Failed to ${this.operation} ${PLATON_PROJECT_FILE_NAME} at ${this.filePath}.`;
  }
}

/** Service tag for platon.json project file loading. */
export class PlatonProjectFileLoader extends Context.Service<
  PlatonProjectFileLoader,
  {
    /**
     * Load and decode `platon.json` at the workspace root.
     *
     * Never fails: missing, unreadable, or invalid files resolve to
     * `Option.none` (invalid files are logged as warnings).
     */
    readonly load: (workspaceRoot: string) => Effect.Effect<Option.Option<PlatonProjectFile>>;
  }
>()("platon/project/PlatonProjectFileLoader") {}

const logPlatonProjectFileLoadError = (error: PlatonProjectFileLoadError) =>
  Effect.logWarning(error).pipe(
    Effect.annotateLogs({
      operation: error.operation,
      workspaceRoot: error.workspaceRoot,
      filePath: error.filePath,
      errorTag: error._tag,
    }),
  );

export const make = Effect.gen(function* () {
  const fileSystem = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;

  const load: PlatonProjectFileLoader["Service"]["load"] = Effect.fn(
    "PlatonProjectFileLoader.load",
  )(function* (workspaceRoot) {
    const filePath = path.join(workspaceRoot, PLATON_PROJECT_FILE_NAME);
    const raw = yield* fileSystem.readFileString(filePath).pipe(
      Effect.map(Option.some),
      Effect.catchTags({
        PlatformError: (error) =>
          error.reason._tag === "NotFound"
            ? Effect.succeed(Option.none<string>())
            : logPlatonProjectFileLoadError(
                new PlatonProjectFileLoadError({
                  operation: "read",
                  workspaceRoot,
                  filePath,
                  cause: error,
                }),
              ).pipe(Effect.as(Option.none<string>())),
      }),
    );
    if (Option.isNone(raw)) {
      return Option.none<PlatonProjectFile>();
    }
    return yield* decodePlatonProjectFileJson(raw.value).pipe(
      Effect.map(Option.some),
      Effect.catchTags({
        SchemaError: (error) =>
          logPlatonProjectFileLoadError(
            new PlatonProjectFileLoadError({
              operation: "decode",
              workspaceRoot,
              filePath,
              cause: error,
            }),
          ).pipe(Effect.as(Option.none<PlatonProjectFile>())),
      }),
    );
  });

  return PlatonProjectFileLoader.of({ load });
});

export const layer = Layer.effect(PlatonProjectFileLoader, make);
