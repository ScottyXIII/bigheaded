import { encode, decode } from '@/helpers/safeBase64';
import { stringify, parse } from '@/helpers/safeJSON';

const useLocalStorage = (
  key: string,
  defaultValue: string | number | boolean,
  encrypt = false,
) => {
  const lsValue = String(window.localStorage.getItem(key));
  const value = parse(encrypt ? decode(lsValue) : lsValue) || defaultValue;

  const setValue = (newValue: string | number | boolean) => {
    const encoded = encrypt ? encode(stringify(newValue)) : stringify(newValue);
    window.localStorage.setItem(key, encoded);
  };

  return [value, setValue];
};

export default useLocalStorage;
