export const enum NodeTypes {
  TEXT,
  ELEMENT,
  ATTRIBUTE,
  INTERPOLATION,
  DIRECTIVE,
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
  location: SourceLocation;
}

export interface TextNode extends Node {
  type: NodeTypes.TEXT;
  content: string;
}

export interface ElementNode extends Node {
  type: NodeTypes.ELEMENT;
  tag: string;
  properties: (AttributeNode | DirectiveNode)[];
  children: TemplateChildNode[];
  isSelfClosing: boolean;
}

export interface AttributeNode extends Node {
  type: NodeTypes.ATTRIBUTE;
  name: string;
  value: TextNode | undefined;
}

export interface InterpolationNode extends Node {
  type: NodeTypes.INTERPOLATION;
  content: string;
}

export interface DirectiveNode extends Node {
  type: NodeTypes.DIRECTIVE;
  name: string;
  argument: string;
  expression: string;
}

export type TemplateChildNode = TextNode | ElementNode | InterpolationNode;
