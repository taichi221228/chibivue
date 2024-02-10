import {
  type ElementNode,
  NodeTypes,
  type TemplateChildNode,
  type TextNode,
} from "chibivue";

export const generate = (
  { children }: { children: TemplateChildNode[] },
): string => {
  const [child] = children;
  return `
    return () => {
      const { h } = _chibivue;
      return ${genNode(child)};
    };
  `;
};

const genNode = (node: TemplateChildNode): string => {
  switch (node.type) {
    case NodeTypes.TEXT:
      return genText(node);
    case NodeTypes.ELEMENT:
      return genElement(node);
    default:
      return "";
  }
};

const genText = (text: TextNode): string => `\`${text.content}\``;

const genElement = ({ tag, ...element }: ElementNode): string => {
  const props = element.props.map(({ name, value }) =>
    `${name}: "${value?.content}"`
  ).join(", ");
  const children = element.children.map((it) => genNode(it)).join(", ");

  return `
    h(
      "${tag}",
      { ${props} },
      [${children}]
    )
  `;
};
