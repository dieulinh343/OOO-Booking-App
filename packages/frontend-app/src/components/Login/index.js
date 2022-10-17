import React, { useRef, useCallback } from 'react';
import { Icon, Form } from '@ahaui/react';
import {
  useForm,
  CustomFormGroup,
  CustomSubmitButton,
  Inputs,
} from 'components/Common/CustomForm';
import validator from 'validator';
import { login } from 'actions/user';
import { useDispatch } from 'react-redux';
import { toast } from '@ooo-booking/commons/utils';
import storage from 'utils/storage';
import { AUTH_KEY } from 'constants/common';
import { ALREADY_LOGGED_IN } from 'constants/message';
import loginImg from 'assets/images/login-img.png';
import logo from 'assets/images/logo-light.svg';

const validatePassword = (password) => {
  if (validator.isEmpty(password || '')) {
    return ['PASSWORD_REQUIRED'];
  }
  return [];
};

function Login() {
  const dispatch = useDispatch();

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleSubmit = useCallback(async (formData) => {
    if (JSON.parse(storage.getItem(AUTH_KEY))) {
      toast.error(ALREADY_LOGGED_IN);
      return null;
    }
    const { email, password } = formData;
    const response = await dispatch(
      login(
        email,
        password,
      ),
    );

    const { success, error } = response;

    if (!success) {
      toast.error('Incorrect credentials. \n Please try again!', 'Error!');
    }

    return response;
  }, [dispatch]);

  const { registerForm, registerField } = useForm({
    onSubmit: handleSubmit,
  });

  return (
    <div className="u-flex">
      <div
        style={{
          width: '50vw',
          height: '100vh',
        }}
        className="u-positionRelative"
      >
        <img
          src={loginImg}
          alt="Login"
          style={{
            height: '100vh',
            width: '100%',
            objectFit: 'cover',
          }}
          className="u-positionAbsolute"
        />
        <div
          className="u-positionAbsolute u-widthFull"
          style={{
            background: '#091E42',
            opacity: 0.4,
            height: '100vh',
          }}
        />
        <img
          src={logo}
          alt="GICRM AI"
          className="u-positionAbsolute"
          style={{
            top: 40,
            left: 52,
          }}
        />
        <div
          className="u-positionAbsolute u-textWhite"
          style={{
            bottom: 142,
            left: 52,
          }}
        >
          <div
            style={{
              fontSize: 72,
              lineHeight: '80px',
            }}
          >
            <div>
              OOO
            </div>
            <div>
              Booking App
            </div>
          </div>
          <div
            className="u-marginTopMedium u-text400"
          >
            Wanna take a break? Book here!
          </div>
        </div>
      </div>

      <div
        className="u-flex u-flexGrow-1 u-flexColumn u-alignItemsCenter"
      >
        <div
          style={{
            width: 352,
            marginTop: 200,
          }}
        >
          <div className="u-text600 u-marginBottomMedium">Log In</div>

          <Form {...registerForm()}>
            <CustomFormGroup
              {...registerField()}
              label="Email"
              placeholder="example@email.com"
              inputName={Inputs.EMAIL}
              ref={emailInputRef}
              nextRef={passwordInputRef}
              className="u-text200"
            />
            <CustomFormGroup
              {...registerField()}
              type="password"
              label="Password"
              placeholder="*******"
              inputName={Inputs.PASSWORD}
              customValidation={validatePassword}
              ref={passwordInputRef}
              className="u-text200"
            />
            <div className="u-marginTopMedium">
              <CustomSubmitButton
                {...registerField()}
                data-testid="button-sign-in"
                text="Log In"
                icon={<Icon size="small" name="arrowRoundForward" />}
                lowercase
              />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
