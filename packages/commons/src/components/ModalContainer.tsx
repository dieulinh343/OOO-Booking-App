import React from 'react';

interface ModalContainerProps<T> {
  modalsMap: Record<string, React.FC<any>>;
  modalProps: T;
  handleShowModal?: (value: string | null) => void;
  handleCloseModal?: () => void;
}

export function ModalContainer<T extends {
  displayModal: string | null;
  onModalClose?: ((e: EventTarget) => void) | null;
}>({
  modalsMap,
  modalProps,
  handleCloseModal,
  // Keep this for backward compatibility
  handleShowModal,
}: ModalContainerProps<T>) {
  // Hide displaying modal
  const handleModalClose = () => {
    if (handleCloseModal) {
      handleCloseModal();
      return;
    }

    // Backward compatibility
    if (handleShowModal) {
      handleShowModal(null);
    }
  };

  const { displayModal, onModalClose, ...rest } = modalProps;
  const RenderedModal: React.FC<any> | null = (
    displayModal === null
      ? null
      : modalsMap[displayModal]
  );
  const currentProps = {
    ...rest,
    onModalClose: (e: EventTarget) => {
      handleModalClose();
      onModalClose && onModalClose(e);
    },
  };

  return RenderedModal
    ? <RenderedModal {...currentProps} />
    : null;
}

export default ModalContainer;
