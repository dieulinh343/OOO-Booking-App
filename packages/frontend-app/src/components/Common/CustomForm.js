import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { Form, Button } from '@ahaui/react';
import {
  validateFirstName,
  validateLastName,
  validateRequiredEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validateMaxLength,
  getErrorMessage,
  combineValidators,
} from 'utils/validation';
import { CommonMessage } from 'constants/message';
import { KeyCharacter } from 'constants/common';
import { isPromise } from 'utils/object';

const Inputs = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
};

const NAME_VALIDATION_MAPPING = {
  [Inputs.FIRST_NAME]: validateFirstName,
  [Inputs.LAST_NAME]: validateLastName,
  [Inputs.EMAIL]: validateRequiredEmail,
  [Inputs.PASSWORD]: validatePassword,
  [Inputs.CONFIRM_PASSWORD]: validateConfirmPassword,
};

function useForm({
  onSubmit,
  customInputModifier = null,
  errorMessageObject = CommonMessage,
  defaultValues = {},
  preSubmitCallback,
} = {}) {
  const defaultValuesRef = useRef(defaultValues);
  const [formData, setFormData] = useState({ ...defaultValuesRef.current });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [validationFn, setValidationFn] = useState({});
  const [dirty, setDirty] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const getErrorMessages = useCallback((inputErrors) => {
    if (Array.isArray(inputErrors)) {
      return inputErrors.length
        ? getErrorMessage(errorMessageObject, inputErrors)
        : null;
    }
    return inputErrors;
  }, [errorMessageObject]);

  const validateInputField = useCallback((inputName, inputValue) => {
    // no validation needed
    if (!validationFn[inputName]) return true;

    const validate = validationFn[inputName];
    const inputErrors = inputName === Inputs.CONFIRM_PASSWORD
      ? validate(formData?.password, inputValue)
      : validate(inputValue);

    // Special case: Related fields
    if (inputName === Inputs.PASSWORD && inputValue === formData.confirmPassword) {
      setError((prevError) => ({
        ...prevError,
        [Inputs.CONFIRM_PASSWORD]: null,
      }));
    }

    setError((prevError) => ({
      ...prevError,
      [inputName]: getErrorMessages(inputErrors),
    }));

    return !inputErrors.length;
  }, [formData?.confirmPassword, formData?.password, getErrorMessages, validationFn]);

  const isFormValid = useCallback(() => {
    let result = true;
    Object.keys(formData).forEach((k) => {
      if (!validateInputField(k, formData[k])) {
        result = false;
      }
    });

    return result;
  }, [formData, validateInputField]);

  const getProcessedInputValue = useCallback((value) => {
    if (customInputModifier) {
      return customInputModifier(value);
    }

    if (value?.trim) {
      return value?.trim?.();
    }

    // If value is boolean | number | null | undefined, it can't be trimmed
    return value;
  },
  [customInputModifier]);

  const submitForm = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    preSubmitCallback?.();
    if (isFormValid()) {
      const trimmedData = { ...formData };

      // TODO: can not call field's customInputModifier props here
      Object.keys(trimmedData).forEach((k) => {
        trimmedData[k] = getProcessedInputValue(
          trimmedData[k],
        );
      });

      setFormData(trimmedData);
      const result = onSubmit(trimmedData);

      if (isPromise(result)) {
        const res = await result;
        if (res) {
          const { success } = res;

          if (success && mounted.current) {
            setDirty(false);
          }
        }
      } else if (mounted.current) {
        setDirty(false);
      }
    }
    mounted.current && setSubmitting(false);
  }, [formData, getProcessedInputValue, isFormValid, onSubmit, preSubmitCallback]);

  const handleFieldChange = useCallback((inputName, inputValue) => {
    let changed = false;
    setFormData((oldFormData) => {
      changed = oldFormData?.[inputName] !== inputValue;

      return { ...oldFormData, [inputName]: inputValue };
    });
    setDirty((oldDirty) => oldDirty || changed);
  }, []);

  const reset = useCallback(() => {
    setFormData({
      ...defaultValuesRef.current,
    });
    setDirty(false);
    setError({});
  }, []);

  const registerForm = useCallback(() => ({
    onSubmit: submitForm,
  }), [submitForm]);

  const registerField = useCallback(() => ({
    error,
    setError,
    formData,
    setFormData,
    submitting,
    setSubmitting,
    handleFieldChange,
    validateInputField,
    isFormValid,
    submitForm,
    setValidationFn,
    getProcessedInputValue,
  }), [
    error,
    setError,
    formData,
    setFormData,
    submitting,
    setSubmitting,
    handleFieldChange,
    validateInputField,
    isFormValid,
    submitForm,
    setValidationFn,
    getProcessedInputValue,
  ]);

  return {
    registerForm,
    registerField,
    error,
    formData,
    submitting,
    dirty,
    isFormValid,
    reset,
    handleFieldChange,
    validateInputField,
  };
}

function CustomFormInputGroup({
  children,
  formAppend,
}) {
  if (!formAppend) return children;

  return (
    <Form.InputGroup>
      {children}
      {formAppend}
    </Form.InputGroup>
  );
}

