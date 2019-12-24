import QueryBuilder from '../../src/QueryBuilder';
import SphinxClient from '../../src/SphinxClient';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests FLUSH RTINDEX statement', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  const conn = new SphinxClient(params);

  afterAll(() => {
    conn.close();
  });

  test('flush rt index statement query generated', () => {

    const compiledQuery = new QueryBuilder(conn)
      .flushRTIndex('my_index')
      .generate();
    const expectedQuery = `FLUSH RTINDEX my_index`;

    expect(compiledQuery).toBe(expectedQuery);
  });
});
