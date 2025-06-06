export function ToLowerCase() {
  return function (target: any, propertyKey: string) {
    let value: string;
    const getter = () => value;
    const setter = (val: string) => {
      value = val?.toLowerCase();
    };
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
