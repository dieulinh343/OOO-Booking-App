import React from 'react';
import { shallow } from 'enzyme';
import { ModalContainer } from '../ModalContainer';
import ConfirmModal from '../ConfirmModal';

describe('components/ModalContainer', () => {
  let wrapper;
  let props;

  const setup = () => {
    wrapper = shallow(
      <ModalContainer
        {...props}
      />);
  };

  beforeEach(() => {
    props = {
      modalsMap: {
        confirm: ConfirmModal,
      },
      modalProps: {
        displayModal: 'confirm',
        onModalClose: jest.fn(),
        onConfirm: jest.fn(),
        bodyText: 'sample body text',
      },
      handleShowModal: jest.fn(),
      handleCloseModal: jest.fn(),
    };
  });

  it('should render modal container successfully', () => {
    setup();
    expect(wrapper.length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger handleCloseModal (if exists) when onModalClose is called', () => {
    setup();
    wrapper.props().onModalClose();
    expect(props.handleCloseModal).toHaveBeenCalled();
    expect(props.handleShowModal).not.toHaveBeenCalled();
  });

  it('should trigger handleShowModal (if exists) when onModalClose is called', () => {
    delete props.handleCloseModal;
    setup();
    wrapper.props().onModalClose();
    expect(props.handleShowModal).toHaveBeenCalledWith(null);
  });

  it('should show nothing when displayModal props is empty', () => {
    props = {
      ...props,
      modalProps: {
        ...props.modalProps,
        displayModal: null,
      },
    };
    setup();
    expect(wrapper).toMatchSnapshot();
  });
});
