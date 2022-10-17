import React from 'react';
import { shallow } from 'enzyme';
import { mockWindowLocationMethods, restoreWindowLocation } from 'utils/testHelper';
import NewVersionTooltip from '../NewVersionTooltip';

describe('components/Common/MarkDown', () => {
  let wrapper;
  let buttons;
  const handleDismissTooltip = jest.fn();

  const update = () => {
    buttons = wrapper.find('button');
  };

  const setup = () => {
    wrapper = shallow(
      <NewVersionTooltip handleDismissTooltip={handleDismissTooltip} />,
    );
    update();
  };

  beforeAll(() => {
    mockWindowLocationMethods({
      reload: {
        value: jest.fn(),
      },
    });
  });

  afterAll(() => {
    restoreWindowLocation();
  });

  it('should render correctly', () => {
    setup();
    expect(wrapper.length).toBe(1);
  });

  it('should refresh when clicking on refresh button', () => {
    setup();
    expect(buttons.length).toBe(2);
    const refreshButton = buttons.at(0);
    expect(refreshButton.text()).toBe('REFRESH');
    refreshButton.simulate('click');
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should dismiss tooltip when clicking on the x button', () => {
    setup();
    expect(buttons.length).toBe(2);
    const dismissButton = buttons.at(1);
    expect(dismissButton.text()).toBe('✕');
    dismissButton.simulate('click');
    expect(handleDismissTooltip).toHaveBeenCalledTimes(1);
  });
});
