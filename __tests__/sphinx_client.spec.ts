// import SphinxQL from '../src/SphinxQL';
import SphinxClient from '../src/SphinxClient';

describe('greeter function', () => {
  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  const incorrectParams = {
    host: '127.0.0.1',
    port: 6666,
  }

  it('it creates and stablish a Sphinx/Manticore connection successfully', (done) => {
    const client = SphinxClient.getInstance(params);
    
    expect(client).toBeInstanceOf(SphinxClient);
    client
      .ping()
      .then(() => {
        expect(true).toBeTruthy();
        client.close();
        done();
      });
  });

  it('tries to create and stablish a Sphinx/Manticore connection but get errors', (done) => {
    SphinxClient.set(incorrectParams);
    const client = SphinxClient.getInstance(incorrectParams);
    expect(client).toBeInstanceOf(SphinxClient);
    client
      .ping()
      .then(() => {})
      .catch(error => {
        expect(error).not.toBe(undefined);
        done();
      });
  });

  it('expects that interface method are good implemented and accessible from the client instance', () => {
    SphinxClient.set(params);
    const client = SphinxClient.getInstance(params);
    
    expect(client).toBeInstanceOf(SphinxClient);
    expect(typeof client.query).toBe('function');
    expect(typeof client.execute).toBe('function');
    expect(typeof client.ping).toBe('function');
    client.close();
  });
});
