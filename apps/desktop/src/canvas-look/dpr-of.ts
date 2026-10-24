/* @layer renderer-app @kind logic */
const dprOf = (element: Element): number => element.ownerDocument.defaultView?.devicePixelRatio ?? 1;

export { dprOf };
