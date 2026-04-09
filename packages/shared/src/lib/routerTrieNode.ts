class RouterTrieNode {
  children: Record<string, RouterTrieNode>;
  methodHandlers: Record<string, Function>;
  isParam: boolean;
  isWildcard: boolean;
  paramName: string | null;

  constructor() {
    this.children = Object.create(null);
    this.methodHandlers = Object.create(null);
    this.isParam = false;
    this.isWildcard = false;
    this.paramName = null;
  }
}

export default RouterTrieNode;
