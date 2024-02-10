import {
  type AttributeNode,
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

type AttributeValue = {
  content: string;
  loc: SourceLocation;
} | undefined;

const createParserContext = (content: string): ParserContext => ({
  originalSource: content,
  source: content,
  offset: 0,
  line: 1,
  column: 1,
});

const parseText = (context: ParserContext): TextNode => {
  const endToken = "<";
  const index = context.source.indexOf(endToken, 1);

  let endIndex = context.source.length;
  if (index !== -1 && endIndex > index) endIndex = index;

  const start = getCursor(context);
  const content = parseTextData(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content,
    loc: getSelection(context, start),
  };
};
const parseTextData = (context: ParserContext, length: number): string => {
  const rawText = context.source.slice(0, length);
  advanceBy(context, length);
  return rawText;
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

  advanceBy(context, match[0].length);
  advanceSpaces(context);

  let props = parseAttributes(context, type);
  let isSelfClosing;

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

const parseAttributes = (
  context: ParserContext,
  type: TagType,
): AttributeNode[] => {
  const props = [];
  const attributeNames = new Set<string>();

  while (
    context.source.length > 0 &&
    !startsWith(context.source, ">") &&
    !startsWith(context.source, "/>")
  ) {
    const attribute = parseAttribute(context, attributeNames);

    if (type === TagType.Start) props.push(attribute);

    advanceSpaces(context);
  }

  return props;
};
const parseAttribute = (
  context: ParserContext,
  nameSet: Set<string>,
): AttributeNode => {
  const start = getCursor(context);
  const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)!;
  const [name] = match;

  nameSet.add(name);

  advanceBy(context, name.length);

  let value: AttributeValue = undefined;

  if (/^[\t\r\n\f ]*=/.test(context.source)) {
    advanceSpaces(context);
    advanceBy(context, 1);
    advanceSpaces(context);
    value = parseAttributeValue(context);
  }

  const loc = getSelection(context, start);

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value: value && {
      type: NodeTypes.TEXT,
      content: value.content,
      loc: value.loc,
    },
    loc,
  };
};
const parseAttributeValue = (context: ParserContext): AttributeValue => {
  const start = getCursor(context);
  const [quote] = context.source;
  const isQuoted = quote === `"` || quote === `'`;

  let content: string;

  if (isQuoted) {
    advanceBy(context, 1);

    const endIndex = context.source.indexOf(quote);
    if (endIndex === -1) {
      content = parseTextData(context, context.source.length);
    } else {
      content = parseTextData(context, endIndex);
      advanceBy(context, 1);
    }
  } else {
    const [head] = /^[^\t\r\n\f >]+/.exec(context.source) ?? [];
    if (!head) return undefined;
    content = parseTextData(context, head.length);
  }

  return { content, loc: getSelection(context, start) };
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
      if (/[a-z]/i.test(source[1])) node = parseElement(context, ancestors);
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
  advancePositionWithMutation(context, source, numberOfCharacters);
  context.source = source.slice(numberOfCharacters);
};
const advanceSpaces = (context: ParserContext): void => {
  const match = /^[\t\r\n\f ]+/.exec(context.source);
  if (match) advanceBy(context, match[0].length);
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
  const context = createParserContext(content);
  const children = parseChildren(context, []);
  return { children };
};
