/* @layer core @kind logic */
import type { XmlNode } from '../xml/xml.type';
import { fromXmlLayer } from './from-xml-layer';
import { fromXmlTileset } from './from-xml-tileset';
import type { Rec } from './rec.type';
import { xmlChildren } from './xml-children';

const fromXmlMap = (node: XmlNode): Rec => ({
  ...node.attrs,
  tilesets: xmlChildren(node, 'tileset').map(fromXmlTileset),
  layers: node.children.flatMap((child) => fromXmlLayer(child) ?? []),
});

export { fromXmlMap };
