/* @layer renderer-app @kind logic */
const documentOf = (node: Node | null | undefined): Document => node?.ownerDocument ?? document;

export { documentOf };
