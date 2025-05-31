export interface SelectOption {
  id: number;
  label: string;
}

export interface EntityResult {
  id: number;
  [key: string]: any;
}

export type Constructor<I> = new (...args: any[]) => I;
