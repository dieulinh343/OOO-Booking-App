import validator from 'validator';
import _ from 'lodash';
import { formatter } from '@ooo-booking/commons/utils';
import { MIN_PASSWORD_LENGTH } from 'constants/common';

export const combineValidators = (validators = []) => (...args) => {
  let errors = [];
  validators.forEach((validator) => {
    const errorsFromValidator = validator(...args);
    if (Array.isArray(errorsFromValidator)) {
      errors = [
        ...errors,
        ...errorsFromValidator,
      ];
    } else {
      errors = [
        ...errors,
        errorsFromValidator,
      ];
    }
  });
  return _.uniq(errors);
};

export const validateRequired = (messageKey) => (input) => {
  if (validator.isEmpty(input || '')) {
    return [messageKey];
  }
  return [];
};

export const validateMaxLength = ({
  displayName,
  maxLength,
}) => (input) => {
  if (!validator.isLength(input, { max: maxLength })) {
    const fieldName = formatter.capitalizeFirstLetter(displayName || 'this field');
    return [`${fieldName} cannot exceed ${maxLength} characters.`];
  }
  return [];
};

export const validateFirstName = (firstName) => {
  if (validator.isEmpty(firstName || '')) {
    return ['FIRST_NAME_REQUIRED'];
  }
  if (!validator.isLength(firstName, { max: 255 })) {
    return ['INVALID_FIRST_NAME_LENGTH'];
  }
  return [];
};

export const validateLastName = (lastname) => {
  if (validator.isEmpty(lastname || '')) {
    return ['LAST_NAME_REQUIRED'];
  }
  if (!validator.isLength(lastname, { max: 255 })) {
    return ['INVALID_LAST_NAME_LENGTH'];
  }
  return [];
};

export const validateEmail = (email) => {
  if (!validator.isEmail(email) || !/^[a-zA-Z0-9.@!#$%&'*+/=?^_`{|}~-]+$/.test(email)) {
    return ['EMAIL_INVALID'];
  }

  return [];
};

export const validateRequiredEmail = (email) => {
  if (validator.isEmpty(email || '')) {
    return ['EMAIL_REQUIRED'];
  }
  if (!validator.isEmail(email) || !/^[a-zA-Z0-9.@!#$%&'*+/=?^_`{|}~-]+$/.test(email)) {
    return ['EMAIL_INVALID'];
  }

  return [];
};

export const validatePassword = (password) => {
  if (validator.isEmpty(password || '')) {
    return ['PASSWORD_REQUIRED'];
  }

  if (!(new RegExp(/[A-Z]+/)).test(password)) {
    return ['INVALID_PASSWORD'];
  }

  if (!(new RegExp(/[a-z]+/)).test(password)) {
    return ['INVALID_PASSWORD'];
  }

  if (!(new RegExp(/[0-9]+/)).test(password)) {
    return ['INVALID_PASSWORD'];
  }

  if ((new RegExp(/\s/)).test(password)) {
    return ['INVALID_PASSWORD'];
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return ['INVALID_PASSWORD'];
  }

  if (!validator.isLength(password, { max: 255 })) {
    return ['INVALID_PASSWORD_LENGTH'];
  }

  return [];
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return ['PASSWORD_NOT_MATCH'];
  }
  return [];
};

export const getErrorMessage = (ErrorMessageObject = {}, listError) => {
  let errorMessage = '';
  const listErrorLength = listError.length;
  listError.forEach((errorKey, index) => {
    const errorFromList = ErrorMessageObject[errorKey];
    errorMessage += `${errorFromList ?? errorKey}`;
    if (index !== listErrorLength - 1) errorMessage += '\n';
  });
  return errorMessage;
};

export const validateReduxActionKeys = (allActionKeysObjects) => {
  // Find non-unique action keys
  const actionKeys = Object.keys(allActionKeysObjects)
    .map(key => allActionKeysObjects[key])
    .reduce((resultArray, actionKeysObject) => [
      ...resultArray,
      ...Object.keys(actionKeysObject).map(key => actionKeysObject[key]),
    ], [])
    .slice()
    .sort();
  const duplicatedKeys = [];
  for (let i = 0; i < actionKeys.length - 1; i++) {
    if (i !== 0) {
      if (actionKeys[i - 1] === actionKeys[i]) {
        duplicatedKeys.push(actionKeys[i]);
      }
    }
  }
  if (duplicatedKeys.length === 0) return;
  throw new Error(`Found non-unique redux action key(s): ${duplicatedKeys.join(', ')}`);
};
