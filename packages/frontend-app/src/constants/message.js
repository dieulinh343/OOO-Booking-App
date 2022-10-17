import { MIN_PASSWORD_LENGTH } from './common';

export const PasswordMessage = {
  PASSWORD_REQUIRED: 'Please enter your password.',
  INVALID_PASSWORD: `Password must have at least ${MIN_PASSWORD_LENGTH} characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and no whitespaces.`,
  PASSWORD_NOT_MATCH: 'Password and confirm password do not match.',
  INVALID_PASSWORD_LENGTH: 'Password cannot exceed 255 characters.',
};

export const SignUpMessage = {
  FIRST_NAME_REQUIRED: 'Please enter your first name.',
  INVALID_FIRST_NAME_LENGTH: 'First name cannot exceed 255 characters.',
  LAST_NAME_REQUIRED: 'Please enter your last name.',
  INVALID_LAST_NAME_LENGTH: 'Last name cannot exceed 255 characters.',
  TERM_OF_SERVICE: 'Please agree to our term of service.',
  PRIVACY_POLICY: 'Please agree to our privacy policy.',
  EMAIL_REQUIRED: 'Please enter your email address.',
  EMAIL_INVALID: 'You have entered an invalid email address. Please try again.',
  CAPTCHA_REQUIRED: 'Please prove that you are not a robot.',
  ...PasswordMessage,
};

export const CommonMessage = {
  ...SignUpMessage,
};

export const ALREADY_LOGGED_IN = 'You are currently signed into another account. Please refresh this page to sign in here.';
