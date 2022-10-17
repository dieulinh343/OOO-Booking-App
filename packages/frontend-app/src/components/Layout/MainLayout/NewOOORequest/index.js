import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker, Form } from '@ahaui/react';
import {
  CustomFormGroup,
  useForm,
  CustomSubmitButton,
} from 'components/Common/CustomForm';
import { submitMyOOORequests } from 'actions/oooRequest';
import { useHistory } from 'react-router-dom';
import { toast } from '@ooo-booking/commons/utils';
import { ContactMethod } from 'constants/request';


export default function NewOOORequest() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.items);
  const history = useHistory();

  const handleSubmit = useCallback(async (formData) => {
    const response = await dispatch(
      submitMyOOORequests({
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        purpose: formData.purpose,
        picId: formData.picId,
        contactMethods: formData.contactMethods,
      }),
    );

    const { success, error } = response;

    if (!success) {
      toast.error(error);
    } else {
      history.push('/my-requests/all');
      toast.success('Your OOO request has been received.', 'Done!');
    }

    return response;
  }, [dispatch, history]);

  const {
    registerForm,
    registerField,
    formData,
    handleFieldChange,
    error,
  } = useForm({
    onSubmit: handleSubmit,
    defaultValues: {
      purpose: '',
      picId: users[0].id,
      startDate: new Date(),
      endDate: new Date(),
      contactMethods: [ContactMethod.SLACK],
    },
  });

  const validatePurpose = useCallback((value) => {
    if (value.length > 1500) {
      return 'Maximum 1500 characters.';
    }

    return [];
  }, []);

  useEffect(() => {
    if (formData.startDate.getTime() > formData.endDate.getTime()) {
      handleFieldChange('endDate', formData.startDate);
    }
  }, [formData.startDate, formData.endDate, handleFieldChange]);

  return (
    <div className="u-paddingHorizontalExtraLarge u-paddingVerticalLarge">
      <h2 className="u-paddingSmall">Create OOO Request</h2>
      <div
        className="u-backgroundWhite u-paddingLarge"
        style={{
          width: 454,
        }}
      >
        <form
          {...registerForm()}
          style={{
            width: 390,
          }}
        >
          <Form.Group
            requiredControl
          >
            <Form.Label>
              Start date
            </Form.Label>
            <DatePicker
              noClearIcon
              value={formData.startDate}
              onChange={date => handleFieldChange('startDate', date)}
              minDate={new Date()}
              className="u-widthFull"
            />
          </Form.Group>

          <Form.Group requiredControl>
            <Form.Label>
              End date
            </Form.Label>
            <DatePicker
              noClearIcon
              value={formData.endDate}
              onChange={date => handleFieldChange('endDate', date)}
              minDate={formData.startDate}
              className="u-widthFull"
            />
          </Form.Group>

          <CustomFormGroup
            type="select"
            label="Person in charge (P.I.C.) when you are OOO"
            options={users.map(user => ({
              value: user.id,
              name: user.name,
            }))}
            inputName="picId"
            {...registerField()}
          />

          <Form.Group>
            <Form.Label>
              Preferred contact method
            </Form.Label>
            <div className="u-flex u-flexRow">
              <Form.Check
                id="form.check1"
                label="Slack"
                checked={formData.contactMethods.includes(ContactMethod.SLACK)}
                onChange={() => {
                  if (formData.contactMethods.includes(ContactMethod.SLACK)) {
                    handleFieldChange('contactMethods', formData.contactMethods.filter(method => method !== ContactMethod.SLACK));
                  } else {
                    handleFieldChange('contactMethods', [...formData.contactMethods, ContactMethod.SLACK]);
                  }
                }}
              />
              <Form.Check
                className="u-marginLeftMedium"
                id="form.check3"
                label="Phone"
                checked={formData.contactMethods.includes(ContactMethod.PHONE)}
                onChange={() => {
                  if (formData.contactMethods.includes(ContactMethod.PHONE)) {
                    handleFieldChange('contactMethods', formData.contactMethods.filter(method => method !== ContactMethod.PHONE));
                  } else {
                    handleFieldChange('contactMethods', [...formData.contactMethods, ContactMethod.PHONE]);
                  }
                }}
              />
              <Form.Check
                className="u-marginLeftMedium"
                id="form.check2"
                label="Email"
                checked={formData.contactMethods.includes(ContactMethod.EMAIL)}
                onChange={() => {
                  if (formData.contactMethods.includes(ContactMethod.EMAIL)) {
                    handleFieldChange('contactMethods', formData.contactMethods.filter(method => method !== ContactMethod.EMAIL));
                  } else {
                    handleFieldChange('contactMethods', [...formData.contactMethods, ContactMethod.EMAIL]);
                  }
                }}
              />
            </div>
          </Form.Group>

          <CustomFormGroup
            requiredControl
            label="Purpose of OOO request"
            inputName="purpose"
            formInputProps={{
              as: 'textarea',
              rows: 3,
            }}
            rows={3}
            {...registerField()}
            customValidation={validatePurpose}
            formAppend={(
              <Form.Feedback
                visible={!error.purpose}
                name="purpose"
              >
                <span className="u-textGray">Maximum 1500 characters.</span>
              </Form.Feedback>
            )}
          />

          <CustomSubmitButton
            {...registerField()}
            style={{
              width: 156,
            }}
            className="u-paddingTopLarge"
            text="Submit"
            lowercase
            disabled={!formData.purpose}
          />
        </form>
      </div>
    </div>
  );
}
