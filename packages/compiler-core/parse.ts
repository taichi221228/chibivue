import {type ElementNode, NodeTypes, type TemplateChildNode} from "chibivue";

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

const parseChildren = (
  context: ParserContext,
  ancestors: ElementNode[],
): TemplateChildNode[] => {
  const nodes: TemplateChildNode[] = [];

  while (!isEnd(context, ancestors)) {
    const { source } = context;
    let node: TemplateChildNode | undefined;
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

const last = <T>(xs: T[]): T | undefined => xs[xs.length - 1];

export const baseParse = (
  content: string,
): { children: TemplateChildNode[] } => {
  // TODO:
  return { children: [] };
};
