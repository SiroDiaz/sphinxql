import QueryBuilder from '../../src/QueryBuilder';
import SphinxClient from '../../src/SphinxClient';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests TRUNCATE statement', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  const conn = new SphinxClient(params);

  afterAll(() => {
    conn.close();
  })

  test('truncate statement is generated', () => {
    
    const compiledQuery = new QueryBuilder(conn)
      .truncate('my_rt_index')
      .generate();
    const expectedQuery = `TRUNCATE RTINDEX my_rt_index`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('truncate statement with reconfigure is generated', () => {
    const compiledQuery = new QueryBuilder(conn)
      .truncate('my_rt_index')
      .withReconfigure()
      .generate();
    
    const expectedQuery = `TRUNCATE RTINDEX my_rt_index WITH RECONFIGURE`;
    expect(compiledQuery).toBe(expectedQuery);
  });
});
