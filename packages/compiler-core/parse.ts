import {
  type ElementNode,
  NodeTypes,
  type Position,
  type SourceLocation,
  type TemplateChildNode,
  type TextNode,
} from "chibivue";

export interface ParserContext {
  readonly originalSource: string;
  source: string;
  offset: number;
  line: number;
  column: number;
}

const createParserContext = (content: string): ParserContext => ({
  originalSource: content,
  source: content,
  offset: 0,
  line: 1,
  column: 1,
});

const parseText = (context: ParserContext): TextNode => {
  const start = getCursor(context);
  const endToken = "<";
  const index = context.source.indexOf(endToken, 1);

  let endIndex = context.source.length;
  if (index !== -1 && endIndex > index) endIndex = index;

  const content = parseTextData(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content,
    loc: getSelection(context, start),
  };
};
const parseTextData = (context: ParserContext, length: number): string => {
  advanceBy(context, length);
  return context.source.slice(0, length);
};

const enum TagType {
  Start,
  End,
}

const parseElement = (
  context: ParserContext,
  ancestors: ElementNode[],
): ElementNode | undefined => {
  const element = parseTag(context, TagType.Start);

  if (element.isSelfClosing) return element;

  ancestors.push(element);
  const children = parseChildren(context, ancestors);
  ancestors.pop();

  element.children = children;

  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End);
  }

  return element;
};

const parseTag = (context: ParserContext, type: TagType): ElementNode => {
  const start = getCursor(context);
  const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)!;
  const tag = match[1];

  let isSelfClosing = false;

  advanceBy(context, match[0].length);
  advanceSpaces(context);

  let props = parseAttributes(context, type);

  isSelfClosing = startsWith(context.source, "/>");

  advanceBy(context, isSelfClosing ? 2 : 1);

  return {
    type: NodeTypes.ELEMENT,
    tag,
    props,
    children: [],
    isSelfClosing,
    loc: getSelection(context, start),
  };
};

const parseChildren = (
  context: ParserContext,
  ancestors: ElementNode[],
): TemplateChildNode[] => {
  const nodes: TemplateChildNode[] = [];

  while (!isEnd(context, ancestors)) {
    const { source } = context;
    let node: TemplateChildNode | undefined = undefined;

    if (source[0] === "<") {
      if (/[a-z]/i.test(source[1])) {
        node = parseElement(context, ancestors);
      }
    }

    if (!node) node = parseText(context);

    pushNode(nodes, node);
  }

  return nodes;
};

const isEnd = (context: ParserContext, ancestors: ElementNode[]): boolean => {
  const { source } = context;
  if (startsWith(source, "</")) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      if (startsWithEndTagOpen(source, ancestors[i].tag)) return true;
    }
  }

  return !source;
};

const startsWith = (source: string, searchString: string): boolean =>
  source.startsWith(searchString);
const startsWithEndTagOpen = (source: string, tag: string): boolean =>
  startsWith(source, "</") &&
  source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase() &&
  /[\t\r\n\f />]/.test(source[2 + tag.length] || ">");

const pushNode = (
  nodes: TemplateChildNode[],
  node: TemplateChildNode,
): void => {
  if (node.type === NodeTypes.TEXT) {
    const prev = last(nodes);
    if (prev && prev.type === NodeTypes.TEXT) {
      prev.content += node.content;
      return;
    }
  }

  nodes.push(node);
};

const advanceBy = (
  context: ParserContext,
  numberOfCharacters: number,
): void => {
  const { source } = context;
};
const advanceSpaces = (context: ParserContext): void => {
};
const advancePositionWithMutation = (
  position: Position,
  source: string,
  numberOfCharacters: number,
): Position => {
  const NEW_LINE_CHAR_CODE = 10;
  let linesCount = 0;
  let lastNewLinePosition = -1;

  for (let i = 0; i < numberOfCharacters; i++) {
    if (source.charCodeAt(i) === NEW_LINE_CHAR_CODE) {
      linesCount++;
      lastNewLinePosition = i;
    }
  }

  position.offset += numberOfCharacters;
  position.line += linesCount;
  position.column = lastNewLinePosition === -1
    ? position.column + numberOfCharacters
    : numberOfCharacters - lastNewLinePosition;

  return position;
};

const getCursor = ({ offset, line, column }: ParserContext): Position => ({
  offset,
  line,
  column,
});
const getSelection = (
  context: ParserContext,
  start: Position,
  end?: Position,
): SourceLocation => {
  end = end ?? getCursor(context);
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset),
  };
};

const last = <T>(xs: T[]): T | undefined => xs[xs.length - 1];

export const baseParse = (
  content: string,
): { children: TemplateChildNode[] } => {
  // TODO:
  return { children: [] };
};
