import React from 'react';
import { shallow } from 'enzyme';
import { EmptyRows } from '../EmptyRows';

describe('components/EmptyRows', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    wrapper = shallow(<EmptyRows {...props} />);
  });

  it('should render empty rows successfully', () => {
    expect(wrapper.length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });
});
