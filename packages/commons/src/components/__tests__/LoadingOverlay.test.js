import React from 'react';
import { shallow } from 'enzyme';
import { LoadingOverlay } from '../LoadingOverlay';

describe('components/LoadingOverlay', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      text: 'sample text',
      spinnerSize: '100',
    };
    wrapper = shallow(<LoadingOverlay {...props} />);
  });

  it('should render successfully', () => {
    expect(wrapper.length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });
});
