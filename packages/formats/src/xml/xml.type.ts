/* @layer core @kind types */
import type { FormatFailure } from '../failure/format.type';

type XmlNode = {
  readonly name: string;
  readonly attrs: Readonly<Record<string, string>>;
  readonly children: readonly XmlNode[];
  readonly text: string;
};

type XmlResult = { readonly ok: true; readonly root: XmlNode } | FormatFailure;

type OpenNode = {
  readonly name: string;
  readonly attrs: Record<string, string>;
  readonly children: OpenNode[];
  text: string;
};

export type { OpenNode, XmlNode, XmlResult };
