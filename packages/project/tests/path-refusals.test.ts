/* @layer tests @kind test */
import { checkFileName, joinInside, PROJECT_ERROR_CODE } from '@bxel/project';
import type { FileKind } from '@bxel/project';
import { describe, expect, it } from 'vitest';

const ROOT = 'C:/Games/Dungeon';
const { NAME_INVALID, PATH_INVALID, PATH_NOT_ALLOWED } = PROJECT_ERROR_CODE;

const segmentsOf = (count: number): string => Array.from({ length: count }, () => 'a').join('/');

const REFUSED: readonly (readonly [string, FileKind, string])[] = [
  ['../x.bxel', 'bxel', PATH_INVALID],
  ['sprites\\x.bxel', 'bxel', PATH_INVALID],
  ['a/./b.bxel', 'bxel', PATH_INVALID],
  ['a/../b.bxel', 'bxel', PATH_INVALID],
  ['a//b.bxel', 'bxel', PATH_INVALID],
  ['/x.bxel', 'bxel', PATH_INVALID],
  ['C:/x.bxel', 'bxel', PATH_INVALID],
  ['a/b:stream.bxel', 'bxel', PATH_INVALID],
  ['sprites/', 'bxel', PATH_INVALID],
  ['', 'bxel', PATH_INVALID],
  [`${segmentsOf(16)}/x.bxel`, 'bxel', PATH_INVALID],
  [`${'a'.repeat(120)}/${'b'.repeat(120)}.bxel`, 'bxel', PATH_INVALID],
  ['nul.bxel', 'bxel', NAME_INVALID],
  ['NUL.bxel', 'bxel', NAME_INVALID],
  ['sprites/aux.bxel', 'bxel', NAME_INVALID],
  ['con/x.bxel', 'bxel', NAME_INVALID],
  ['lpt9.bxel', 'bxel', NAME_INVALID],
  ['com1.tar.bxel', 'bxel', NAME_INVALID],
  ['x.bxel.', 'bxel', NAME_INVALID],
  ['x.bxel ', 'bxel', NAME_INVALID],
  [' x.bxel', 'bxel', NAME_INVALID],
  ['sprites /x.bxel', 'bxel', NAME_INVALID],
  ['CON.png', 'png', NAME_INVALID],
  ['x.png', 'bxel', NAME_INVALID],
  ['x', 'bxel', NAME_INVALID],
  ['x?.bxel', 'bxel', NAME_INVALID],
  ['x*.bxel', 'bxel', NAME_INVALID],
  [`${'a'.repeat(60)}.bxel`, 'bxel', NAME_INVALID],
  ['project-a.bxelproject', 'bxel', PATH_NOT_ALLOWED],
  ['PROJECT.BXELPROJECT', 'bxel', PATH_NOT_ALLOWED],
  ['sprites/.hidden.bxel', 'bxel', PATH_NOT_ALLOWED],
  ['sprites/x.tmp-1a2b.bxel', 'bxel', PATH_NOT_ALLOWED],
  ['.bxelproject', 'bxel', PATH_NOT_ALLOWED],
];

const ACCEPTED: readonly (readonly [string, FileKind])[] = [
  ['hero.bxel', 'bxel'],
  ['sprites/hero.bxel', 'bxel'],
  ['sprites/my hero_2-final.v2.bxel', 'bxel'],
  ['exports/hero.png', 'png'],
  ['exports/hero.png', 'apng'],
  ['exports/hero.apng', 'apng'],
  ['exports/hero.gif', 'gif'],
  ['sheets/hero.json', 'sheet'],
  ['dawnbringer-16.gpl', 'palette'],
  ['com10.bxel', 'bxel'],
  ['console.bxel', 'bxel'],
  [`${segmentsOf(15)}/x.bxel`, 'bxel'],
];

describe('path refusals', () => {
  it.each(REFUSED)('refuses %j as a %s write target with %s', (relPath, kind, code) => {
    const result = joinInside(ROOT, relPath, kind);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe(code);
  });

  it.each(ACCEPTED)('accepts %j as a %s write target', (relPath, kind) => {
    expect(joinInside(ROOT, relPath, kind)).toEqual({ ok: true, value: `${ROOT}/${relPath}` });
  });

  it('allows a reserved looking folder path to be read as a plain path only when it is clean', () => {
    expect(joinInside(ROOT, 'sprites/new')).toEqual({ ok: true, value: `${ROOT}/sprites/new` });
    expect(joinInside(ROOT, 'sprites/..')).toMatchObject({ ok: false, code: PATH_INVALID });
    expect(joinInside(ROOT, 'nul/x')).toMatchObject({ ok: false, code: NAME_INVALID });
  });

  it('refuses a folder that is not absolute', () => {
    expect(joinInside('Games/Dungeon', 'x.bxel', 'bxel')).toMatchObject({ ok: false, code: PATH_INVALID });
  });

  it('joins under a drive root and a posix root', () => {
    expect(joinInside('C:\\', 'x.bxel', 'bxel')).toEqual({ ok: true, value: 'C:/x.bxel' });
    expect(joinInside('/home/art/', 'x.bxel', 'bxel')).toEqual({ ok: true, value: '/home/art/x.bxel' });
  });
});

describe('file names', () => {
  it.each([
    ['..\\x.png', 'png', NAME_INVALID],
    ['../x.png', 'png', NAME_INVALID],
    ['a/b.png', 'png', NAME_INVALID],
    ['x:y.png', 'png', NAME_INVALID],
    ['x.PNG', 'png', NAME_INVALID],
    ['nul.png', 'png', NAME_INVALID],
    ['..', 'png', NAME_INVALID],
    ['x.bxelproject', 'bxel', PATH_NOT_ALLOWED],
    ['.x.png', 'png', PATH_NOT_ALLOWED],
  ] as const)('refuses %j as a %s file name with %s', (name, kind, code) => {
    expect(checkFileName(name, kind)).toMatchObject({ ok: false, code });
  });

  it('accepts a plain name with the right extension', () => {
    expect(checkFileName('idle 01.png', 'png')).toEqual({ ok: true, value: 'idle 01.png' });
  });
});
