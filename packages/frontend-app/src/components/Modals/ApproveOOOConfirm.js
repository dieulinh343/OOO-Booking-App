import React, { useCallback, useState } from 'react';
import { FooterType, Modal } from '@ooo-booking/commons/components';
import { Button } from '@ahaui/react';

export default function ApproveOOOConfirm({ onModalClose, onConfirm }) {
  const [submitting, setSubmitting] = useState(false);
  return (
    <Modal
      centered
      closable
      onHide={onModalClose}
      size="medium"
      headerText="Confirmation"
      body={(
        <>
          This action cannot be undone. Are you sure you want to approve this request?
        </>
    )}
      primaryButtonVariant="positive"
      primaryButtonText={(
        <Button.Label className="u-textTransformNone">
          Yes, Approve Request
        </Button.Label>
      )}
      onClickPrimaryButton={async () => {
        setSubmitting(true);
        await onConfirm();
        setSubmitting(false);

        onModalClose();
      }}
      disablePrimaryButton={submitting}
      secondaryButtonText={(
        <Button.Label className="u-textTransformNone">
          No, Keep Request
        </Button.Label>
      )}
      onClickSecondaryButton={onModalClose}
      disableSecondaryButton={submitting}
      footerType={FooterType.FULL_WIDTH_DOUBLE}
    />
  );
}
