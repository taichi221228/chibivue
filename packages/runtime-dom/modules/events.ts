interface Invoker extends EventListener {
  value: EventValue;
}

type EventValue = Function;

export const addEventListener = (
  element: Element,
  event: string,
  handler: EventListener,
) => {
  element.addEventListener(event, handler);
};

export const removeEventListener = (
  element: Element,
  event: string,
  handler: EventListener,
) => {
  element.removeEventListener(event, handler);
};

export const patchEvent = (
  element: Element & { _vei?: Record<string, Invoker | undefined> },
  rawName: string,
  value: EventValue | null,
) => {
  const invokers = element._vei || (element._vei = {});
  const existingInvoker = invokers[rawName];

  if (value && existingInvoker) {
    existingInvoker.value = value;
    return;
  }

  const name = parseName(rawName);

  if (value) {
    const invoker = (invokers[rawName] = createInvoker(value));
    addEventListener(element, name, invoker);
  } else if (existingInvoker) {
    removeEventListener(element, name, existingInvoker);
    invokers[rawName] = undefined;
  }
};

const parseName = (rawName: string): string =>
  rawName.slice(2).toLocaleLowerCase();

const createInvoker = (initialValue: EventValue) => {
  const invoker = (e: Event) => {
    invoker.value(e);
  };

  invoker.value = initialValue;
  return invoker;
};
