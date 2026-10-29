/* @layer core @kind logic */
const orderSpan = <Span extends { readonly from: string; readonly to: string }>(span: Span, position: ReadonlyMap<string, number>): Span => {
  const from = position.get(span.from) ?? 0;
  const to = position.get(span.to) ?? 0;
  return from > to ? { ...span, from: span.to, to: span.from } : span;
};

export { orderSpan };
