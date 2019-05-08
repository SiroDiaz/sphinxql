import QueryBuilder from '../../src/QueryBuilder';
import SphinxClient from '../../src/SphinxClient';
import Expression from '../../src/Statements/Expression';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests for select queries', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
  };

  it('should create a simple select query selecting all fields from rt index', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .select('*')
      .from('rt')
      .generate();
    const expectedQuery = `SELECT * FROM rt`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects just two fields from rt with a simple where condition', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .select('id')
      .from('rt')
      .where('category', 'IN', [1, 2, 3])
      .generate();
    const expectedQuery = `SELECT id FROM rt WHERE category IN (1, 2, 3)`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects the id from rt in descending order', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .select('id')
      .from('rt')
      .orderBy({'id': 'DESC'})
      .generate();
    const expectedQuery = `SELECT id FROM rt ORDER BY id DESC`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects the id from rt ordered by published date in ascending order and from expensive to cheapest', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .select('id')
      .from('rt')
      .orderBy({'date_published': 'ASC', 'price': 'DESC'})
      .generate();
    const expectedQuery = `SELECT id FROM rt ORDER BY date_published ASC, price DESC`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects with WHERE conditions', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .select('*')
      .from('rt')
      .where('id', '>', 1000)
      .where('likes_count', 'BETWEEN', [100, 1000000])
      .generate();
    const expectedQuery = `SELECT * FROM rt WHERE id > 1000 AND likes_count BETWEEN 100 AND 1000000`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects with WHERE and HAVING conditions', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .select('*')
      .from('rt')
      .where('id', '>', 1000)
      .where('likes_count', 'BETWEEN', [100, 1000000])
      .having(Expression.raw('COUNT(*)').getExpression(), '>', 1)
      .generate();
    const expectedQuery = `SELECT * FROM rt WHERE id > 1000 AND likes_count BETWEEN 100 AND 1000000 HAVING COUNT(*) > 1`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects a raw expression with an alias name', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .select(Expression.raw('COUNT(*) as total').getExpression())
      .from('rt')
      .generate();
    const expectedQuery = `SELECT COUNT(*) as total FROM rt`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects a raw expression with an alias name and a single column in group by', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .select('user_id', Expression.raw('COUNT(*) as total').getExpression())
      .from('rt_sales')
      .groupBy(['user_id'])
      .having('total', '>', 1)
      .generate();
    const expectedQuery = `SELECT user_id, COUNT(*) as total FROM rt_sales GROUP BY user_id HAVING total > 1`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects with more than one column in group by', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .select('user_id', 'product_id', Expression.raw('SUM(product_price) as total').getExpression())
      .from('rt_sales')
      .groupBy(['user_id', 'product_id'])
      .generate();
    const expectedQuery = `SELECT user_id, product_id, SUM(product_price) as total FROM rt_sales GROUP BY user_id, product_id`;

    expect(compiledQuery).toBe(expectedQuery);
  });
});
