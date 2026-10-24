/* @layer core @kind logic */
import type { XmlNode } from '../xml/xml.type';
import { fromXmlObject } from './from-xml-object';
import { fromXmlProperties } from './from-xml-properties';
import type { Rec } from './rec.type';
import { xmlChild } from './xml-child';
import { xmlChildren } from './xml-children';

const fromXmlTile = (node: XmlNode): Rec => {
  const image = xmlChild(node, 'image');
  const group = xmlChild(node, 'objectgroup');
  return {
    id: node.attrs['id'],
    ...(image
      ? { image: image.attrs['source'], imagewidth: image.attrs['width'], imageheight: image.attrs['height'] }
      : {}),
    ...(group ? { objectgroup: { objects: xmlChildren(group, 'object').map(fromXmlObject) } } : {}),
    properties: fromXmlProperties(node),
  };
};

export { fromXmlTile };
