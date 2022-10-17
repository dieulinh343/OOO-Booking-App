import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';
import userEvent, { specialChars } from '@testing-library/user-event';
import DropdownSelect from '../DropdownSelect';
import '@testing-library/jest-dom';

describe('components/DropdownSelect', () => {
  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  test('should render dropdown select when don\'t have option selected successfully', async () => {
    const props = {
      onSelected: jest.fn(),
      options: [
        {
          id: 'option-id-1',
          name: 'Option 1',
          value: 'option_value_1',
        },
        {
          id: 'option-id-2',
          name: 'Option 2',
          value: 'option_value_2',
        },
        {
          id: 'option-id-3',
          name: 'Option 3',
          value: 'option_value_3',
        },
      ],
    };
    render(<DropdownSelect {...props} />);
    const valueSelected = screen.getByTestId('value-selected');
    expect(valueSelected.textContent).toEqual('');
  });

  test('should render dropdown select when have option selected successfully', async () => {
    const props = {
      onSelected: jest.fn(),
      options: [
        {
          id: 'option-id-1',
          name: 'Option 1',
          value: 'option_value_1',
        },
        {
          id: 'option-id-2',
          name: 'Option 2',
          value: 'option_value_2',
        },
        {
          id: 'option-id-3',
          name: 'Option 3',
          value: 'option_value_3',
        },
      ],
      idOptionSelected: 'option-id-1',
    };
    render(<DropdownSelect {...props} />);
    const btnClick = screen.getByTestId('input-selected');
    const valueSelected = screen.getByTestId('value-selected');
    expect(valueSelected.textContent).toEqual('Option 1');

    // Don't run function onSelected when select option same id
    fireEvent.click(btnClick);
    const option1 = within(screen.getByTestId('dropdown-selected')).getByText(/Option 1/i);
    fireEvent.click(option1);
    expect(props.onSelected).toHaveBeenCalledTimes(0);
  });

  test('should render dropdown select and handle select successfully', async () => {
    const props = {
      onSelected: jest.fn(),
      options: [
        {
          id: 'option-id-1',
          name: 'Option 1',
          value: 'option_value_1',
        },
        {
          id: 'option-id-2',
          name: 'Option 2',
          value: 'option_value_2',
        },
        {
          id: 'option-id-3',
          name: 'Option 3',
          value: 'option_value_3',
        },
      ],
    };
    render(<DropdownSelect {...props} />);
    const btnClick = screen.getByTestId('input-selected');
    fireEvent.click(btnClick);
    const option1 = screen.getByText(/Option 1/i);
    fireEvent.click(option1);
    expect(props.onSelected).toHaveBeenCalledWith('option-id-1');
    fireEvent.click(btnClick);
    const option2 = screen.getByText(/Option 2/i);
    fireEvent.click(option2);
    expect(props.onSelected).toHaveBeenCalledWith('option-id-2');
    fireEvent.click(btnClick);
    const option3 = screen.getByText(/Option 3/i);
    fireEvent.click(option3);
    expect(props.onSelected).toHaveBeenCalledWith('option-id-3');
    expect(props.onSelected).toHaveBeenCalledTimes(3);
  });

  test('should render dropdown select and handle select use keyboard successfully', async () => {
    const props = {
      onSelected: jest.fn(),
      options: [
        {
          id: 'option-id-1',
          name: 'Option 1',
          value: 'option_value_1',
        },
        {
          id: 'option-id-2',
          name: 'Option 2',
          value: 'option_value_2',
        },
        {
          id: 'option-id-3',
          name: 'Option 3',
          value: 'option_value_3',
        },
      ],
    };
    render(<DropdownSelect {...props} />);
    const valueSelected = screen.getByTestId('value-selected');
    expect(valueSelected.textContent).toEqual('');
    const btnClick = screen.getByTestId('input-selected');
    fireEvent.click(btnClick);
    userEvent.keyboard(specialChars.arrowDown);
    expect(valueSelected.textContent).toEqual('Option 1');
    userEvent.keyboard(specialChars.arrowDown);
    expect(valueSelected.textContent).toEqual('Option 2');
    userEvent.keyboard(specialChars.arrowDown);
    expect(valueSelected.textContent).toEqual('Option 3');
    userEvent.keyboard(specialChars.arrowDown);
    expect(valueSelected.textContent).toEqual('Option 1');
    userEvent.keyboard(specialChars.enter);
    expect(props.onSelected).toHaveBeenCalledWith('option-id-1');
    expect(props.onSelected).toHaveBeenCalledTimes(1);
  });
});
