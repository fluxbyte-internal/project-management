export type EnumStringValueObj<Enum extends string> = {
  [k in Enum]: k;
};