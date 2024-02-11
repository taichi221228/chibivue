export const patchAttributes = (
  el: Element,
  key: string,
  value: any | null,
) => {
  if (value === null) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, value);
  }
};
