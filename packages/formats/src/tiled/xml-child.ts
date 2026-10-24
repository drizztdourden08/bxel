/* @layer core @kind logic */
import type { XmlNode } from '../xml/xml.type';

const xmlChild = (node: XmlNode, name: string): XmlNode | undefined => node.children.find((child) => child.name === name);

export { xmlChild };
