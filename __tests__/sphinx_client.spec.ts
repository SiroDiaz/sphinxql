import SphinxClient from '../src/SphinxClient';

describe('Test Sphinx/Manticore client connector', () => {

  jest.useFakeTimers();

  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  const incorrectParams = {
    host: '127.0.0.1',
    port: 6666,
  };

  it('it creates and stablish a Sphinx/Manticore connection successfully', (done) => {
    const client = new SphinxClient(params);
    
    client
      .ping()
      .then(() => {
        expect(true).toBeTruthy();
        client.close();
        done();
      });
  });

  it('tries to create and stablish a Sphinx/Manticore connection but get errors', (done) => {
    const client = new SphinxClient(incorrectParams);
    
    client
      .ping()
      .then(() => {})
      .catch(error => {
        expect(error).not.toBe(undefined);
        done();
      });
  });

  it('expects that interface method are good implemented and accessible from the client instance', () => {
    const client = new SphinxClient(params);
    
    expect(typeof client.query).toBe('function');
    expect(typeof client.execute).toBe('function');
    expect(typeof client.ping).toBe('function');
    client.close();
  });
});
