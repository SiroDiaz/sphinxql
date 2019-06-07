import QueryBuilder from '../../src/QueryBuilder';
import SphinxClient from '../../src/SphinxClient';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests for DELETE statement', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  const conn = new SphinxClient(params);

  beforeAll(() => {
    conn.close();
  });

  test('deletes with a where condition', () => {
    const compiledQuery = new QueryBuilder(conn)
      .delete('rt')
      .where('id', '=', 2)
      .generate();
    const expectedQuery = `DELETE FROM rt WHERE id = 2`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('deletes with a match condition', () => {
    const compiledQuery = new QueryBuilder(conn)
      .delete('rt')
      .match(['title', 'content'], 'dinosaur')
      .generate();
    const expectedQuery = `DELETE FROM rt WHERE MATCH('(@(title,content) dinosaur)')`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('deletes with multiple conditions', () => {
    const compiledQuery = new QueryBuilder(conn)
      .delete('rt')
      .match(['title', 'content'], 'dinosaur')
      .where('published_at', '<', 2030)
      .generate();
      const expectedQuery = `DELETE FROM rt WHERE MATCH('(@(title,content) dinosaur)') AND published_at < 2030`;

    expect(compiledQuery).toBe(expectedQuery);
  });
});
