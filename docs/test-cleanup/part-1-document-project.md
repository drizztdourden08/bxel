# Test clean-up, part 1: packages/document and packages/project

Verdicts against the shared test standard (X:/ai-config/docs/test-standard.md). A case is one `it` or `test` call site; an `it.each` counts as one. Nothing was run in this pass (no tests, lint or typecheck); the checker runs them. Helper files (`*.ts` without `.test`) and `document.bench.ts` were not touched.

## Totals

| | before | after |
|---|---|---|
| files | 104 | 104 (none deleted whole) |
| cases | 776 | 764 |
| document | 86 files, 646 cases | 86 files, 639 cases |
| project | 18 files, 130 cases | 18 files, 125 cases |
| tagged critical | 0 | 709 |
| tagged standard | 0 | 55 |
| tagged e2e | 0 | 0 |
| untagged | 776 | 0 |

Every file ran in memory (engine, codecs, zip bytes through fflate), with no sleeps, no real clock (the created-time tests inject a clock), no real files and no process. So nothing was retagged e2e and no W7 case was found. S3 (edge and failure paths of K1 to K4) cases are tagged `standard`: the open-damage, open-check, engine-rejection, map guard, layer merge rule, tile integrity and similar describes. Everything else is `critical`.

Each top level describe starts with its KEEP rule and carries one native tag, for example `describe('K1 ids', { tags: ['critical'] }, ...)`. A file with describes of different rules lists all of them.

## Per file

