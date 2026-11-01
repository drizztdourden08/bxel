# Test clean-up, part 3: formats, mcp, assistant, platform

Verdicts against the shared test standard (X:/ai-config/docs/test-standard.md). A case is one `it` or `test` call site; an `it.each` counts as one. Nothing was run in this pass (no tests, lint or typecheck); the checker runs them.
Scope: packages/formats/tests, packages/mcp/tests, apps/desktop/tests/assistant, grants, platform, config, recovery.

## Totals

| | before | after |
|---|---|---|
| files | 94 | 91 |
| cases | 708 | 674 |
| tagged critical | 0 | 446 |
| tagged standard | 0 | 228 |
| tagged e2e | 0 | 0 |
| untagged | 708 | 0 |

## Files

| file | verdict | rule(s) | tag | cases before -> after |
|---|---|---|---|---|
| packages/formats/tests/apng-compose.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/formats/tests/apng.test.ts | keep | K3 | critical | 7 -> 7 |
| packages/formats/tests/gif.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/formats/tests/palette-alpha.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/formats/tests/palette-file.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/formats/tests/png-decode.test.ts | keep | K1 | critical | 12 -> 12 |
| packages/formats/tests/png-errors.test.ts | partial | K1 | critical | 14 -> 13 |
| packages/formats/tests/png-indexed.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/formats/tests/png-rgba.test.ts | keep | K3 | critical | 8 -> 8 |
| packages/formats/tests/png-scale.test.ts | partial | K1 | critical | 17 -> 13 |
| packages/formats/tests/sheet-animation.test.ts | keep | K2 | critical | 8 -> 8 |
| packages/formats/tests/sheet-export.test.ts | keep | K2 | critical | 6 -> 6 |
| packages/formats/tests/sheet-metadata.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/sheet-pack.test.ts | keep | K1 | critical | 9 -> 9 |
| packages/formats/tests/sheet-pages.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/formats/tests/sheet-plan.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/sheet-rotate.test.ts | keep | K1 | critical | 14 -> 14 |
| packages/formats/tests/sheet-tag-colour.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/sheet-trim.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/formats/tests/tile-collision-export.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/tile-orientation-export.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/tiled-animation.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/tiled-json.test.ts | keep | K2 | critical | 6 -> 6 |
| packages/formats/tests/tiled-plan.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/formats/tests/tiled-read.test.ts | keep | K3 | critical | 5 -> 5 |
| packages/formats/tests/tilemap-json.test.ts | keep | K2 | critical | 6 -> 6 |
| packages/formats/tests/tileset-image.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/formats/tests/xml-parse.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/mcp/tests/base64.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/mcp/tests/catalogue.test.ts | partial | K2 | critical | 13 -> 10 |
| packages/mcp/tests/errors-bridge.test.ts | partial | K2 | critical | 10 -> 8 |
| packages/mcp/tests/grants-app.test.ts | keep | K4 | critical | 8 -> 8 |
| packages/mcp/tests/grants-list.test.ts | keep | K4 | critical | 13 -> 13 |
| packages/mcp/tests/grants.test.ts | keep | K4 | critical | 17 -> 17 |
| packages/mcp/tests/input-failures.test.ts | keep | K2 | critical | 10 -> 10 |
| packages/mcp/tests/limits.test.ts | partial | K1 | critical | 7 -> 5 |
| packages/mcp/tests/map-mask.test.ts | keep | K2 | critical | 4 -> 4 |
| packages/mcp/tests/project-files-tools.test.ts | keep | K2 | critical | 11 -> 11 |
| packages/mcp/tests/scope.test.ts | keep | K4 | critical | 12 -> 12 |
| packages/mcp/tests/timeline-schemas.test.ts | keep | K2 | critical | 8 -> 8 |
| packages/mcp/tests/tool-schemas.test.ts | partial | K2 | standard | 17 -> 16 |
| packages/mcp/tests/trust-decide.test.ts | keep | K4 | critical | 17 -> 17 |
| packages/mcp/tests/trust-migration.test.ts | keep | K3 | critical | 11 -> 11 |
| packages/mcp/tests/trust-store.test.ts | keep | K3 | critical | 18 -> 18 |
| packages/mcp/tests/wire-mask.test.ts | keep | K2 | critical | 5 -> 5 |
| apps/desktop/tests/assistant/animation-reads.test.ts | keep | S2 | standard | 8 -> 8 |
| apps/desktop/tests/assistant/app-tools-commands.test.ts | keep | S2 | standard | 11 -> 11 |
| apps/desktop/tests/assistant/app-tools-history.test.ts | keep | S2 | standard | 2 -> 2 |
| apps/desktop/tests/assistant/app-tools-layout.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/assistant/app-tools-settings.test.ts | keep | S2 | standard | 8 -> 8 |
| apps/desktop/tests/assistant/app-tools-view.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/assistant/claim-files.test.ts | keep | K4 | critical | 3 -> 3 |
| apps/desktop/tests/assistant/command-manifest.test.ts | partial | K1 | critical | 8 -> 4 |
| apps/desktop/tests/assistant/document-include.test.ts | keep | S2 | standard | 4 -> 4 |
| apps/desktop/tests/assistant/export-target-kind.test.ts | keep | K4 | critical | 4 -> 4 |
| apps/desktop/tests/assistant/grant-model.test.ts | partial | K1 | critical | 15 -> 14 |
| apps/desktop/tests/assistant/native-pair.test.ts | keep | K4 | critical | 6 -> 6 |
| apps/desktop/tests/assistant/open-keeps-names.test.ts | keep | K3 | standard | 1 -> 1 |
| apps/desktop/tests/assistant/preview-request.test.ts | keep | K1 | critical | 3 -> 3 |
| apps/desktop/tests/assistant/program-grant-render.test.ts | partial | S1 | standard | 6 -> 2 |
| apps/desktop/tests/assistant/recent-ids.test.ts | keep | K1,S2 | critical+standard | 2 -> 2 |
| apps/desktop/tests/assistant/save-no-dialogs.test.ts | keep | K4 | standard | 9 -> 9 |
| apps/desktop/tests/assistant/setting-rows.test.ts | keep | K1 | critical | 6 -> 6 |
| apps/desktop/tests/assistant/settings-scope.test.ts | keep | K1 | critical | 1 -> 1 |
| apps/desktop/tests/assistant/sweep-fixes.test.ts | keep | S2 | standard | 16 -> 16 |
| apps/desktop/tests/assistant/timeline-view.test.ts | keep | S2 | standard | 12 -> 12 |
| apps/desktop/tests/assistant/no-dialog-paths.test.ts | wipe | W1 | - | 2 -> 0 |
| apps/desktop/tests/grants/helper-listing.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/grants/restart-handoff.test.ts | keep | K1 | critical | 6 -> 6 |
| apps/desktop/tests/grants/session-grants.test.ts | keep | K1 | critical | 9 -> 9 |
| apps/desktop/tests/grants/step-bundles.test.ts | partial | K4 | critical | 2 -> 1 |
| apps/desktop/tests/grants/stop-bxel-grants.test.ts | keep | K4 | critical | 5 -> 5 |
| apps/desktop/tests/platform/area-findings.test.ts | partial | S2 | standard | 8 -> 7 |
| apps/desktop/tests/platform/assistant-strict.test.ts | partial | K4 | standard | 8 -> 7 |
| apps/desktop/tests/platform/banks.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/platform/platform-preset.test.ts | partial | S2 | standard | 15 -> 14 |
| apps/desktop/tests/platform/preset-preview.test.ts | partial | K1 | critical | 7 -> 6 |
| apps/desktop/tests/platform/snap-platform.test.ts | keep | S2 | standard | 6 -> 6 |
| apps/desktop/tests/platform/sprite-check.test.ts | partial | S2 | standard | 5 -> 4 |
| apps/desktop/tests/platform/sprite-platform.test.ts | keep | S2 | standard | 4 -> 4 |
| apps/desktop/tests/platform/strict-mode.test.ts | keep | K4 | standard | 11 -> 11 |
| apps/desktop/tests/platform/spelling.test.ts | wipe | W1 | - | 2 -> 0 |
| apps/desktop/tests/config/asset-config.test.ts | keep | S2 | standard | 9 -> 9 |
| apps/desktop/tests/config/palette-switch.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/config/project-config.test.ts | keep | S2 | standard | 11 -> 11 |
| apps/desktop/tests/config/project-export.test.ts | keep | S2 | standard | 5 -> 5 |
| apps/desktop/tests/config/project-hub-pages.test.ts | wipe | W6/W5 | - | 2 -> 0 |
| apps/desktop/tests/recovery/close-prompt.test.ts | keep | S2 | standard | 3 -> 3 |
| apps/desktop/tests/recovery/project-restore.test.ts | keep | K3 | standard | 2 -> 2 |
| apps/desktop/tests/recovery/quit-decision.test.ts | keep | K1 | critical | 9 -> 9 |
| apps/desktop/tests/recovery/restore-flow.test.ts | keep | K3 | standard | 7 -> 7 |
| apps/desktop/tests/recovery/snapshot-clear.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/recovery/snapshot-throttle.test.ts | keep | S2 | standard | 7 -> 7 |
| apps/desktop/tests/recovery/unopened-snapshots.test.ts | keep | S2 | standard | 3 -> 3 |
## Tag pass

