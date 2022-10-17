import React from 'react';
import { shallow } from 'enzyme';
import { ConfirmModal } from '../ConfirmModal';

describe('components/ConfirmModal', () => {
  let wrapper;
  let props;

  const setup = () => {
    wrapper = shallow(<ConfirmModal {...props} />);
    wrapper.update();
  };

  beforeEach(() => {
    props = {
      onConfirm: jest.fn(),
      onModalClose: jest.fn(),
      onCancel: jest.fn(),
      bodyText: 'sample body',
    };
  });

  it('should render ConfirmModal with isDangerous being passed as true', () => {
    props = {
      ...props,
      isDangerous: true,
    };
    setup();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.props().primaryButtonVariant).toEqual('negative');
  });

  it('should render successfully', () => {
    setup();
    expect(wrapper.length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.props().primaryButtonVariant).toEqual('primary');
  });

  it('should call onConfirm when clicking primary button', () => {
    setup();
    wrapper.props().onClickPrimaryButton();
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel and onModalClose when clicking secondary button', () => {
    setup();
    wrapper.props().onClickSecondaryButton();
    expect(props.onCancel).toHaveBeenCalledTimes(1);
    expect(props.onModalClose).toHaveBeenCalledTimes(1);
  });
});
