const encode = (str: string) => btoa(str);

const decode = (str: string) => {
  try {
    return atob(str);
  } catch (err) {
    return undefined;
  }
};

export { encode, decode };
