export const patchAttributes = (
  element: Element,
  key: string,
  value: any | null,
) => {
  if (value === null) {
    element.removeAttribute(key);
  } else {
    element.setAttribute(key, value);
  }
};
