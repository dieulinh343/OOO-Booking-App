import React, { useState } from 'react';
import Modal, { FooterType } from './Modal';

export function ConfirmModal({
  waitConfirm,
  onConfirm,
  onCancel,
  onModalClose,
  headerText,
  bodyText,
  primaryButtonText,
  isDangerous = false,
  centered = false,
  ...rest
}: {
  waitConfirm?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onModalClose: () => void;
  headerText: string;
  bodyText: string;
  primaryButtonText: string;
  isDangerous: boolean;
  centered: boolean;
  rest?: object;
}) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <Modal
      id="modal-confirm"
      centered={centered}
      closable={false}
      size="small"
      headerText={headerText || 'Confirmation'}
      body={(
        <p>{bodyText}</p>
      )}
      primaryButtonText={submitting ? 'SUBMITTING...' : (primaryButtonText || 'YES')}
      onClickPrimaryButton={async () => {
        if (waitConfirm) {
          setSubmitting(true);
          await onConfirm();
        } else {
          onConfirm();
        }

        onModalClose();
      }}
      secondaryButtonText="NO"
      onClickSecondaryButton={() => {
        onCancel && onCancel();
        onModalClose();
      }}
      primaryButtonVariant={isDangerous ? 'negative' : 'primary'}
      footerType={FooterType.DOUBLE}
      disablePrimaryButton={submitting}
      disableSecondaryButton={submitting}
      {...rest}
    />
  );
}
export default ConfirmModal;
