import Request from '../request';

describe('utils/request', () => {
  let request;
  let auth;
  let apiUrl;

  const setup = (shouldConvertCase = true) => {
    request = new Request({
      auth,
      apiUrl,
      shouldAddBreadCrumb: false,
      shouldConvertCase,
    });
  };

  beforeEach(() => {
    fetch.resetMocks();

    auth = {
      getToken: jest.fn(),
    };

    apiUrl = 'http://localhost';
  });

  afterAll(() => {
    fetch.resetMocks();
  });

  it('removeDataProperty should run correctly', () => {
    setup();
    const input = {
      data: {
        abc: 'abc',
        o: true,
        data_test: 2,
        xy: {
          data: {
            m_test: [1, 2, 3],
          },
        },
      },
    };
    const output = {
      abc: 'abc',
      o: true,
      data_test: 2,
      xy: {
        m_test: [1, 2, 3],
      },
    };
    expect(request.removeDataProperty(input))
      .toEqual(output);
  });

  it('get request should run correctly', async () => {
    setup();
    const responseData = { get: 'ok' };
    fetch.mockResponse(JSON.stringify(responseData));
    let response = await request.get('/api', { param1: 1, param2: 'a' });
    expect(response)
      .toEqual(responseData);
    response = await request.get('/api');
    expect(response)
      .toEqual(responseData);
  });

  it('post request should run correctly', async () => {
    auth.getToken = () => 'hello';
    setup();
    const responseData = { post: 'ok' };
    fetch.once(JSON.stringify(responseData));
    const response = await request.post('/api', responseData);
    expect(response)
      .toEqual(responseData);
  });

  it('put request should run correctly', async () => {
    setup();
    const responseData = { put: 'ok' };
    fetch.once(JSON.stringify(responseData));
    const response = await request.put('http://api');
    expect(response)
      .toEqual(responseData);
  });

  it('del request should run correctly', async () => {
    setup();
    const responseData = { del: 'ok' };
    fetch.once(JSON.stringify(responseData));
    const response = await request.del('/api');
    expect(response)
      .toEqual(responseData);
  });

  it('upload should run correctly', async () => {
    setup();
    const input = {
      data: {
        abc: 'abc',
        o: true,
        data_test: 2,
        xy: {
          data: {
            m_test: [1, 2, 3],
          },
        },
      },
    };
    const output = {
      abc: 'abc',
      o: true,
      dataTest: 2,
      xy: {
        mTest: [1, 2, 3],
      },
    };
    fetch.once(JSON.stringify(input));

    const blob = new Blob([''], { type: 'text/html' });
    blob.lastModifiedDate = '';
    blob.name = 'file.name';
    const response = await request.upload(blob);
    expect(response)
      .toEqual(output);
  });

  it('should run correctly when initiate without converting case', async () => {
    auth.getToken = () => 'hello';
    setup(false);
    const responseData = { Post: 'ok' };
    fetch.once(JSON.stringify(responseData));
    await request.post('/api', responseData);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost/api',
      { body: '{"Post":"ok"}',
        headers:
        {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          Authorization: 'Bearer hello',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
  });

  it('should run correctly when initiate with converting case', async () => {
    auth.getToken = () => 'hello';
    setup();
    const responseData = { Post: 'ok' };
    fetch.once(JSON.stringify(responseData));
    await request.post('/api', responseData);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost/api',
      { body: '{"_post":"ok"}',
        headers:
        {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          Authorization: 'Bearer hello',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
  });
});
