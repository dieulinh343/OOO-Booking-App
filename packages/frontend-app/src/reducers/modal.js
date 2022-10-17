import { ModalAction } from 'constants/action';

export const INITIAL_STATE = {
  displayModal: null,
  onModalClose: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ModalAction.SHOW_MODAL:
      return {
        ...action.payload,
      };

    default:
      break;
  }
  return state;
};
