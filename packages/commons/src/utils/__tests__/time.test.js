import time from '../time';

describe('utils/time', () => {
  it('should work', () => {
    const result = time.formatDateTime('2020-08-06 12:46:41');
    expect(result).toEqual('08/06/20, 12:46 PM');
  });
  it('should support custom format', () => {
    const result = time.formatDateTime('2020-08-06 12:46:41', 'ddd, MMM Do YYYY, h:mm A');
    expect(result).toEqual('Thu, Aug 6th 2020, 12:46 PM');
  });
});
