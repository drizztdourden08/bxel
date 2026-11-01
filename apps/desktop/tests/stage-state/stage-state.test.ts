/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import type { HealthReport, HealthState, LinkFinding } from '../../src/project-health/project-health.type';
import { brokenLinksOf } from '../../src/stage-state/broken-links-of';
import { stageStateOf } from '../../src/stage-state/stage-state-of';
import type { StageFault, StageStateInput } from '../../src/stage-state/stage-state.type';
import type { LinkIndex } from '../../src/workspace/link-index.type';

const finding = (patch: Partial<LinkFinding> = {}): LinkFinding => ({
  fix: 'f1',
  file: 'C:/proj/run.bxanim',
  fileName: 'run.bxanim',
  fileKind: 'animation',
  linkId: 'link-1',
  targetName: 'hero.bxsprite',
  targetKind: 'sprite',
  lastPath: 'sprites/hero.bxsprite',
  state: 'missing',
  foundPath: null,
  candidates: [],
  ...patch,
});

const input = (patch: Partial<StageStateInput> = {}): StageStateInput => ({
  surface: 'pixel',
  loading: null,
  opening: false,
  fault: null,
  broken: [],
  ...patch,
});

const fault: StageFault = { message: 'It is damaged.', action: { kind: 'openPath', path: 'C:/proj/bad.bxsprite' } };

const index: LinkIndex = { files: [], links: [], duplicates: [] };

const ready = (broken: readonly LinkFinding[]): HealthState => {
  const report: HealthReport = { broken, moved: [], unused: [], misplaced: [], duplicates: [], unsaved: 0, access: [], capped: [], total: broken.length, files: 1 };
  return { status: 'ready', report, index };
};

describe('K1 the state of the stage', { tags: ['critical'] }, () => {
  it('is ready when a file is open and nothing is wrong', () => {
    expect(stageStateOf(input())).toEqual({ kind: 'ready' });
  });

  it('shows a ring with the share loaded while a project opens', () => {
    expect(stageStateOf(input({ surface: 'none', loading: { done: 1, total: 4 } }))).toEqual({ kind: 'loading', progress: 0.25, done: 1, total: 4 });
  });

  it('shows an endless ring while a single file opens', () => {
    expect(stageStateOf(input({ surface: 'none', opening: true }))).toMatchObject({ kind: 'loading', progress: null });
  });

  it('shows the error with its retry action when nothing is open and the last open failed', () => {
    expect(stageStateOf(input({ surface: 'none', fault }))).toEqual({ kind: 'error', fault });
  });

  it('keeps showing the open file when an earlier open failed', () => {
    expect(stageStateOf(input({ fault }))).toEqual({ kind: 'ready' });
  });

  it('shows the placeholder when the open file has a missing link', () => {
    const links = [finding()];
    expect(stageStateOf(input({ broken: links }))).toEqual({ kind: 'missing', links });
  });
});

describe('K1 the missing links of the open file', { tags: ['critical'] }, () => {
  it('lists the broken sprite links of an animation by its path', () => {
    const found = brokenLinksOf(ready([finding(), finding({ file: 'C:/proj/other.bxanim', linkId: 'link-2' })]), 'animation', 'C:/proj/run.bxanim');
    expect(found.map((each) => each.linkId)).toEqual(['link-1']);
  });

  it('ignores sprites, sheets and palettes, and links that are not sprites or tilesets', () => {
    const health = ready([finding({ targetKind: 'palette' })]);
    expect(brokenLinksOf(health, 'animation', 'C:/proj/run.bxanim')).toEqual([]);
    expect(brokenLinksOf(ready([finding()]), 'sprite', 'C:/proj/run.bxanim')).toEqual([]);
    expect(brokenLinksOf(ready([finding()]), 'sheet', 'C:/proj/run.bxanim')).toEqual([]);
  });

  it('finds nothing until the health scan is ready or when the file has no path', () => {
    expect(brokenLinksOf({ status: 'scanning' }, 'animation', 'C:/proj/run.bxanim')).toEqual([]);
    expect(brokenLinksOf(ready([finding()]), 'animation', undefined)).toEqual([]);
  });
});
