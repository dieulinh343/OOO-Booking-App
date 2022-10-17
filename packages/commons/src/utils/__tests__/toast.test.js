import React from 'react';
import { shallow } from 'enzyme';
import { toast as libToast } from '@ahaui/react';
import toast from '../toast';

jest.mock('@ahaui/react', () => ({
  Icon: function Icon() { return (<div>Icon</div>); },
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

describe('utils/toast', () => {
  it('should toast success correctly', () => {
    toast.success('Hello', 'From the other side');
    const lastCall = libToast.success.mock.calls.pop();
    const RenderedComponent = lastCall[0];
    const wrapper = shallow(<RenderedComponent />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should toast success with array of contents correctly', () => {
    toast.success(['From the other side', 'And this side']);
    const lastCall = libToast.success.mock.calls.pop();
    const RenderedComponent = lastCall[0];
    const wrapper = shallow(<RenderedComponent />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should toast error with 1 arg correctly', () => {
    toast.error('An error');
    const lastCall = libToast.error.mock.calls.pop();
    const RenderedComponent = lastCall[0];
    const wrapper = shallow(<RenderedComponent />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should toast error with 2 args correctly', () => {
    toast.error('Hey', 'An error');
    const lastCall = libToast.error.mock.calls.pop();
    const RenderedComponent = lastCall[0];
    const wrapper = shallow(<RenderedComponent />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should toast error with none argument correctly', () => {
    toast.error();
    const lastCall = libToast.error.mock.calls.pop();
    const RenderedComponent = lastCall[0];
    const wrapper = shallow(<RenderedComponent />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render anything if showMessage is not provided with correct type', () => {
    toast.showMessage('info', 'info', 'info detail');
    expect(libToast.error.mock.calls).toEqual([]);
  });

  it('arrayToObject', () => {
    expect(toast.arrayToObject([
      'im a string',
      'string 2',
      { key: 123 },
      [123, 456],
    ])).toEqual({
      0: 'im a string',
      1: 'string 2',
      2: { key: 123 },
      3: [123, 456],
    });
  });

  it('should flatten error correctly', () => {
    expect(toast.flattenErrorData({
      field1: {
        field11: 'error 11',
        field12: [
          'error 120',
          'error 121',
          {
            field1221: 'error 1221',
          },
        ],
        field13: null,
      },
      field2: 'error 2',
      field16: null,
    })).toEqual(
      [
        '[field1.field11] error 11',
        '[field1.field12.0] error 120',
        '[field1.field12.1] error 121',
        '[field1.field12.2.field1221] error 1221',
        '[field2] error 2',
      ],
    );
  });

  describe('should getErrorMsg correctly', () => {
    expect(toast.getErrorMsg(undefined)).toEqual('Something went wrong.');
    expect(toast.getErrorMsg(['item 1'])).toEqual(['item 1']);
    expect(toast.getErrorMsg({
      data: {
        errorMessage: 'Sample error msg',
      },
    })).toEqual('Sample error msg');
    expect(toast.getErrorMsg({
      data: {
        message: 'Sample error msg',
      },
    })).toEqual('Sample error msg');
    expect(toast.getErrorMsg({
      message: 'Sample error msg',
    })).toEqual('Sample error msg');
    expect(toast.getErrorMsg({
      not_data: null,
    })).toEqual('Something went wrong.');
    expect(toast.getErrorMsg({
      data: {
        errorData: 'Sample error msg',
      },
    })).toEqual(['Sample error msg']);
    expect(toast.getErrorMsg({
      data: {
        errorData: {
          field1: 'Sample error msg',
        },
      },
    })).toEqual(['[field1] Sample error msg']);
    expect(toast.getErrorMsg({
      data: {
        errorData: {
          field1: {
            field11: 'Sample error msg',
          },
          field2: 'Sample error msg',
        },
      },
    })).toEqual(['[field1.field11] Sample error msg',
      '[field2] Sample error msg']);
  });
});
