import * as fromReact from 'react';
import { renderHook } from '@testing-library/react-hooks';
import usePrevious from '../usePrevious';

describe('hooks/usePrevious', () => {
  let value;
  let useEffect;

  beforeEach(() => {
    useEffect = jest.spyOn(fromReact, 'useEffect');
    value = 'prev value';
  });

  const mockUseEffect = () => {
    useEffect.mockImplementationOnce(f => f());
  };


  it('should work correctly', async () => {
    mockUseEffect();
    const { rerender, result } = renderHook(() => usePrevious(value));
    value = 'current value';
    rerender();
    expect(result.current).toEqual('prev value');
    value = 'future value';
    rerender();
    expect(result.current).toEqual('current value');
  });
});
