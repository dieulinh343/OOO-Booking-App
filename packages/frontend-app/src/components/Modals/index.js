import React, {} from 'react';
import { ModalContainer } from '@ooo-booking/commons/components';
import { useDispatch, useSelector } from 'react-redux';
import { ModalKey } from 'constants/modal';
import { showModal } from 'actions/modal';
import DeleteOOConfirm from './DeleteOOOConfirm';
import ApproveOOOConfirm from './ApproveOOOConfirm';
import RejectOOOConfirm from './RejectOOOConfirm';



const modalsMap = {
  [ModalKey.DELETE_OOO_CONFIRM]: DeleteOOConfirm,
  [ModalKey.APPROVE_OOO_CONFIRM]: ApproveOOOConfirm,
  [ModalKey.REJECT_OOO_CONFIRM]: RejectOOOConfirm,
};


export default function ModalContainerWrapper() {
  const modalProps = useSelector(state => state.modal);
  const dispatch = useDispatch();
  const handleShowModal = (modalName) => {
    dispatch(showModal(modalName));
  };

  return (
    <ModalContainer
      modalsMap={modalsMap}
      modalProps={modalProps}
      handleShowModal={handleShowModal}
    />
  );
}
