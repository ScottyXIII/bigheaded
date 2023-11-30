import { encode, decode } from '@/helpers/safeBase64';
import { stringify, parse } from '@/helpers/safeJSON';

const keysToEncrypt = ['coins', 'purchased'];

const useLocalStorage = (
  key: string,
  defaultValue: string | number | boolean | object,
) => {
  const encryptOn = keysToEncrypt.includes(key);

  const getValue = () => {
    const lsValue = String(window.localStorage.getItem(key));
    const value = parse(encryptOn ? decode(lsValue) : lsValue) ?? defaultValue;
    return value;
  };

  const setValue = (newValue: string | number | boolean | object) => {
    const encoded = encryptOn
      ? encode(stringify(newValue))
      : stringify(newValue);
    window.localStorage.setItem(key, encoded);
  };

  return { getValue, setValue };
};

export default useLocalStorage;
