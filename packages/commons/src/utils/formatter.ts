import DOMPurify from 'dompurify';

const replaceWhitespaceAndNbsp = (
  str: string,
  options: {
    trimConsecutiveSpaces: boolean
  } = {
    trimConsecutiveSpaces: true,
  },
): string => {
  if (!str) return str;

  const nbspRegex = new RegExp(String.fromCharCode(160), 'g');
  const whitespacesRegex = options.trimConsecutiveSpaces ? /\s+/g : /\s/g;

  return str.trim().replace(nbspRegex, ' ').replace(whitespacesRegex, ' ');
};

// TODO: Remove or rename. Why should we remove only nbsp and consecutive whitespaces,
// and call it "replaceWhitespace"?
const replaceWhitespace = (str: string): string => {
  if (!str) return str;

  const nbspRegex = new RegExp(String.fromCharCode(160), 'g');
  const whitespacesRegex = /  +/g;

  return str.trim().replace(nbspRegex, ' ').replace(whitespacesRegex, ' ');
};

const replaceWhitespaceButNewline = (str: string): string => {
  if (!str) return str;

  const nbspRegex = new RegExp(String.fromCharCode(160), 'g');
  const whitespacesRegex = /[^\S\r\n]+/g;

  return str.trim().replace(nbspRegex, ' ').replace(whitespacesRegex, ' ');
};

/**
 * Generate 2-character name from a long name.
 *
 * Example:
 *
 *    getShortName('Nam Dao'); // 'ND'
 *    getShortName('namdaoduy'); // 'NA'
 *    getShortName('N'); // 'N'
 *    getShortName(''); // ' '
 *
 * @param  {string} name Long name or username.
 * @param  {boolean} [upperCase=true] If true, transform the short name to upper case.
 */
const getShortName = (name: string, upperCase = true): string => {
  let shortName = ' ';
  if (!name) return shortName;

  const nameParts = replaceWhitespaceAndNbsp(name).split(' ');

  if (nameParts.length < 2) {
    shortName = nameParts[0].substring(0, 2);
  } else {
    shortName = `${nameParts[0].substring(0, 1)}${nameParts[1].substring(0, 1)}`;
  }
  if (upperCase) {
    return shortName.toUpperCase();
  }
  return shortName;
};

const capitalizeFirstLetter = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1);

const titleCase = (str: string): string => {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
};

const insertThousandSeparators = (num: number): string => {
  const [decimal, fraction] = num.toString().split('.');

  if (fraction) {
    return `${decimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}.${fraction}`;
  }

  return decimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

const escapeHTML = (text: string): string => {
  const replaceTag = (tag: string): string => {
    const tagsToReplace: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
    };

    return tagsToReplace[tag] || tag;
  };

  return text.replace(/[&<>]/g, replaceTag);
};

const sanitizeHTML = (text: string): string => DOMPurify.sanitize(text);

const trimCharactersInList = (text: string, list: string[] = []): string => {
  let trimmedText = text;

  while (list.includes(trimmedText.charAt(0))) {
    trimmedText = trimmedText.substring(1);
  }

  while (list.includes(trimmedText.charAt(trimmedText.length - 1))) {
    trimmedText = trimmedText.slice(0, -1);
  }

  return trimmedText;
};

// Format string template (python-like style)
// Ex: formatStringTemplate('Hello {user}', { user: 'Nam' });  -> 'Hello Nam'
const formatStringTemplate = (stringTemplate: string, formatOptions: Record<string, any>): string => {
  if (!stringTemplate || !formatOptions) {
    return stringTemplate;
  }

  // Reference: https://stackoverflow.com/a/18234317
  let formattedString = stringTemplate;

  Object.keys(formatOptions).forEach((key) => {
    formattedString = formattedString.replace(new RegExp(`{${key}}`, 'gi'), formatOptions[key]);
  });

  return formattedString;
};

export default {
  getShortName,
  replaceWhitespaceAndNbsp,
  capitalizeFirstLetter,
  titleCase,
  replaceWhitespace,
  insertThousandSeparators,
  escapeHTML,
  sanitizeHTML,
  trimCharactersInList,
  replaceWhitespaceButNewline,
  formatStringTemplate,
};
