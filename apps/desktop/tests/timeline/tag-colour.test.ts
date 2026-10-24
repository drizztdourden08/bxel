/* @layer renderer-app @kind test */
import * as React from 'react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { addTag } from '../../src/timeline/add-tag';
import { setTagColour } from '../../src/timeline/set-tag-colour';
import { TAG_COLOUR_CHOICES } from '../../src/timeline/tag-colour.constants';
import { tagLanes } from '../../src/timeline/tag-lanes';
import { TagColours } from '../../src/views/TimelinePanel/sub-components/TagColours';
import { gridHtml } from './grid-html';
import { freshDocument, live, pickRange, revision, withFrames } from './timeline-harness';

Object.assign(globalThis, { React });

beforeEach(freshDocument);

const tags = () => live().sprite.tags;

const firstTag = () => {
  const tag = tags()[0];
  if (!tag) throw new Error('no tag');
  return tag;
};

const tagged = (): void => {
  withFrames(3);
  pickRange(0, 1);
  addTag();
};

describe('tag colour', () => {
  it('sets a colour as one undo step and clears it', () => {
    tagged();
    const before = revision();
    expect(setTagColour(firstTag().id, '#6f9cf0')).toBe(true);
    expect(firstTag().colour).toBe('#6f9cf0');
    expect(revision()).toBe(before + 1);
    stepHistory('undo');
    expect(firstTag().colour).toBeUndefined();
    setTagColour(firstTag().id, '#6f9cf0');
    expect(setTagColour(firstTag().id, null)).toBe(true);
    expect(Object.keys(firstTag())).not.toContain('colour');
  });

  it('starts a new tag with no colour', () => {
    tagged();
    expect(Object.keys(firstTag())).not.toContain('colour');
  });

  it('falls back to the hue by order until a colour is saved', () => {
    tagged();
    const plain = tagLanes(live().sprite, null)[0]?.find((cell) => cell !== null);
    expect(plain).toMatchObject({ colour: 'rose', custom: null });
    setTagColour(firstTag().id, '#a78bf5');
    const saved = tagLanes(live().sprite, null)[0]?.find((cell) => cell !== null);
    expect(saved).toMatchObject({ colour: 'rose', custom: '#a78bf5' });
  });

  it('paints the bar with the saved colour', () => {
    tagged();
    expect(gridHtml()).not.toContain('data-colour="custom"');
    setTagColour(firstTag().id, '#a78bf5');
    const html = gridHtml();
    expect(html).toContain('data-colour="custom"');
    expect(html).toContain('--tag-line:#a78bf5');
    expect(html).toContain('color-mix(in srgb, #a78bf5 16%, transparent)');
  });

  it('offers every tag colour by name and the automatic colour only when one is saved', () => {
    tagged();
    const plain = renderToString(createElement(TagColours, { tag: firstTag() }));
    for (const choice of TAG_COLOUR_CHOICES) expect(plain).toContain(`aria-label="${choice.name} tag colour"`);
    expect(plain.match(/aria-pressed="true"/g)).toBeNull();
    expect(plain).toContain('Automatic colour');
    expect(plain).toContain('disabled=""');
    setTagColour(firstTag().id, '#a78bf5');
    const saved = renderToString(createElement(TagColours, { tag: firstTag() }));
    expect(saved.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(saved).not.toContain('disabled=""');
  });
});
