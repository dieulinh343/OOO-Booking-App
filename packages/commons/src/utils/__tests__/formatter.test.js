import formatter from '../formatter';

describe('utils/formatter', () => {
  it('getShortName', () => {
    expect(formatter.getShortName('Nam Dao')).toEqual('ND');
    expect(formatter.getShortName('Nam Dao Hello')).toEqual('ND');
    expect(formatter.getShortName('nam dao')).toEqual('ND');
    expect(formatter.getShortName('Nam dao', false)).toEqual('Nd');
    expect(formatter.getShortName('namdaoduy')).toEqual('NA');
    expect(formatter.getShortName('n')).toEqual('N');
    expect(formatter.getShortName('')).toEqual(' ');
    expect(formatter.getShortName(null)).toEqual(' ');
    expect(formatter.getShortName(undefined)).toEqual(' ');
  });

  it('trimCharactersInList', () => {
    const list = [' ', '-'];
    expect(formatter.trimCharactersInList('hello-- hi', list)).toEqual('hello-- hi');
    expect(formatter.trimCharactersInList('-- --hello-- hi   ', list)).toEqual('hello-- hi');
    expect(formatter.trimCharactersInList('-- --hello-- hi   ', [])).toEqual('-- --hello-- hi   ');
    expect(formatter.trimCharactersInList('-- --hello-- hi   ')).toEqual('-- --hello-- hi   ');
    expect(formatter.trimCharactersInList('-- --hello-- hi   ', [' '])).toEqual('-- --hello-- hi');
  });

  it('formatStringTemplate', () => {
    expect(formatter.formatStringTemplate('Hello world, User!')).toEqual('Hello world, User!');
    expect(formatter.formatStringTemplate('Hello world, {name}!')).toEqual('Hello world, {name}!');
    expect(formatter.formatStringTemplate('Hello world, {name}!', { name: 'Nam' })).toEqual('Hello world, Nam!');
    expect(formatter.formatStringTemplate('Hello world, {userId}!', { userId: 123 })).toEqual('Hello world, 123!');
    expect(formatter.formatStringTemplate('Hello world, {userId}!', { name: 'Nam' })).toEqual('Hello world, {userId}!');
    expect(formatter.formatStringTemplate('Hello {name}, {name}!', { name: 'Nam' })).toEqual('Hello Nam, Nam!');
    expect(formatter.formatStringTemplate('Hello {role}, {name}!', { role: 'sir', name: 'Nam' })).toEqual('Hello sir, Nam!');
    expect(formatter.formatStringTemplate('', { name: 'Nam' })).toEqual('');
    expect(formatter.formatStringTemplate(null, { name: 'Nam' })).toEqual(null);
    expect(formatter.formatStringTemplate(undefined, { name: 'Nam' })).toEqual(undefined);
    expect(formatter.formatStringTemplate('Hello world, {name}!', null)).toEqual('Hello world, {name}!');
    expect(formatter.formatStringTemplate('Hello world, {name}!', undefined)).toEqual('Hello world, {name}!');
  });

  it('replaceWhitespaceAndNbsp', () => {
    expect(formatter.replaceWhitespaceAndNbsp('  Hello    hi    ')).toEqual('Hello hi');
    expect(formatter.replaceWhitespaceAndNbsp('Hello \n \r \t \u00A0 hi')).toEqual('Hello hi');
    expect(formatter.replaceWhitespaceAndNbsp('')).toEqual('');
    expect(formatter.replaceWhitespaceAndNbsp(null)).toEqual(null);
    expect(formatter.replaceWhitespaceAndNbsp(undefined)).toEqual(undefined);
    expect(formatter.replaceWhitespaceAndNbsp('   Hello \n\r\t\u00A0 hi   ', { trimConsecutiveSpaces: false })).toEqual('Hello      hi');
    expect(formatter.replaceWhitespaceAndNbsp('   Hello \n\r\t\u00A0 hi   ', { trimConsecutiveSpaces: true })).toEqual('Hello hi');
  });

  it('replaceWhitespace', () => {
    expect(formatter.replaceWhitespace('  Hello    hi    ')).toEqual('Hello hi');
    expect(formatter.replaceWhitespace('Hello \n \r \t \u00A0 hi')).toEqual('Hello \n \r \t hi');
    expect(formatter.replaceWhitespace('')).toEqual('');
    expect(formatter.replaceWhitespace(null)).toEqual(null);
    expect(formatter.replaceWhitespace(undefined)).toEqual(undefined);
  });

  it('replaceWhitespaceButNewline', () => {
    expect(formatter.replaceWhitespaceButNewline('  Hello    hi    ')).toEqual('Hello hi');
    expect(formatter.replaceWhitespaceButNewline('Hello \n \r \t \u00A0 hi')).toEqual('Hello \n \r hi');
    expect(formatter.replaceWhitespaceButNewline('')).toEqual('');
    expect(formatter.replaceWhitespaceButNewline(null)).toEqual(null);
    expect(formatter.replaceWhitespaceButNewline(undefined)).toEqual(undefined);
  });
});
