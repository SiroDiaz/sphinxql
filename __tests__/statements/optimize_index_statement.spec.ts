import QueryBuilder from '../../src/QueryBuilder';
import SphinxClient from '../../src/SphinxClient';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests OPTIMIZE INDEX statement', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  const conn = new SphinxClient(params);

  afterAll(() => {
    conn.close();
  })

  test('optimize index statement is generated', () => {
    
    const compiledQuery = new QueryBuilder(conn)
      .optimizeIndex('my_index')
      .generate();
    const expectedQuery = `OPTIMIZE INDEX my_index`;

    expect(compiledQuery).toBe(expectedQuery);
  });
});
