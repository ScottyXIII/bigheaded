// it really can stringify anything (except circular references)
const stringify = (thing: string | number | boolean) => {
  try {
    return JSON.stringify(thing);
  } catch (err) {
    return '';
  }
};

const parse = (str?: string) => {
  if (str === undefined) return undefined;
  try {
    return JSON.parse(str);
  } catch (err) {
    return undefined;
  }
};

export { stringify, parse };
