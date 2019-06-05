import QueryBuilder from '../../src/QueryBuilder';
import SphinxClient from '../../src/SphinxClient';
import Expression from '../../src/Statements/Expression';
require('iconv-lite').encodingExists('foo');  // fix bug with mysql2 and Jest

describe('Tests for UPDATE statement', () => {
  const params = {
    host: '127.0.0.1',
    port: 9307,
  };
  // UPDATE index SET col1 = newval1 [, ...] WHERE where_condition [OPTION opt_name = opt_value [, ...]]

  test('create an update statement with a where condition', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .update('rt')
      .set({description: 'new description text for the post', title: 'UPDATE 2019!', rank: 12})
      .where('id', '=', 2)
      .generate();
    const expectedQuery = `UPDATE rt SET description='new description text for the post', title='UPDATE 2019!', rank=12 WHERE id = 2`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('create an update statement with a match condition', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .update('rt')
      .set({title: 'UPDATE no dinosaurs in 2019!'})
      .match(['title', 'content'], 'dinosaur')
      .generate();
    const expectedQuery = `UPDATE rt SET title='UPDATE no dinosaurs in 2019!' WHERE MATCH('(@(title,content) dinosaur)')`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('create an update query with multiple conditions', () => {
    const conn = new SphinxClient(params);
    const compiledQuery = new QueryBuilder(conn)
      .update('rt')
      .set({title: 'UPDATE no dinosaurs in 2030!'})
      .match(['title', 'content'], 'dinosaur')
      .where('published_at', '<', 2030)
      .generate();
      const expectedQuery = `UPDATE rt SET title='UPDATE no dinosaurs in 2030!' WHERE MATCH('(@(title,content) dinosaur)') AND published_at < 2030`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('uses OPTION expression for customizing the search', () => {
    const conn = new SphinxClient(params);
    let compiledQuery = new QueryBuilder(conn)
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"', false)
      .option('ranker', 'sph04')
      .generate();
    let expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name "iPhone XS")') OPTION ranker='sph04'`;

    expect(compiledQuery).toBe(expectedQuery);

    compiledQuery = new QueryBuilder(conn)
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"', false)
      .orMatch('*', '"iphone apple"~4', false)
      .option('ranker', Expression.raw('sph04'))
      .option('field_weights', {product_name: 100})
      .generate();
    expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name "iPhone XS") | (@* "iphone apple"~4)') OPTION ranker=sph04,field_weights=(product_name=100)`;

    expect(compiledQuery).toBe(expectedQuery);

    compiledQuery = new QueryBuilder(conn)
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"')
      .orMatch('*', '"iphone apple"~4', false)
      .limit(5)
      .option('ranker', Expression.raw('sph04'))
      .option('field_weights', {product_name: 100})
      .generate();
    expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name \"iPhone XS\") | (@* "iphone apple"~4)') LIMIT 5 OPTION ranker=sph04,field_weights=(product_name=100)`;

    expect(compiledQuery).toBe(expectedQuery);

    compiledQuery = new QueryBuilder(conn)
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"')
      .orMatch('*', '"iphone apple"~4', false)
      .limit(5)
      .option('ranker', Expression.raw('sph04'))
      .option('field_weights', {product_name: 100, other: 1})
      .generate();
    expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name \"iPhone XS\") | (@* "iphone apple"~4)') LIMIT 5 OPTION ranker=sph04,field_weights=(product_name=100,other=1)`;

    expect(compiledQuery).toBe(expectedQuery);
  });
});
