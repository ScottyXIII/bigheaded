const useLocalStorage = (
  key: string,
  defaultValue: string | number | boolean,
) => {
  const lsValue = window.localStorage.getItem(key);
  const value = JSON.parse(lsValue || 'null') || defaultValue;

  const setValue = (newValue: string | number | boolean) => {
    window.localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setValue];
};

export default useLocalStorage;
