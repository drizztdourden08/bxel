/* @layer core @kind logic */
import type { XmlNode } from '../xml/xml.type';
import type { Rec } from './rec.type';
import { xmlChild } from './xml-child';

const pointList = (text: string): Rec[] =>
  text
    .trim()
    .split(/\s+/)
    .filter((pair) => pair !== '')
    .map((pair) => {
      const [x, y] = pair.split(',');
      return { x: Number(x), y: Number(y) };
    });

const fromXmlObject = (node: XmlNode): Rec => {
  const polygon = xmlChild(node, 'polygon');
  return {
    ...node.attrs,
    ...(polygon ? { polygon: pointList(polygon.attrs['points'] ?? '') } : {}),
    ellipse: xmlChild(node, 'ellipse') !== undefined,
    point: xmlChild(node, 'point') !== undefined,
  };
};

export { fromXmlObject };
