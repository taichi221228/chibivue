export const generate = ({
  tag,
  props,
  textContent,
}: {
  tag: string;
  props: Record<string, string>;
  textContent: string;
}): string =>
  `return () => {
    const { h } = Chibivue;
    return h(
      "${tag}",
      { ${Object.entries(props).map(([k, v]) => `${k}: "${v}"`).join(", ")} }, 
      ["${textContent}"]
    );
  };`;
