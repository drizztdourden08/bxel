/* @layer core @kind logic */
const resolveLinkPath = (from: string, link: string): string => {
  const parts = from.split('/').slice(0, -1);
  for (const segment of link.split('/')) {
    if (segment === '..') parts.pop();
    else if (segment !== '' && segment !== '.') parts.push(segment);
  }
  return parts.join('/');
};

export { resolveLinkPath };
