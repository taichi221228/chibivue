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

export const generate = (
  { children }: { children: TemplateChildNode[] },
): string => {
  const [node] = children;
  return `return (_context) => {
    with(_context) {
      return ${genNode(node)};
    }
  };`;
};

const genNode = (node: TemplateChildNode): string => {
  switch (node.type) {
    case NodeTypes.TEXT:
      return genText(node);
    case NodeTypes.ELEMENT:
      return genElement(node);
    case NodeTypes.INTERPOLATION:
      return genInterpolation(node);
    default:
      return "";
  }
};

const genText = (text: TextNode): string => `\`${text.content}\``;

const genElement = ({ tag, ...element }: ElementNode): string => {
  const properties = element.properties.map((property) => genProperty(property))
    .join(", ");
  const children = element.children.map((it) => genNode(it)).join(", ");

  return `_chibivue.h(
    "${tag}",
    { ${properties} },
    [${children}]
  )`;
};

const genInterpolation = (node: InterpolationNode): string => `${node.content}`;

const genProperty = (property: AttributeNode | DirectiveNode): string => {
  switch (property.type) {
    case NodeTypes.ATTRIBUTE:
      return `${property.name}: "${property.value?.content}"`;

    case NodeTypes.DIRECTIVE: {
      switch (property.name) {
        case "on":
          return `${toHandlerKey(property.argument)}: ${property.expression}`;
        default:
          throw new Error(`Unexpected directive name. got "${property.name}"`);
      }
    }

    default:
      throw new Error(`Unexpected property type.`);
  }
};
