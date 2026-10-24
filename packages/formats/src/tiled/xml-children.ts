/* @layer core @kind logic */
import type { XmlNode } from '../xml/xml.type';

const xmlChildren = (node: XmlNode, name: string): readonly XmlNode[] => node.children.filter((child) => child.name === name);

export { xmlChildren };
