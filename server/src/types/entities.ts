type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type EntityModel<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type { EntityModel };