- critical: pure logic, codecs, grants, trust store, recovery quit decision, and the temp-folder file tests (`claim-files`, `export-target-kind`). No process, socket, timer or real clock.
- standard: tests that run the app tools, the document host or the zustand stores against in-memory fakes and the mocked Brock module; the MCP SDK in-memory transport (`helper-listing`); the whole of `tool-schemas` (builds the schema of all 44 tools). One file is mixed by describe: `recent-ids` (pure id function critical, tool run standard).
- e2e: none in this part. No test here spawns a process, opens a socket or needs the built app.
- W7: `grants/helper-listing` slept 20 ms (`setTimeout`) to wait for the tool-list-changed notification. It now awaits a `listTools` round trip, which the in-memory transport delivers after any earlier notification. No sleep is left. Recovery snapshot tests already use the fake timers of `recovery-harness`.

## Deleted cases that met a critical-type rule

- formats/png-errors "decodes an unmodified copy" (K1): a control case; png-rgba already round trips valid files (W4).
- formats/png-scale, four cases (K1): "only creates colours that already exist" and "never invents a colour" repeat the pixel-repeat and step cases (W4); "keeps the long side at or below 256" repeats the other thumbnail cases (W4); "accepts a smaller maximum side" repeats the downscale one (W4).
- mcp/limits "is 960 KiB" and "publishes the limits table" (K2): a constant and a constants table; the boundary case at the budget still pins the number (W5).
- mcp/catalogue "marks the two step tools as routed", "routes run_command and keeps the restart behind its permission", "lists twelve bundles" (K2): constants of the catalogue, not behavior (W5).
- mcp/errors-bridge "names every route under bxel:mcp" (W2, structure of a constants table) and "marks an ok result" (W5, an object literal).
- mcp/tool-schemas "writes with exactly the seventeen writing tools" (K2): the same list as the catalogue test (W4).
- desktop/assistant/command-manifest, four cases (K4): "has an entry for every command", "has no entry for a command that does not exist", "places each command in a real bundle with a real args kind" (W2, cross-table consistency, rule candidates below); "marks the zoom, grid and playback commands as show" (W5, a constants table). The refusal and direct-run cases stay.
- desktop/assistant/grant-model "shows every bundle and every tool once, each with a description" (K1): structure of the rows table (W2).
- desktop/assistant/program-grant-render, four cases (S1): radio group markup, greyed options, blocked-program markup (W3); "uses plain prose with no em or en dashes" (W10).
- desktop/assistant/no-dialog-paths, 2 cases (K4): walks the import graph and greps source text (W1).
- desktop/grants/step-bundles "places each document, palette and raster command" (K4): table consistency (W2). The grant-check case over the real command names stays.
- desktop/platform/spelling, 2 cases (W1, W10): scans all source files for the word "color".
- desktop/platform/area-findings "shows the areas on the canvas overlay" (S2): asserts calls on a canvas context spy, no behavior (W6/W3).
- desktop/platform/platform-preset "lists the platforms by family" (S2): counts 21 options, a constant (W5).
- desktop/platform/preset-preview "describes every preset in the catalog" (K1): a loop over a constants table with a length floor (W5).
- desktop/platform/assistant-strict "wraps every command in the guard" (K4): compares function identity of two arrays, a structure check (W2); the guard behavior is covered by the other cases.
- desktop/platform/sprite-check "agrees with what the command does" (S2): the strict refusal is already covered by "blocks that size when the file enforces its platform rules" and by strict-mode (W4).
- desktop/config/project-hub-pages, 2 cases (W6, W5): one only asserts a mock was called, the other asserts page order and title constants.