| file | verdict | rule(s) | tag | cases before -> after |
|---|---|---|---|---|
| packages/document/tests/animated-split.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/document/tests/animation-compose.test.ts | keep | K1 | critical | 10 -> 10 |
| packages/document/tests/animation-create.test.ts | partial | K1 | critical | 8 -> 7 |
| packages/document/tests/animation-facing-draw.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/animation-files.test.ts | keep | K3, S3 | critical, standard | 7 -> 7 |
| packages/document/tests/animation-frames.test.ts | keep | K1 | critical | 11 -> 11 |
| packages/document/tests/animation-split-strict.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/document/tests/animation-sprites.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/document/tests/animation-tags.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/document/tests/animation-tiles.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/document/tests/animation-undo.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/asset-digest.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/asset-guides.test.ts | keep | K3 | critical | 6 -> 6 |
| packages/document/tests/brush-commands.test.ts | keep | K1, K3 | critical | 5 -> 5 |
| packages/document/tests/cel-commands.test.ts | keep | K1 | critical | 13 -> 13 |
| packages/document/tests/cel-linked.test.ts | keep | K1 | critical | 14 -> 14 |
| packages/document/tests/cel-remap-order.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/cel-swap.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/document/tests/created-stamp.test.ts | keep | K1, K3 | critical | 7 -> 7 |
| packages/document/tests/diff-bounds.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/document/tests/engine-actor-report.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/document/tests/engine-atomic-batch.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/document/tests/engine-preview.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/document/tests/engine-rejection.test.ts | keep | S3 | standard | 10 -> 10 |
| packages/document/tests/engine-round-trip.test.ts | partial | K1, K2 | critical | 7 -> 5 |
| packages/document/tests/engine-step-blame.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/frame-add-delete.test.ts | keep | K1 | critical | 15 -> 15 |
| packages/document/tests/frame-persistence.test.ts | keep | K3 | critical | 3 -> 3 |
| packages/document/tests/frame-render.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/frame-reorder-update.test.ts | keep | K1 | critical | 13 -> 13 |
| packages/document/tests/geometry.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/document/tests/guide-commands.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/document/tests/history-limits.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/document/tests/ids.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/layer-add-delete.test.ts | keep | K1 | critical | 15 -> 15 |
| packages/document/tests/layer-duplicate-flatten.test.ts | keep | K1 | critical | 11 -> 11 |
| packages/document/tests/layer-merge.test.ts | keep | K1, S3 | critical, standard | 11 -> 11 |
| packages/document/tests/layer-tags-locks.test.ts | keep | K1, K3 | critical | 7 -> 7 |
| packages/document/tests/layer-update-reorder.test.ts | keep | K1 | critical | 14 -> 14 |
| packages/document/tests/map-copy-move.test.ts | keep | K1 | critical | 9 -> 9 |
| packages/document/tests/map-geometry.test.ts | keep | K1 | critical | 10 -> 10 |
| packages/document/tests/map-painting.test.ts | keep | K1, S3 | critical, standard | 17 -> 17 |
| packages/document/tests/map-write.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/document/tests/native-asset-v2.test.ts | partial | K3, K2 | critical | 17 -> 16 |
| packages/document/tests/native-migrations.test.ts | keep | K3 | critical | 4 -> 4 |
| packages/document/tests/native-open-checks.test.ts | keep | S3 | standard | 13 -> 13 |
| packages/document/tests/native-open-damage.test.ts | keep | S3 | standard | 5 -> 5 |
| packages/document/tests/native-round-trip.test.ts | partial | K3, K2 | critical | 8 -> 7 |
| packages/document/tests/native-sheet-tiles-v2.test.ts | keep | K3 | critical | 11 -> 11 |
| packages/document/tests/patch-frame-rgba.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/platform-id.test.ts | keep | K1, K3 | critical | 6 -> 6 |
| packages/document/tests/preset-commands.test.ts | keep | K1, K3 | critical | 15 -> 15 |
| packages/document/tests/retired-commands.test.ts | keep | K2 | critical | 2 -> 2 |
| packages/document/tests/rewrite-asset-links.test.ts | keep | K3 | critical | 4 -> 4 |
| packages/document/tests/saved-marker.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/document/tests/sheet-animation-move.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/sheet-animation.test.ts | keep | K1 | critical | 12 -> 12 |
| packages/document/tests/sheet-commands.test.ts | keep | K1 | critical | 26 -> 26 |
| packages/document/tests/slice-commands.test.ts | keep | K1 | critical | 8 -> 8 |
| packages/document/tests/snapshot-safety.test.ts | keep | K3 | critical | 2 -> 2 |
| packages/document/tests/sprite-collection.test.ts | keep | K1 | critical | 15 -> 15 |
| packages/document/tests/sprite-pixel-grid.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/sprite-platform.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/document/tests/sprite-reorder-sheet.test.ts | keep | K1 | critical | 6 -> 6 |
| packages/document/tests/sprite-symmetry.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/swatch-alpha.test.ts | keep | K1, K3 | critical | 7 -> 7 |
| packages/document/tests/tag-colour.test.ts | keep | K1, K3 | critical | 8 -> 8 |
| packages/document/tests/tag-commands.test.ts | keep | K1 | critical | 13 -> 13 |
| packages/document/tests/terrain-sets.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/document/tests/terrain.test.ts | keep | K1 | critical | 11 -> 11 |
| packages/document/tests/tile-collision.test.ts | keep | K1, K3 | critical | 7 -> 7 |
| packages/document/tests/tile-duplicate.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/tile-native.test.ts | partial | K3, S3 | critical, standard | 7 -> 5 |
| packages/document/tests/tile-playback.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/document/tests/tile-properties.test.ts | keep | K1 | critical | 10 -> 10 |
| packages/document/tests/tile-source.test.ts | keep | K1 | critical | 8 -> 8 |
| packages/document/tests/tile-undo.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/tilemap-bytes-cache.test.ts | keep | K1 | critical | 2 -> 2 |
| packages/document/tests/tilemap-import.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/tilemap-layer-copy.test.ts | keep | K1 | critical | 4 -> 4 |
| packages/document/tests/tilemap-layers.test.ts | keep | K1 | critical | 12 -> 12 |
| packages/document/tests/tilemap-orientation.test.ts | keep | K1, K3 | critical | 6 -> 6 |
| packages/document/tests/tileset-tiles.test.ts | keep | K1 | critical | 16 -> 16 |
| packages/document/tests/workspace-merge.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/document/tests/workspace-split.test.ts | keep | K3 | critical | 7 -> 7 |
| packages/document/tests/workspace-touched.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/project/tests/animation-role.test.ts | keep | K1 | critical | 3 -> 3 |
| packages/project/tests/containment.test.ts | keep | K4 | critical | 3 -> 3 |
| packages/project/tests/defaults.test.ts | keep | K1 | critical | 5 -> 5 |
| packages/project/tests/entry-kinds.test.ts | partial | K1 | critical | 4 -> 2 |
| packages/project/tests/folders.test.ts | keep | K4 | critical | 7 -> 7 |
| packages/project/tests/grant.test.ts | partial | K4 | critical | 8 -> 7 |
| packages/project/tests/ids.test.ts | partial | K1 | critical | 3 -> 2 |
| packages/project/tests/listing.test.ts | keep | K1 | critical | 7 -> 7 |
| packages/project/tests/manifest.test.ts | keep | K3, S3 | critical, standard | 10 -> 10 |
| packages/project/tests/migration.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/project/tests/pack.test.ts | keep | K3 | critical | 9 -> 9 |
| packages/project/tests/path-refusals.test.ts | keep | K4 | critical | 6 -> 6 |
| packages/project/tests/project-document.test.ts | partial | K2, K3 | critical | 9 -> 8 |
| packages/project/tests/project-export.test.ts | keep | K2 | critical | 8 -> 8 |
| packages/project/tests/project-file.test.ts | keep | K3, S3 | critical, standard | 10 -> 10 |
| packages/project/tests/project-organise.test.ts | keep | K2 | critical | 5 -> 5 |
| packages/project/tests/project-store.test.ts | keep | K1, K4 | critical | 9 -> 9 |
| packages/project/tests/swatch-sets.test.ts | keep | K1, K2 | critical | 15 -> 15 |

