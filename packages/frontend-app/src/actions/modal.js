import { ModalAction } from 'constants/action';

export const showModal = (displayModal, options) => (
  {
    type: ModalAction.SHOW_MODAL,
    payload: { displayModal, ...options },
  }
);