## Rule candidates (W1 and W2)

- No dialog, file picker or confirm on the assistant tool path: forbid `confirmAction|confirmSave|confirmChoice|documents.saveAs|open|openFolder|regrant|owner-prompts|file-kit|useDialogStore` in any file reachable from `src/assistant/tool-handlers.constants.ts` and `guard-handlers.ts` (except `prompts/guard-documents.ts`). The runtime guard in `save-no-dialogs` still tests the behavior.
- Spelling: no American "color" in a string literal with a space, in `apps/desktop/src` and `packages/*/src` (proper noun "Game Boy Color" excepted).
- Command manifest closure: every id in `APP_COMMANDS` has an entry in `MANIFEST` and the reverse; each entry's `area` is in `BUNDLE_IDS` and its `args` kind is in `ARGS_KINDS` (better as a type: make `MANIFEST` a `Record<AppCommandId, Entry>`).
- Step bundle closure: every command name in `APP_COMMANDS` is placed by `bundleOfStep` (a typed table keyed by command prefix would make it a compile error).
- Permissions rows closure: `TOOL_TEXT` has a non-empty text for every key of `TOOL_ROWS`, and `bundleRows` lists every `BUNDLE_IDS` entry (a `Record<ToolRowId, string>` type covers the first).
- Command guard wrapping: every command of `documentCommands`, `paletteCommands` and `rasterCommands` goes through the guard in `APP_COMMANDS` (a typed factory would enforce it).
- MCP route names: every `MCP_ROUTE` value starts with `bxel:mcp:` and is unique (a template literal type covers it).
- Prose: no em or en dashes in the permission page strings (a lint rule over string literals under `views/AssistantPanel`).

## Unsure

- Vitest tags in the `{ tags: [...] }` option need the three tags declared in the vitest config (`test.tags`) when strict tags is on. Config is outside this packet; the checker should confirm the config declares `critical`, `standard` and `e2e`.
- Platform, config and recovery tests build a real in-memory document host and zustand stores, not a pure function. I tagged them standard (integration with in-memory fakes). If the owner reads "critical" more broadly, many could move up; none spawns, sleeps or touches a real file.
- `tool-schemas` builds the JSON schema of all 44 tools at module load; tagged standard because I could not time it. Likely under 1 s, then it can go critical.
- `claim-files` and `export-target-kind` create real temp folders and files (inside the OS temp dir), kept critical per the rule on temp folders.
- Files were CRLF; the edits kept CRLF. No lint or typecheck was run, so a dropped test could have left an unused import I missed; I removed the ones I found by grep.
