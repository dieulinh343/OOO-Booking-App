type ConvertTarget = Record<string, any>| any[] | string;

const toCamelCase = (snakeCase: string) => snakeCase.replace(/_[a-z]/g, characters => characters[1].toUpperCase());

const toSnakeCase = (camelCase: string) => camelCase.replace(/[A-Z]/g, character => `_${character.toLowerCase()}`);

const convert = (obj: ConvertTarget, fn:
  (str: string) => string, ignoredKeys: string[] = []): ConvertTarget | null => {
  // validate input
  if (obj === null || obj === undefined) return obj;
  if ((!(typeof obj === 'object')) || typeof obj === 'function') {
    return null;
  }

  // if argument is an array, apply this function with each element of array
  if (Array.isArray(obj)) {
    const newArray = obj.map(item => (typeof item === 'object' ? convert(item, fn, ignoredKeys) : item));
    return newArray;
  }

  // if argument is a normal object
  const newObject: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (ignoredKeys.includes('**')) {
      newObject[key] = obj[key as keyof ConvertTarget];
      return;
    }
    let ignoreCurrentProcessingKey = false;
    if (ignoredKeys.includes('*') || ignoredKeys.includes(key)) {
      ignoreCurrentProcessingKey = true;
    }

    const currentIgnoredKeys = [
      ...ignoredKeys
        .filter(ignoredKey => ignoredKey.startsWith(key))
        .map(ignoredKey => ignoredKey.slice(key.length + 1)),
      ...ignoredKeys
        .filter(ignoredKey => ignoredKey.startsWith('*'))
        .map(ignoredKey => ignoredKey.slice(2)),
    ];

    const newKey = ignoreCurrentProcessingKey ? key : fn(key);
    const newValue = typeof obj[key as keyof ConvertTarget] === 'object'
      ? convert(obj[key as keyof ConvertTarget], fn, currentIgnoredKeys)
      : obj[key as keyof ConvertTarget];
    newObject[newKey] = newValue;
  });
  return newObject;
};

const capitalize = (obj: ConvertTarget) => (
  typeof obj === 'string'
    ? obj
      .trim()
      .split(' ')
      .map(word => word[0].toUpperCase() + word.substr(1))
      .reduce((result, word) => `${result} ${word}`)
    : obj
);

export default {
  capitalize,
  toCamelCase,
  toSnakeCase,
  snakeCaseToCamelCase: (obj: ConvertTarget, ignoredKeys: string[] = []) => convert(obj, toCamelCase, ignoredKeys),
  camelCaseToSnakeCase: (obj: ConvertTarget, ignoredKeys: string[] = []) => convert(obj, toSnakeCase, ignoredKeys),
};
