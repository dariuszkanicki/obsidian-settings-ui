export type Common = {
  type?: string;
  replacements?: () => string[];
  showIf?: boolean | (() => boolean);
};

export type SpecA = Common & {
  type: string;
};

export type SpecB = Common & {
  label: string;
};

export type Basis = SpecA | SpecB;
