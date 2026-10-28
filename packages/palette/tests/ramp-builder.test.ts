/* @layer tests @kind test */
import { buildRamp, clampOklch, gradientBetween, hexToOklch, oklchToHex, RAMP_DEFAULTS } from '@bxel/palette';
import { describe, expect, it } from 'vitest';

const BASE = '#4a7a3c';

const options = { base: BASE, light: 3, dark: 3, hueShift: 15, hueMode: 'shift' as const, chromaCurve: true, snap: 0, existing: [] };

describe('oklab and oklch conversion', () => {
  it('round trips a colour through oklch', () => {
    for (const hex of ['#000000', '#ffffff', BASE, '#e0a030', '#1d2b53']) {
      const lch = hexToOklch(hex);
      expect(lch).not.toBeNull();
      if (lch) expect(oklchToHex(lch)).toBe(hex);
    }
  });

  it('reads white as lightness 1 and black as 0', () => {
    expect(hexToOklch('#ffffff')?.l).toBeCloseTo(1, 3);
    expect(hexToOklch('#000000')?.l).toBeCloseTo(0, 3);
  });

  it('clamps an out of gamut colour to the same lightness and hue', () => {
    const wild = { l: 0.7, c: 0.5, h: 150 };
    const kept = clampOklch(wild);
    expect(kept.l).toBe(0.7);
    expect(kept.h).toBe(150);
    expect(kept.c).toBeLessThan(0.5);
    expect(kept.c).toBeGreaterThan(0);
  });
});

describe('buildRamp', () => {
  it('gives 7 steps with rising lightness, warm lights and cool shadows', () => {
    const ramp = buildRamp(options);
    if (!ramp) throw new Error('the ramp was not built');
    const lightness = ramp.steps.map((each) => each.l);
    expect(lightness).toEqual([...lightness].sort((first, second) => first - second));
    expect(new Set(lightness).size).toBe(7);
    const base = hexToOklch(BASE)?.h ?? 0;
    const hues = ramp.steps.map((each) => each.h);
    expect(ramp.steps[3]?.hex).toBe(BASE);
    expect(hues[6]).toBeLessThan(base);
    expect(hues[0]).toBeGreaterThan(base);
    expect(ramp.added).toBe(7);
  });

  it('keeps the hue when the ramp is straight', () => {
    const ramp = buildRamp({ ...options, hueMode: 'straight', chromaCurve: false });
    const base = hexToOklch(BASE)?.h ?? 0;
    for (const step of ramp?.steps ?? []) expect(Math.abs(step.h - base)).toBeLessThan(4);
  });

  it('reuses the base swatch and a swatch within the snap distance', () => {
    const plain = buildRamp(options);
    const near = plain?.steps[5]?.hex ?? '#000000';
    const ramp = buildRamp({ ...options, baseIndex: 2, snap: RAMP_DEFAULTS.snap, existing: [{ index: 2, hex: BASE }, { index: 7, hex: near }] });
    expect(ramp?.steps[3]?.reuses).toBe(2);
    expect(ramp?.steps[5]?.reuses).toBe(7);
    expect(ramp?.added).toBe(5);
  });

  it('refuses a base that is not a colour', () => {
    expect(buildRamp({ ...options, base: 'moss' })).toBeNull();
  });
});

describe('gradientBetween', () => {
  it('fills the steps between two colours in rising lightness', () => {
    const steps = gradientBetween('#1d2b53', '#fff1e8', 3);
    expect(steps).toHaveLength(3);
    const lightness = steps.map((hex) => hexToOklch(hex)?.l ?? 0);
    expect(lightness[1] ?? 0).toBeGreaterThan(lightness[0] ?? 1);
    expect(lightness[2] ?? 0).toBeGreaterThan(lightness[1] ?? 1);
  });
});
