import QueryBuilder from '../../src/QueryBuilder';
import SphinxClient from '../../src/SphinxClient';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests RELOAD INDEX statement', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  const conn = new SphinxClient(params);

  afterAll(() => {
    conn.close();
  })

  test('reload index statement is generated', () => {
    
    const compiledQuery = new QueryBuilder(conn)
      .reloadIndex('my_index')
      .generate();
    const expectedQuery = `RELOAD INDEX my_index`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('reload index statement with the path is generated', () => {
    const compiledQuery = new QueryBuilder(conn)
      .reloadIndex('my_index')
      .from('/home/mighty/new_index_files')
      .generate();
    
    const expectedQuery = `RELOAD INDEX my_index FROM '/home/mighty/new_index_files'`;
    expect(compiledQuery).toBe(expectedQuery);
  });
});
