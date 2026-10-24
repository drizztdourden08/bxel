/* @layer core @kind constants */
const XML_LIMITS = {
  MAX_CHARS: 64 * 1024 * 1024,
  MAX_DEPTH: 64,
  MAX_NODES: 1_000_000,
} as const;

const XML_TOKEN =
  /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!\[CDATA\[([\s\S]*?)\]\]>|<![^>]*>|<\/([^\s>]+)\s*>|<([^\s/>!?]+)([^>]*?)(\/?)>|([^<]+)/y;

const XML_ATTRIBUTE = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

const XML_ENTITY = /&(#x[0-9a-fA-F]+|#[0-9]+|amp|lt|gt|quot|apos);/g;

const XML_NAMED: Readonly<Record<string, string>> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

const MAX_CODE_POINT = 0x10ffff;

export { MAX_CODE_POINT, XML_ATTRIBUTE, XML_ENTITY, XML_LIMITS, XML_NAMED, XML_TOKEN };
