const convertCSVToJSON = (csv: string): Array<Record<string, any>> => {
  const lines = csv.split('\n');

  const result = [];

  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() !== '') {
      const obj: Record<string, any> = {};
      const currentline = line.split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }
  }

  return result;
};

export default {
  convertCSVToJSON,
};
