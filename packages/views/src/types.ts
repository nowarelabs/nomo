export type ComponentChild = 
  | string
  | number
  | boolean
  | null
  | undefined
  | ComponentChild[];

export type FC<P = {}> = (props: P) => string;
