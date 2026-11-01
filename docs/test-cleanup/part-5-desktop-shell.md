# Test clean-up part 5: desktop shell areas

Scope: the `apps/desktop/tests` folders project, workspace, ui-context, hints, keymap, keyboard, dialogs, demo, asset-list, asset-overview, asset-view, files, file-ops, documents, organise, panel-browser, project-browser, project-health, status-extras, context-menu, tiled-import and legacy. Judged against `ai-config/docs/test-standard.md`. A case is one `it` or `test` call site; an `it.each` counts as one.

Every kept describe starts with its KEEP rule and carries one vitest tag, for example `describe('K1 title', { tags: ['critical'] }, () => {})`. Pure logic and in-memory engines are `critical`. Anything that runs through the project rig (in-memory disk port, stores, mocked brock-react) or renders markup is `standard`. No test in this part needs `e2e`.

## Totals

- Files: 76 before, 70 after (6 deleted).
- Cases: 539 before, 459 after (80 deleted).
- Tags after: critical 170 cases in 24 files, standard 289 cases in 46 files, e2e 0.

## Files

| File | Verdict | Rule(s) | Tag | Cases before -> after |
|---|---|---|---|---|
| asset-list/asset-actions.test.ts | keep | S2 | standard | 9 -> 9 |
| asset-list/asset-list.test.ts | keep | K1 | critical | 6 -> 6 |
| asset-list/duplicate-kinds.test.ts | keep | S2 | standard | 3 -> 3 |
| asset-overview/asset-overview.test.ts | keep | S2 | standard | 5 -> 5 |
| asset-view/asset-view.test.ts | keep | K1 | critical | 5 -> 5 |
| context-menu/menu-commands.test.ts | wipe | W2 | none | 2 -> 0 |
| demo/demo-project.test.ts | partial | K3 | standard | 2 -> 1 |
| dialogs/animation-import.test.ts | keep | K3 | critical | 6 -> 6 |
| dialogs/image-import.test.ts | partial | K3 | critical | 15 -> 14 |
| dialogs/new-sprite.test.ts | partial | K1 | critical | 18 -> 17 |
| dialogs/palette-change.test.ts | partial | K1 | critical | 12 -> 11 |
| dialogs/palette-source.test.ts | partial | K3 | critical | 8 -> 7 |
| documents/document-host.test.ts | keep | K1 | critical | 8 -> 8 |
| file-ops/file-ops.test.ts | keep | K3 | standard | 10 -> 10 |
| file-ops/unsaved-referrers.test.ts | keep | K3 | standard | 3 -> 3 |
| files/recent-list.test.ts | partial | K1 | critical | 7 -> 6 |
| hints/hint-body.test.ts | partial | S1 | standard | 5 -> 1 |
| hints/hint-data.test.ts | partial | K1 | critical | 11 -> 4 |
| hints/menu-order.test.ts | partial | K1 | critical | 22 -> 5 |
| hints/palette-widget.test.ts | partial | S1 | standard | 5 -> 1 |
| keyboard/blocking-findings.test.ts | keep | K1 | critical | 1 -> 1 |
| keyboard/step-cursor.test.ts | keep | K1 | critical | 3 -> 3 |
| keymap/command-reasons.test.ts | wipe | W2/W5 | none | 4 -> 0 |
| keymap/keymap.test.ts | partial | S2 | standard | 12 -> 6 |
| keymap/timeline-keys.test.ts | wipe | W2 | none | 4 -> 0 |
| keymap/zones.test.ts | wipe | W2 | none | 5 -> 0 |
| organise/organise-ops.test.ts | keep | K1 | critical | 8 -> 8 |
| panel-browser/project-browser.test.ts | partial | K1 | critical | 17 -> 15 |
| project-browser/query-grammar.test.ts | keep | K1 | critical | 8 -> 8 |
| project-browser/selection-and-playback.test.ts | keep | K1 | critical | 5 -> 5 |
| project-browser/subject-pin.test.ts | keep | K1 | critical | 3 -> 3 |
| project-health/project-health.test.ts | keep | K3 | standard | 10 -> 10 |
| project/animation-tools.test.ts | keep | S2 | standard | 16 -> 16 |
| project/asset-tools.test.ts | keep | S2 | standard | 15 -> 15 |
| project/assistant-grants.test.ts | keep | K4 | standard | 9 -> 9 |
| project/assistant-saves.test.ts | keep | K4 | standard | 5 -> 5 |
| project/hidden-folder-tools.test.ts | keep | K4 | standard | 7 -> 7 |
| project/hidden-saves.test.ts | keep | K4 | standard | 5 -> 5 |
| project/map-tools.test.ts | keep | S2 | standard | 8 -> 8 |
| project/migration-palettes.test.ts | keep | K3 | standard | 2 -> 2 |
| project/pack-project.test.ts | keep | K3 | standard | 3 -> 3 |
| project/project-entries.test.ts | keep | K3 | standard | 16 -> 16 |
| project/project-file-hidden.test.ts | keep | K4 | standard | 3 -> 3 |
| project/project-file-import.test.ts | keep | K3 | standard | 4 -> 4 |
| project/project-file-tools.test.ts | keep | S2 | standard | 15 -> 15 |
| project/project-files.test.ts | keep | K3 | standard | 10 -> 10 |
| project/project-folders.test.ts | keep | K3 | standard | 10 -> 10 |
| project/project-lifecycle.test.ts | keep | S2 | standard | 16 -> 16 |
| project/project-linked.test.ts | keep | S2 | standard | 11 -> 11 |
| project/project-manager.test.ts | keep | S2 | standard | 7 -> 7 |
| project/project-tools.test.ts | keep | K4 | standard | 17 -> 17 |
| project/project-write-tools.test.ts | keep | K4 | standard | 15 -> 15 |
| project/second-project.test.ts | keep | K3 | standard | 3 -> 3 |
| status-extras/fold.test.ts | keep | K1 | critical | 3 -> 3 |
| tiled-import/tiled-import.test.ts | partial | K3 | critical | 10 -> 9 |
| ui-context/coverage.test.ts | wipe | W2 | none | 2 -> 0 |
| ui-context/derive-context.test.ts | keep | K1 | critical | 10 -> 10 |
| ui-context/evaluate.test.ts | partial | K1 | critical | 9 -> 8 |
| ui-context/matrix.test.ts | wipe | W4/W5 | none | 2 -> 0 |
| ui-context/surfaces.test.ts | partial | K1 | critical | 18 -> 6 |
| ui-context/swatch-columns.test.ts | partial | K1 | critical | 3 -> 2 |
| workspace/animation-migration.test.ts | keep | K3 | standard | 4 -> 4 |
| workspace/animation-save.test.ts | keep | K3 | standard | 1 -> 1 |
| workspace/animation-shared.test.ts | keep | K3 | standard | 1 -> 1 |
| workspace/brush-save.test.ts | keep | K3 | standard | 2 -> 2 |
| workspace/legacy-files.test.ts | keep | K3 | standard | 5 -> 5 |
| workspace/link-follow-id.test.ts | keep | S2 | standard | 2 -> 2 |
| workspace/many-assets.test.ts | keep | S2 | standard | 3 -> 3 |
| workspace/project-tabs.test.ts | keep | S2 | standard | 3 -> 3 |
| workspace/project-workspace.test.ts | keep | S2 | standard | 8 -> 8 |
| workspace/save-all-checks.test.ts | keep | K3 | standard | 3 -> 3 |
| workspace/save-all-refresh.test.ts | keep | K3 | standard | 3 -> 3 |
| workspace/save-as-path.test.ts | keep | K3 | standard | 2 -> 2 |
| workspace/saved-point.test.ts | keep | K3 | standard | 3 -> 3 |
| workspace/tilemap-save.test.ts | keep | K3 | standard | 2 -> 2 |
| workspace/trash-undo.test.ts | keep | K3 | standard | 1 -> 1 |

