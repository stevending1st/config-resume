export const hasTrue = (...args: unknown[]) =>
  args.reduce<boolean>((pre, cur) => !!pre || !!cur, false);
