interface Invoker extends EventListener {
  value: EventValue;
}

type EventValue = Function;

export const addEventListener = (
  el: Element,
  event: string,
  handler: EventListener,
) => {
  el.addEventListener(event, handler);
};

export const removeEventListener = (
  el: Element,
  event: string,
  handler: EventListener,
) => {
  el.removeEventListener(event, handler);
};

export const patchEvent = (
  el: Element & { _vei?: Record<string, Invoker | undefined> },
  rawName: string,
  value: EventValue | null,
) => {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];

  if (value && existingInvoker) {
    existingInvoker.value = value;
    return;
  }

  const name = parseName(rawName);

  if (value) {
    const invoker = (invokers[rawName] = createInvoker(value));
    addEventListener(el, name, invoker);
  } else if (existingInvoker) {
    removeEventListener(el, name, existingInvoker);
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
