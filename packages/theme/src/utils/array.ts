export const isEmptyObjectArray = (array?: object[]) =>
  array?.reduce(
    (pre, cur) => pre && Object.keys(cur).length > 0,
    (array?.length || 0) > 0
  );
