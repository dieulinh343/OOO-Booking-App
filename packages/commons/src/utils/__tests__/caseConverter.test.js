import caseConverter from '../caseConverter';

const snakeCaseTestData = {
  first_param: 1,
  second_param: {
    third_param: 3,
    fourth_param: {
      fifth_param: 5,
      sixth_param: [{ seventh_param: [1, 2, 3], eighth_param: 'ahihi' }],
    },
  },
};

const camelCaseTestData = {
  firstParam: 1,
  secondParam: {
    thirdParam: 3,
    fourthParam: {
      fifthParam: 5,
      sixthParam: [{ seventhParam: [1, 2, 3], eighthParam: 'ahihi' }],
    },
  },
};

const snakeCaseTestData2 = {
  first_param: 1,
  second_param: {
    third_param: 3,
    fourth_param: {
      fifth_param: 5,
      sixth_param: [{ seventh_param: [1, 2, 3], eighth_param: 'ahihi' }],
    },
  },
};

const camelCaseTestData2a = {
  firstParam: 1,
  secondParam: {
    third_param: 3,
    fourth_param: {
      fifth_param: 5,
      sixth_param: [{ seventh_param: [1, 2, 3], eighth_param: 'ahihi' }],
    },
  },
};

const camelCaseTestData2e = {
  firstParam: 1,
  secondParam: {
    thirdParam: 3,
    fourth_param: {
      fifthParam: 5,
      sixthParam: [{ seventhParam: [1, 2, 3], eighthParam: 'ahihi' }],
    },
  },
};

const camelCaseTestData2b = {
  firstParam: 1,
  secondParam: {
    third_param: 3,
    fourth_param: {
      fifthParam: 5,
      sixthParam: [{ seventhParam: [1, 2, 3], eighthParam: 'ahihi' }],
    },
  },
};

const camelCaseTestData2c = {
  firstParam: 1,
  secondParam: {
    thirdParam: 3,
    fourthParam: {
      fifth_param: 5,
      sixth_param: [{ seventh_param: [1, 2, 3], eighth_param: 'ahihi' }],
    },
  },
};

const camelCaseTestData2d = {
  firstParam: 1,
  secondParam: {
    third_param: 3,
    fourthParam: {
      fifthParam: 5,
      sixthParam: [{ seventhParam: [1, 2, 3], eighth_param: 'ahihi' }],
    },
  },
};

const camelCaseTestData2f = {
  firstParam: 1,
  secondParam: {
    thirdParam: 3,
    fourth_param: {
      fifth_param: 5,
      sixth_param: [{ seventh_param: [1, 2, 3], eighth_param: 'ahihi' }],
    },
  },
};

const uncapitalizedString = 'Hello this is Sample teSt CasE.';

const capitalizedString = 'Hello This Is Sample TeSt CasE.';

describe('utils/caseConverter', () => {
  it('can convert from snake case to camel case', () => {
    const camelCaseData = caseConverter.snakeCaseToCamelCase(snakeCaseTestData);
    expect(camelCaseData).toEqual(camelCaseTestData);
  });

  it('can convert from camel case to snake case', () => {
    const snakeCaseData = caseConverter.camelCaseToSnakeCase(camelCaseTestData);
    expect(snakeCaseData).toEqual(snakeCaseTestData);
  });

  it('should return null if argument is a primitive variable', () => {
    let snakeCaseData = caseConverter.camelCaseToSnakeCase(10);
    expect(snakeCaseData).toEqual(null);
    snakeCaseData = caseConverter.camelCaseToSnakeCase('gotit');
    expect(snakeCaseData).toEqual(null);
    snakeCaseData = caseConverter.camelCaseToSnakeCase(null);
    expect(snakeCaseData).toEqual(null);
  });

  it('should return null if argument is a function', () => {
    const snakeCaseData = caseConverter.camelCaseToSnakeCase(() => {});
    expect(snakeCaseData).toEqual(null);
  });

  it('should convert uncapitalized characters to capitalized characters', () => {
    const convertedString = caseConverter.capitalize(uncapitalizedString);
    expect(convertedString).toEqual(capitalizedString);
  });

  it('should return original object if the parameter passed to capitalize function is not string', () => {
    const returnedObject = caseConverter.capitalize({ value: 'not string' });
    expect(returnedObject).toEqual({ value: 'not string' });
  });

  it('should convert case correctly when using ** syntax', () => {
    const camelCaseData = caseConverter.snakeCaseToCamelCase(snakeCaseTestData2, ['second_param.**']);
    expect(camelCaseData).toEqual(camelCaseTestData2a);
  });

  it('should convert case correctly when provide an ignoredString', () => {
    const camelCaseData = caseConverter.snakeCaseToCamelCase(snakeCaseTestData2, ['second_param.fourth_param']);
    expect(camelCaseData).toEqual(camelCaseTestData2e);
  });

  it('should convert case correctly when using * syntax', () => {
    const camelCaseData = caseConverter.snakeCaseToCamelCase(snakeCaseTestData2, ['second_param.*']);
    expect(camelCaseData).toEqual(camelCaseTestData2b);
  });

  it('should convert case correctly when using * syntax', () => {
    const camelCaseData = caseConverter.snakeCaseToCamelCase(snakeCaseTestData2, ['second_param.fourth_param.**']);
    expect(camelCaseData).toEqual(camelCaseTestData2c);
  });

  it('should convert case correctly when providing multiple ignored array', () => {
    const camelCaseData = caseConverter.snakeCaseToCamelCase(snakeCaseTestData2, ['second_param.third_param', 'second_param.fourth_param.sixth_param.eighth_param']);
    expect(camelCaseData).toEqual(camelCaseTestData2d);
  });

  it('should ignore key and ** in collaboration correctly', () => {
    const camelCaseData = caseConverter.snakeCaseToCamelCase(snakeCaseTestData2, ['second_param.fourth_param', 'second_param.fourth_param.**']);
    expect(camelCaseData).toEqual(camelCaseTestData2f);
  });
});
