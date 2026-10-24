/* @layer core @kind logic */
import type { XmlNode } from '../xml/xml.type';
import { fromXmlTile } from './from-xml-tile';
import type { Rec } from './rec.type';
import { xmlChild } from './xml-child';
import { xmlChildren } from './xml-children';

const fromXmlTileset = (node: XmlNode): Rec => {
  const image = xmlChild(node, 'image');
  return {
    ...node.attrs,
    ...(image
      ? {
          image: image.attrs['source'],
          imagewidth: image.attrs['width'],
          imageheight: image.attrs['height'],
          transparentcolor: image.attrs['trans'],
        }
      : {}),
    tiles: xmlChildren(node, 'tile').map(fromXmlTile),
  };
};

export { fromXmlTileset };