## Deleted tests that met a critical-type rule (K1 to K5)

Each line names the test and why it went. The doubt question applied: if it is deleted and the code breaks, does the compiler, lint or another test still catch it.

- dialogs/image-import, "cancel changes nothing" (K1): only shows then hides a dialog store; the import path is covered by the transaction tests beside it.
- dialogs/new-sprite, "creates nothing when the dialog is cancelled" (K1): store show and hide with no outcome beyond a store flag.
- dialogs/new-sprite, "defaults to 16..." trimmed (K1): the LIMIT_DEFAULT, LIMIT_PRESETS and NEW_MEMORY_DEFAULT constant assertions went (W5); the limitError boundaries stay.
- dialogs/palette-change, "cancel clears the proposal" (K1): a store reset (W5).
- dialogs/palette-source, "lists Bxel 16 first with 15 colours" (K3): asserts a constants table (W5).
- files/recent-list, "sits under File right after Open" (K1): menu order (W2), a structure fact.
- hints/hint-data, hint text checks, "point only at commands that exist", "keep the key out of button names", "gives every tool a description", "adds a help entry", "lists the rows of the current tool", "teaches the wheel..." (K1): prose, dash, id-exists and table-shape checks (W2, W5, W10).
- hints/menu-order, 17 of 22 (K1, K4): menu order and structure for kind menus, Edit and layer menus (W2, W4, W8); the dim-with-reason and hide cases stay.
- keymap/keymap, 6 of 12 (K1): chord clash, unique id and label, tool letter keys, contract chords (W2, W5); "drive the viewport" and "open the shortcut list" only assert mock calls (W6). The `scoped.length > 30` assertion also went (W5).
- keymap/command-reasons, timeline-keys, zones (K1, whole files): reason wording, chord uniqueness inside a zone, zone constants and one Delete owner per zone (W2, W5).
- context-menu/menu-commands (K1, whole file): context menus name only registered commands (W2).
- ui-context/coverage and matrix (K1, whole files): the rule table covers every command, and a snapshot of the visibility matrix that restates the rule table (W2, W4, W5).
- ui-context/surfaces, 12 of 18 (K1): rail, toolbar and status variants of one rule in different contexts (W4); one per rule and the separator cases stay.
- ui-context/evaluate, "retires the old duplicate frame command everywhere" (K1): code that is removed (W8).
- ui-context/swatch-columns, "wraps 16 swatches in two rows of 8" (K1): a second state of the same wrap rule (W4); the boundary cases stay.
- panel-browser/project-browser, "gives every row its position in the set" (K1): accessibility attribute markup (W3).
- panel-browser/project-browser, "reads kind, is, uses and in tokens with the shared parser" (K1): duplicate of query-grammar (W4).
- tiled-import, "reads the orientation of an isometric map" (K3): the same behavior as the orientation-import test (W4).
- demo/demo-project, "every committed file is what the encoders write today" (K3): a byte snapshot of real files in the repo (W3, real files outside a temp folder). The `BXEL_WRITE_DEMO=1` generator block at module level stays so the demo project can be rewritten.