function CustomFormGroup({
  label,
  inputName,
  displayName,
  customValidation = null,
  disableDefaultValidation = false,
  nextRef,
  className,
  type,
  placeholder,
  infoFeedback,
  formAppend,
  formLabelProps,
  formInputProps: {
    disabled,
    ...restFormInputProps
  } = {},
  required = false,
  requiredControl = false,
  maxLength,
  error,
  setError,
  formData,
  setFormData,
  submitting,
  setSubmitting,
  handleFieldChange,
  validateInputField,
  isFormValid,
  submitForm,
  setValidationFn,
  getProcessedInputValue,
  onBlur,
  customInputModifier,
  options,
  ...formGroupProps
}, ref) {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    blur: () => {
      inputRef.current.blur();
    },
  }));

  const getValidationFn = useCallback(() => {
    const validators = [];

    const requiredProps = requiredControl || required;

    if (requiredProps) {
      if (typeof requiredProps === 'string') {
        validators.push(validateRequired(requiredProps));
      } else {
        validators.push(validateRequired('This field is required.'));
      }
    }

    // Validator for maxLength instead of built-in maxLength
    if (maxLength !== undefined) {
      validators.push(validateMaxLength({
        maxLength,
        displayName,
      }));
    }

    // Use custom validation, otherwise use default one if has one
    if (customValidation) {
      validators.push(customValidation);
    } else if (!disableDefaultValidation && NAME_VALIDATION_MAPPING[inputName]) {
      validators.push(NAME_VALIDATION_MAPPING[inputName]);
    }

    if (validators.length > 0) {
      return combineValidators(validators);
    }
    return null;
  }, [customValidation, displayName, inputName, maxLength, required, requiredControl, disableDefaultValidation]);

  useEffect(() => {
    setFormData((state) => ({
      [inputName]: '',
      ...state,
    }));
    const validationFn = getValidationFn();
    setValidationFn((fns) => ({ ...fns, [inputName]: validationFn }));
  }, [getValidationFn, inputName, setFormData, setValidationFn]);

  const handleChange = (e) => {
    const { value } = e.target;
    handleFieldChange(inputName, value);
    validateInputField(inputName, value);
  };

  const handleOnKeyDown = (e) => {
    if (e.key === KeyCharacter.ENTER) {
      if (!isFormValid()) {
        const { value } = e.target;
        // Only move to next field if current field is valid
        // and form has not been valid yet
        if (validateInputField(inputName, value) && nextRef) {
          nextRef.current.focus();
        }
      } else {
        e.target.blur();
        submitForm(e);
      }
    }
  };

  const handleOnBlur = (e) => {
    const { value } = e.target;
    const processedValue = (customInputModifier || getProcessedInputValue)(value);
    handleFieldChange(inputName, processedValue);
    const isValid = validateInputField(inputName, processedValue);

    onBlur && onBlur(e, {
      processedValue,
      isValid,
    });
  };

  return (
    <Form.Group
      className={className}
      requiredControl={!!requiredControl}
      {...formGroupProps}
    >
      {label && (
        <Form.Label
          htmlFor={inputName}
          {...formLabelProps}
        >
          {label}
        </Form.Label>
      )}
      <CustomFormInputGroup
        formAppend={formAppend}
      >
        {type === 'select' && options?.length
          ? (
            <Form.Select
              aria-label={inputName}
              ref={inputRef}
              placeholder={placeholder}
              id={inputName}
              name={inputName}
              value={formData?.[inputName] ?? ''}
              onChange={handleChange}
              isInvalid={error?.[inputName]}
              onKeyDown={handleOnKeyDown}
              {...restFormInputProps}
              disabled={submitting || disabled}
            >
              {options.map(option => (
                <option
                  key={option.name}
                  value={option.value}
                >
                  {option.name}
                </option>
              ))}
            </Form.Select>
          )
          : (
            <Form.Input
              aria-label={inputName}
              ref={inputRef}
              type={type ?? 'text'}
              placeholder={placeholder}
              id={inputName}
              name={inputName}
              value={formData?.[inputName] ?? ''}
              onChange={handleChange}
              isInvalid={error?.[inputName]}
              onKeyDown={handleOnKeyDown}
              onBlur={handleOnBlur}
              {...restFormInputProps}
              disabled={submitting || disabled}
            />
          )}
      </CustomFormInputGroup>
      {error?.[inputName] && (
        <Form.Feedback
          visible
          type="invalid"
          role="alert"
          name={inputName}
        >
          {error?.[inputName]}
        </Form.Feedback>
      )}
      {infoFeedback}
    </Form.Group>
  );
}
// eslint-disable-next-line no-func-assign
CustomFormGroup = forwardRef(CustomFormGroup);

function CustomSubmitButton({
  text,
  icon,
  lowercase,
  labelProps,
  iconProps,
  style,
  disabled,
  error,
  setError,
  formData,
  setFormData,
  submitting,
  setSubmitting,
  handleFieldChange,
  validateInputField,
  isFormValid,
  submitForm,
  setValidationFn,
  getProcessedInputValue,
  variant = 'primary',
  ...props
}) {
  const hasError = Object.keys(error).some((k) => error[k] != null);
  const isDisabled = disabled || submitting || hasError;

  return (
    <Button
      type="submit"
      variant={variant}
      width="full"
      disabled={isDisabled}
      style={{
        textTransform: lowercase ? 'none' : 'uppercase',
        ...style,
      }}
      {...props}
    >
      <Button.Label {...labelProps}>{text}</Button.Label>
      {icon && (
        <Button.Icon {...iconProps}>{icon}</Button.Icon>
      )}
    </Button>
  );
}

export {
  useForm,
  Inputs,
  CustomFormGroup,
  CustomSubmitButton,
};
