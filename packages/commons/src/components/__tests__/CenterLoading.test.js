import React from 'react';
import { shallow } from 'enzyme';
import { CenterLoading } from '../CenterLoading';

describe('components/CenterLoading', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    wrapper = shallow(<CenterLoading {...props} />);
  });

  it('should render successfully', () => {
    expect(wrapper.length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });
});
