/* @layer tests @kind test */
import { parseXml } from '@bxel/formats';
import { describe, expect, it } from 'vitest';

describe('parseXml', () => {
  it('reads elements, attributes and text', () => {
    const result = parseXml('<?xml version="1.0"?><!-- note --><map width="2" name="a &amp; b"><data>1,2</data><tile gid=\'5\'/></map>');
    if (!result.ok) throw new Error(result.message);
    expect(result.root.name).toBe('map');
    expect(result.root.attrs).toEqual({ width: '2', name: 'a & b' });
    expect(result.root.children.map((child) => child.name)).toEqual(['data', 'tile']);
    expect(result.root.children[0]?.text).toBe('1,2');
    expect(result.root.children[1]?.attrs['gid']).toBe('5');
  });

  it('keeps CDATA and numeric entities', () => {
    const result = parseXml('<a><![CDATA[x < y]]>&#65;&#x42;</a>');
    if (!result.ok) throw new Error(result.message);
    expect(result.root.text).toBe('x < yAB');
  });

  it('refuses a mismatched or unfinished file', () => {
    expect(parseXml('<a><b></a>').ok).toBe(false);
    expect(parseXml('<a>').ok).toBe(false);
    expect(parseXml('<a/><b/>').ok).toBe(false);
    expect(parseXml('plain').ok).toBe(false);
  });

  it('refuses a document nested past the depth limit', () => {
    const deep = `${'<a>'.repeat(80)}${'</a>'.repeat(80)}`;
    expect(parseXml(deep).ok).toBe(false);
  });
});
