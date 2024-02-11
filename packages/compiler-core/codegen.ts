import {
  type ElementNode,
  type InterpolationNode,
  NodeTypes,
  type TemplateChildNode,
  type TextNode,
} from "chibivue";

export const generate = (
  { children }: { children: TemplateChildNode[] },
): string => {
  const [child] = children;
  return `return (_ctx) => {
    with(_ctx) {
      return ${genNode(child)};
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
  const props = element.props.map(({ name, value }) =>
    name === "@click"
      ? `onClick: ${value?.content}`
      : `${name}: "${value?.content}"`
  ).join(", ");
  const children = element.children.map((it) => genNode(it)).join(", ");

  return `_chibivue.h(
    "${tag}",
    { ${props} },
    [${children}]
  )`;
};

const genInterpolation = (node: InterpolationNode): string => `${node.content}`;