## Rule candidates (W1 and W2)

These tests were dropped because a lint, type or structure rule should hold them. No lint rule was written here.

- Context menus name only registered commands and have entries.
- Every disabled command carries a reason; the reason is a full sentence, ends in a full stop, and holds no dashes.
- Hint texts are non-empty, one line, plain prose with no dashes.
- Hint shortcut commands exist in the keymap.
- Button hint names carry no key text.
- Every tool has a description.
- Keymap table: unique ids, label and group set, no chord clashes, no unzoned command on a zoned chord.
- Timeline zone keys: no chord repeats and no collision with app chords.
- Native edit commands set whileTyping false.
- COMMAND_ZONE values, and one Delete owner per zone.
- The ui-context rule table covers every app command and holds no stray ids.
- Menu order and structure.

## Left for the owner or the checker

- The vitest `tags` option may need the three tags (`critical`, `standard`, `e2e`) declared in the vitest config. Config is outside this part.
- demo-project test 2 reads the committed demo project from the repo, so it is tagged `standard` rather than `critical`. The generator block could become a tool under `.claude/tools/`.
- Helper files `keymap/chord-table.ts` and `hints/all-hints.ts` lost their last user and were deleted.
- `project/project-lifecycle` and `file-ops/file-ops` use `vi.waitFor` on microtasks only; no real timer or sleep. `workspace/project-tabs` already used fake timers.
- No test, lint, typecheck or build was run. The unused-import cleanup was done by reading the files, so the checker should run lint on the changed files.
