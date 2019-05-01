import QueryBuilder from '../../src/QueryBuilder';
import SphinxClient from '../../src/SphinxClient';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests for INSERT queries', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  it('Creates a simple insert query that insert new record to rt index', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn).insert('rt', [
      1, 'Sample title', 'some random text without sense'
    ]).generate();
    const expectedQuery = `INSERT INTO rt VALUES (1, 'Sample title', 'some random text without sense')`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('Inserts multiple values into the rt index', () => {
    // const conn = SphinxClient.mock.instances[0];
    // TODO
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn).insert('rt', [
      [1, 'Sample title', 'some random text without sense'],
      [2, 'Second post', 'Another random and dummy text.'],
    ]).generate();
    const expectedQuery = `INSERT INTO rt VALUES (1, 'Sample title', 'some random text without sense'), (2, 'Second post', 'Another random and dummy text.')`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('Fails to insert values to an rt index with empty value', () => {
    // TODO
    const conn = new SphinxClient(params);

    expect(() => {
      new QueryBuilder(conn).insert('', [
        [1, 'Sample title', 'some random text without sense'],
        [2, 'Second post', 'Another random and dummy text.'],
      ]);
    }).toThrow();

    expect(() => {
      new QueryBuilder(conn).insert('rt', []);
    }).toThrow();
  });
});
