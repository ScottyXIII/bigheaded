import { encode, decode } from '@/helpers/safeBase64';
import { stringify, parse } from '@/helpers/safeJSON';

const useLocalStorage = (
  key: string,
  defaultValue: string | number | boolean,
) => {
  const lsValue = String(window.localStorage.getItem(key));
  const value = parse(decode(lsValue)) || defaultValue;

  const setValue = (newValue: string | number | boolean) => {
    const stringified = stringify(newValue);
    const encoded = encode(stringified);
    window.localStorage.setItem(key, encoded);
  };

  return [value, setValue];
};

export default useLocalStorage;
