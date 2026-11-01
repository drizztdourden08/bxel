/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { edgeScrollStep } from '../../src/views/TimelinePanel/behavior/edge-scroll-step';

const bounds = { x: 0, y: 0, width: 400, height: 100 };

describe('K1 scrolling the track when a drag reaches its edge', { tags: ['critical'] }, () => {
  it('scrolls left near the left edge and right near the right edge, faster the closer it gets', () => {
    expect(edgeScrollStep({ x: 4, y: 50 }, bounds)).toBeLessThan(0);
    expect(edgeScrollStep({ x: 396, y: 50 }, bounds)).toBeGreaterThan(0);
    expect(Math.abs(edgeScrollStep({ x: 2, y: 50 }, bounds))).toBeGreaterThan(Math.abs(edgeScrollStep({ x: 24, y: 50 }, bounds)));
  });

  it('stays still in the middle and when the pointer is above or below the track', () => {
    expect(edgeScrollStep({ x: 200, y: 50 }, bounds)).toBe(0);
    expect(edgeScrollStep({ x: 4, y: -20 }, bounds)).toBe(0);
    expect(edgeScrollStep({ x: 396, y: 140 }, bounds)).toBe(0);
  });
});
