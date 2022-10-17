import { Form, Button } from '@ahaui/react';
import { FooterType, Modal } from '@ooo-booking/commons/components';
import { CustomFormGroup, useForm } from 'components/Common/CustomForm';
import React, { useCallback, useState } from 'react';

export default function RejectOOOConfirm({ onModalClose, onConfirm }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async ({ rejectReason }) => {
    setSubmitting(true);
    await onConfirm(rejectReason);
    setSubmitting(false);

    onModalClose();
  };

  const { registerForm, registerField, formData, error } = useForm({
    defaultValues: {
      rejectReason: '',
    },
    onSubmit: handleSubmit,
  });
  const validatePurpose = useCallback((value) => {
    if (value.length > 1500) {
      return 'Maximum 1500 characters.';
    }

    return [];
  }, []);

  return (
    <div>
      <Modal
        centered
        closable
        onHide={onModalClose}
        size="medium"
        headerText="Confirmation"
        body={(
          <>
            This action cannot be undone. Are you sure you want to reject this
            request?
            <form {...registerForm()}>
              <CustomFormGroup
                requiredControl
                label="Purpose of OOO request"
                inputName="rejectReason"
                formInputProps={{
                  as: 'textarea',
                }}
                {...registerField()}
                customValidation={validatePurpose}
                formAppend={(
                  <Form.Feedback
                    visible={!error.rejectReason}
                    name="rejectReason"
                  >
                    <span className="u-textGray">Maximum 1500 characters.</span>
                  </Form.Feedback>
                )}
              />
            </form>
          </>
        )}
        primaryButtonVariant="negative"
        primaryButtonText={(
          <Button.Label className="u-textTransformNone">
            Yes, Reject Request
          </Button.Label>
        )}
        disablePrimaryButton={!formData.rejectReason || error.rejectReason || submitting}
        disableSecondaryButton={submitting}
        onClickPrimaryButton={async () => {
          handleSubmit(formData);
        }}
        secondaryButtonText={(
          <Button.Label className="u-textTransformNone">
            No, Keep Request
          </Button.Label>
        )}
        onClickSecondaryButton={onModalClose}
        footerType={FooterType.FULL_WIDTH_DOUBLE}
      />
    </div>
  );
}
