/* @layer core @kind logic */
const parseJsonText = (text: string): { readonly value: unknown } | undefined => {
  try {
    const value: unknown = JSON.parse(text);
    return { value };
  } catch {
    return undefined;
  }
};

export { parseJsonText };
