/* @layer core @kind logic */
import { readAttributes } from './read-attributes';
import { XML_LIMITS } from './xml.constants';
import type { OpenNode } from './xml.type';
import type { XmlState } from './xml-state.type';

const openTag = (state: XmlState, name: string, attributes: string, selfClosing: boolean): string | null => {
  state.count += 1;
  if (state.count > XML_LIMITS.MAX_NODES || state.stack.length >= XML_LIMITS.MAX_DEPTH) return 'The XML file is too large or too deep.';
  const node: OpenNode = { name, attrs: readAttributes(attributes), children: [], text: '' };
  const parent = state.stack.at(-1);
  if (parent) parent.children.push(node);
  else if (state.root === null) state.root = node;
  else return 'The XML file has more than one root element.';
  if (!selfClosing) state.stack.push(node);
  return null;
};

export { openTag };
