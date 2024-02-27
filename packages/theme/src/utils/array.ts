export const isEmptyObjectArray = (array?: object[]) =>
  (array?.length || 0) > 0 &&
  array!.reduce((pre, cur) => pre || Object.keys(cur).length > 0, false);
