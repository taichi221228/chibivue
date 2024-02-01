export const enum NodeTypes {
  TEXT,
  ELEMENT,
  ATTRIBUTE,
}

export interface Position {
  offset: number;
  line: number;
  column: number;
}
export interface SourceLocation {
  start: Position;
  end: Position;
  source: string;
}

export interface Node {
  type: NodeTypes;
  loc: SourceLocation;
}

export interface TextNode extends Node {
  type: NodeTypes.TEXT;
  content: string;
}

export interface ElementNode extends Node {
  type: NodeTypes.ELEMENT;
  tag: string;
  props: AttributeNode[];
  children: TemplateChildNode[];
  isSelfClosing: boolean;
}

export interface AttributeNode extends Node {
  type: NodeTypes.ATTRIBUTE;
  name: string;
  value: TextNode | undefined;
}

export type TemplateChildNode = TextNode | ElementNode;
