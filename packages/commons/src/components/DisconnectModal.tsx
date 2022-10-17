import React from 'react';
import Modal from './Modal';

function DisconnectModal({
  onConfirm,
}: {
  onConfirm: () => void;
}) {
  return (
    <Modal
      id="modal-disconnect"
      centered={false}
      closable={false}
      size="small"
      headerText="Oops"
      body={(
        <p>You have been disconnected from the server. Please refresh your browser.</p>
      )}
      primaryButtonText="Reload"
      onClickPrimaryButton={() => {
        onConfirm();
      }}
      primaryButtonVariant="negative"
      footerType="single"
    />
  );
}

export default DisconnectModal;
