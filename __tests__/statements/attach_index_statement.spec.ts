import QueryBuilder from '../../src/QueryBuilder';
import SphinxClient from '../../src/SphinxClient';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests ATTACH INDEX statement', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  const conn = new SphinxClient(params);

  afterAll(() => {
    conn.close();
  })

  test('attach index statement is generated', () => {
    
    const compiledQuery = new QueryBuilder(conn)
      .attachIndex('my_index')
      .to('my_rt_index')
      .generate();
    const expectedQuery = `ATTACH INDEX my_index TO RTINDEX my_rt_index`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('attach index statement with truncate is generated', () => {
    const compiledQuery = new QueryBuilder(conn)
      .attachIndex('my_index')
      .to('my_rt_index')
      .withTruncate()
      .generate();
    
    const expectedQuery = `ATTACH INDEX my_index TO RTINDEX my_rt_index WITH TRUNCATE`;
    expect(compiledQuery).toBe(expectedQuery);
  });
});
