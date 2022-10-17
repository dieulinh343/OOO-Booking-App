import { renderHook } from '@testing-library/react-hooks';
import useMount from '../useMount';

describe('hooks/useMount', () => {
  it('should work correctly', () => {
    const { result, unmount } = renderHook(
      () => useMount());
    expect(result.current).toEqual({
      current: true,
    });
    unmount();
    expect(result.current).toEqual({
      current: false,
    });
  });
});
