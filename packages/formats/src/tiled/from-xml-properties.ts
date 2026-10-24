/* @layer core @kind logic */
import type { XmlNode } from '../xml/xml.type';
import type { Rec } from './rec.type';
import { xmlChild } from './xml-child';
import { xmlChildren } from './xml-children';

const fromXmlProperties = (node: XmlNode): Rec[] => {
  const holder = xmlChild(node, 'properties');
  if (!holder) return [];
  return xmlChildren(holder, 'property').map((property) => ({
    name: property.attrs['name'],
    type: property.attrs['type'] ?? 'string',
    value: property.attrs['value'] ?? property.text,
  }));
};

export { fromXmlProperties };
