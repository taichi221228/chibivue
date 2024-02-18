import { toHandlerKey } from "../shared";

import {
  type AttributeNode,
  type DirectiveNode,
  type ElementNode,
  type InterpolationNode,
  NodeTypes,
  type TemplateChildNode,
  type TextNode,
} from "./ast";
import { type CompilerOptions } from "./options";

export const generate = (
  { children }: { children: TemplateChildNode[] },
  options: Required<CompilerOptions>,
): string => {
  const [node] = children;
  return `const render = (_context) => {
    ${options.isBrowser ? "with(_context) {" : ""}
      return ${genNode(node, options)};
    ${options.isBrowser ? "}" : ""}
  };
  ${options.isBrowser ? "return render;" : ""}`;
};

const genNode = (
  node: TemplateChildNode,
  options: Required<CompilerOptions>,
): string => {
  switch (node.type) {
    case NodeTypes.TEXT:
      return genText(node);
    case NodeTypes.ELEMENT:
      return genElement(node, options);
    case NodeTypes.INTERPOLATION:
      return genInterpolation(node, options);
    default:
      return "";
  }
};

const genText = (text: TextNode): string => `\`${text.content}\``;

const genElement = (
  { tag, ...element }: ElementNode,
  options: Required<CompilerOptions>,
): string => {
  const properties = element.properties.map((property) =>
    genProperty(property, options)
  )
    .join(", ");
  const children = element.children.map((element) => genNode(element, options))
    .join(
      ", ",
    );

  return `_chibivue.h("${tag}", { ${properties} }, [${children}])`;
};

const genInterpolation = (
  node: InterpolationNode,
  { isBrowser }: Required<CompilerOptions>,
): string => `${isBrowser ? "" : "_context."}${node.content}`;

const genProperty = (
  property: AttributeNode | DirectiveNode,
  { isBrowser }: Required<CompilerOptions>,
): string => {
  switch (property.type) {
    case NodeTypes.ATTRIBUTE:
      return `${property.name}: "${property.value?.content}"`;

    case NodeTypes.DIRECTIVE: {
      switch (property.name) {
        case "on":
          return `${toHandlerKey(property.parameter)}: ${
            isBrowser ? "" : "_context."
          }${property.expression}`;
        default:
          throw new Error(`Unexpected directive name. got "${property.name}"`);
      }
    }

    default:
      throw new Error(`Unexpected property type.`);
  }
};
