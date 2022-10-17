import React from 'react';
import { Modal, FooterType } from '@ooo-booking/commons/components';
import { Button } from '@ahaui/react';

export default function DeleteOOOConfirm({
  onModalClose,
  onConfirm,
}) {
  return (
    <Modal
      closable
      onHide={onModalClose}
      size="medium"
      headerText="Confirmation"
      body={(
        <>
          This action cannot be undone. Are you sure you want to cancel this request?
        </>
      )}
      primaryButtonVariant="negative"
      primaryButtonText={(
        <Button.Label className="u-textTransformNone">
          Yes, Cancel Request
        </Button.Label>
      )}
      onClickPrimaryButton={() => {
        onConfirm();
        onModalClose();
      }}
      secondaryButtonText={(
        <Button.Label className="u-textTransformNone">
          No, Keep Request
        </Button.Label>
      )}
      onClickSecondaryButton={onModalClose}
      footerType={FooterType.FULL_WIDTH_DOUBLE}
    />
  );
}
