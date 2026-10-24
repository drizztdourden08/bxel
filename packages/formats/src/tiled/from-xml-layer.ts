/* @layer core @kind logic */
import type { XmlNode } from '../xml/xml.type';
import type { Rec } from './rec.type';
import { XML_LAYER_TYPE } from './tiled.constants';
import { xmlChild } from './xml-child';
import { xmlChildren } from './xml-children';

const dataOf = (node: XmlNode): Rec => {
  const data = xmlChild(node, 'data');
  if (!data) return {};
  const tiles = xmlChildren(data, 'tile');
  const body = tiles.length > 0 ? tiles.map((tile) => Number(tile.attrs['gid'] ?? 0)) : data.text.trim();
  return { data: body, encoding: data.attrs['encoding'], compression: data.attrs['compression'] };
};

const fromXmlLayer = (node: XmlNode): Rec | null => {
  const type = XML_LAYER_TYPE[node.name];
  if (type === undefined) return null;
  const nested = type === 'group' ? { layers: node.children.flatMap((child) => fromXmlLayer(child) ?? []) } : {};
  return { ...node.attrs, type, ...dataOf(node), ...nested };
};

export { fromXmlLayer };
