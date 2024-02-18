import {
  type ElementNode,
  NodeTypes,
  type SourceLocation,
} from "../compiler-core";

import { type TemplateCompiler } from "./compileTemplate";

import * as CompilerDOM from "../compiler-dom";

export interface SFCDescriptor {
  id: string;
  fileName: string;
  source: string;
  template: SFCTemplateBlock | null;
  script: SFCScriptBlock | null;
  styles: SFCStyleBlock[];
}

export interface SFCBlock {
  type: string;
  content: string;
  location: SourceLocation;
}

export interface SFCTemplateBlock extends SFCBlock {
  type: "template";
}

export interface SFCScriptBlock extends SFCBlock {
  type: "script";
}

export interface SFCStyleBlock extends SFCBlock {
  type: "style";
}

export interface SFCParseOptions {
  fileName?: string;
  sourceRoot?: string;
  compiler?: TemplateCompiler;
}

export interface SFCParseResult {
  descriptor: SFCDescriptor;
}

export const DEFAULT_FILENAME = "anonymous.vue";

export const parse = (
  source: string,
  { fileName = DEFAULT_FILENAME, compiler = CompilerDOM }: SFCParseOptions,
): SFCParseResult => {
  const descriptor: SFCDescriptor = {
    id: undefined!,
    fileName,
    source,
    template: null,
    script: null,
    styles: [],
  };

  const ast = compiler.parse(source);
  ast.children.forEach((node) => {
    if (node.type !== NodeTypes.ELEMENT) return;

    switch (node.tag) {
      case "template": {
        descriptor.template = createBlock(
          node,
          source,
        ) as SFCTemplateBlock;
        break;
      }
      case "script": {
        descriptor.script = createBlock(node, source) as SFCScriptBlock;
        break;
      }
      case "style": {
        descriptor.styles.push(
          createBlock(node, source) as SFCStyleBlock,
        );
        break;
      }
      default:
        break;
    }
  });

  return { descriptor };
};

const createBlock = (
  node: ElementNode,
  source: string,
): SFCBlock => {
  const type = node.tag;
  const [first] = node.children;
  const last = node.children[node.children.length - 1];

  node.location.start = first.location.start;
  node.location.end = last.location.end;

  const { start, end } = node.location;

  const content = source.slice(start.offset, end.offset);

  return { type, content, location: { source: content, start, end } };
};