## Deleted cases and why

Most of these suites are K1 command and reducer tests, K3 round trips and K4 path and grant refusals, and passed the doubt question. The deletions are the cases another case already covers, or that test a constant.

- project/entry-kinds `covers every kind` (W5): checks the test's own table against a constant. The `it.each` of names stays as the K1 boundary.
- project/entry-kinds `shows every kind but other by default` (W5): asserts a constant equals its definition.
- project/ids `is deterministic for the same bytes` (W4): same input twice; the format cases already pin the output.
- project/grant `grants nothing from a manifest edited to say edit` (W4, K4 still covered): same decision as `is off, with the flag, when the manifest says edit and nothing is stored`.
- project/project-document `lists a role folder once and never the folder root` (W4): the `creates a new project` case already asserts the `roleFolders` order and the root exclusion.
- document/animation-create `undoes and redoes in one step` (W4): `animation.create` is in the `it.each` of animation-undo.
- document/native-asset-v2 `lists a distinct mime type, extension and progId for every kind` (W5): asserts a constant table.
- document/engine-round-trip `flattens heart frame 1 to the fixture rows` and `maps indices to rgba with a transparent slot 0` (W4): frame-render covers flatten and the index to colour mapping against an oracle.
- document/tile-native `opens a layer file of the wrong size ...` and `diagnoses cells whose key has no tile ...` (W4): the same two behaviors are tested in native-sheet-tiles-v2 (tilemap files); the damaged-checksum layer case stays here.
- document/native-round-trip `encodes a held state exactly as before 50 later strokes` (W4): snapshot-safety holds the same 50 strokes invariant.

## W1 and W2 rule candidates

None found. No test in these two folders reads source text or repeats a lint or type rule.

## Notes and doubts

- The vitest tags used here (`critical`, `standard`) must be declared in the config (`test.tags`) or vitest fails on an unknown tag. The root `vitest.config.ts` was not touched (outside the test files).
- Rejection-only describes (engine-rejection, map.paint guards, layer.merge rules, native open checks and damage) were classed S3 and tagged standard. If the owner wants command refusals in the critical gate, they flip to K4 or K1 with no other change.
- `document.bench.ts` is a bench, not a test; left as is.
