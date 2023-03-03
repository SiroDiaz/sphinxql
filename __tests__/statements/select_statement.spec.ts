import sphinxql from '../../src/Sphinxql';
import Expression from '../../src/Statements/Expression';

describe('Tests for select queries', () => {
  it('should create a simple select query selecting all fields from rt index', () => {
    const compiledQuery = sphinxql().select('*').from('rt').generate();
    const expectedQuery = `SELECT * FROM rt`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects just two fields from rt with a simple where condition', () => {
    const compiledQuery = sphinxql()
      .select('id')
      .from('rt')
      .where('category', 'IN', [1, 2, 3])
      .generate();
    const expectedQuery = `SELECT id FROM rt WHERE category IN (1, 2, 3)`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects the id from rt in descending order', () => {
    const compiledQuery = sphinxql()
      .select('id')
      .from('rt')
      .orderBy({ id: 'DESC' })
      .generate();
    const expectedQuery = `SELECT id FROM rt ORDER BY id DESC`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects the id from rt ordered by published date in ascending order and from expensive to cheapest', () => {
    const compiledQuery = sphinxql()
      .select('id')
      .from('rt')
      .orderBy({ date_published: 'ASC', price: 'DESC' })
      .generate();
    const expectedQuery = `SELECT id FROM rt ORDER BY date_published ASC, price DESC`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects with WHERE conditions', () => {
    const compiledQuery = sphinxql()
      .select('*')
      .from('rt')
      .where('id', '>', 1000)
      .where('likes_count', 'BETWEEN', [100, 1000000])
      .generate();
    const expectedQuery = `SELECT * FROM rt WHERE id > 1000 AND likes_count BETWEEN 100 AND 1000000`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects with WHERE and HAVING conditions', () => {
    const compiledQuery = sphinxql()
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
    const compiledQuery = sphinxql()
      .select(Expression.raw('COUNT(*) as total').getExpression())
      .from('rt')
      .generate();
    const expectedQuery = `SELECT COUNT(*) as total FROM rt`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects a raw expression with an alias name and a single column in group by', () => {
    const compiledQuery = sphinxql()
      .select('user_id', Expression.raw('COUNT(*) as total').getExpression())
      .from('rt_sales')
      .groupBy(['user_id'])
      .having('total', '>', 1)
      .generate();
    const expectedQuery = `SELECT user_id, COUNT(*) as total FROM rt_sales GROUP BY user_id HAVING total > 1`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects with more than one column in group by', () => {
    const compiledQuery = sphinxql()
      .select(
        'user_id',
        'product_id',
        Expression.raw('SUM(product_price) as total').getExpression(),
      )
      .from('rt_sales')
      .groupBy(['user_id', 'product_id'])
      .generate();
    const expectedQuery = `SELECT user_id, product_id, SUM(product_price) as total FROM rt_sales GROUP BY user_id, product_id`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects id using MATCH in a WHERE condition', () => {
    let compiledQuery = sphinxql()
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"', false)
      .generate();
    let expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name "iPhone XS")')`;

    expect(compiledQuery).toBe(expectedQuery);

    compiledQuery = sphinxql()
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"', false)
      .orMatch('*', '"iphone apple"~4', false)
      .generate();
    expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name "iPhone XS") | (@* "iphone apple"~4)')`;

    expect(compiledQuery).toBe(expectedQuery);

    compiledQuery = sphinxql()
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"')
      .orMatch('*', '"iphone apple"~4', false)
      .generate();
    expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name "iPhone XS") | (@* "iphone apple"~4)')`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects id and use limit and offset methods', () => {
    let compiledQuery = sphinxql()
      .select('id')
      .from('rt_sales')
      .limit(10)
      .generate();
    let expectedQuery = `SELECT id FROM rt_sales LIMIT 10`;

    expect(compiledQuery).toBe(expectedQuery);

    compiledQuery = sphinxql()
      .select('id')
      .from('rt_sales')
      .offset(10)
      .generate();
    expectedQuery = `SELECT id FROM rt_sales LIMIT 10, 5`;

    expect(compiledQuery).toBe(expectedQuery);

    compiledQuery = sphinxql()
      .select('id')
      .from('rt_sales')
      .offset()
      .limit()
      .generate();
    expectedQuery = `SELECT id FROM rt_sales LIMIT 5`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('uses OPTION expression for customizing the search', () => {
    let compiledQuery = sphinxql()
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"', false)
      .option('ranker', 'sph04')
      .generate();
    let expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name "iPhone XS")') OPTION ranker='sph04'`;

    expect(compiledQuery).toBe(expectedQuery);

    compiledQuery = sphinxql()
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"', false)
      .orMatch('*', '"iphone apple"~4', false)
      .option('ranker', Expression.raw('sph04'))
      .option('field_weights', { product_name: 100 })
      .generate();
    expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name "iPhone XS") | (@* "iphone apple"~4)') OPTION ranker=sph04,field_weights=(product_name=100)`;

    expect(compiledQuery).toBe(expectedQuery);

    compiledQuery = sphinxql()
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"')
      .orMatch('*', '"iphone apple"~4', false)
      .limit(5)
      .option('ranker', Expression.raw('sph04'))
      .option('field_weights', { product_name: 100 })
      .generate();
    expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name \"iPhone XS\") | (@* "iphone apple"~4)') LIMIT 5 OPTION ranker=sph04,field_weights=(product_name=100)`;

    expect(compiledQuery).toBe(expectedQuery);

    compiledQuery = sphinxql()
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"')
      .orMatch('*', '"iphone apple"~4', false)
      .limit(5)
      .option('ranker', Expression.raw('sph04'))
      .option('field_weights', { product_name: 100, other: 1 })
      .generate();
    expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name \"iPhone XS\") | (@* "iphone apple"~4)') LIMIT 5 OPTION ranker=sph04,field_weights=(product_name=100,other=1)`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects with just one facet statement', () => {
    const compiledQuery = sphinxql()
      .select(
        'user_id',
        'product_id',
        Expression.raw('SUM(product_price) as total').getExpression(),
      )
      .from('rt_sales')
      .facet((f) => {
        return f.fields(['category_id']).by(['category_id']);
      })
      .generate();
    const expectedQuery = `SELECT user_id, product_id, SUM(product_price) as total FROM rt_sales FACET category_id BY category_id`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('selects with just one facet statement', () => {
    const compiledQuery = sphinxql()
      .select(
        'user_id',
        'product_id',
        Expression.raw('SUM(product_price) as total').getExpression(),
      )
      .from('rt_sales')
      .facet((f) => {
        return f.fields(['category_id']).by(['category_id']);
      })
      .facet((f) => {
        return f.field('brand_id').orderBy(Expression.raw('facet()')).limit(5);
      })
      .generate();
    const expectedQuery = `SELECT user_id, product_id, SUM(product_price) as total FROM rt_sales FACET category_id BY category_id FACET brand_id ORDER BY facet() DESC LIMIT 5`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('select with subselect', () => {
    const qb1 = sphinxql();
    const compiledQuery = sphinxql()
      .select('*')
      .from(
        'rt_sales',
        qb1.select('product_name').from('rt_products').where('tag_id', '=', 1),
      )
      .generate();

    const expectedQuery = `SELECT * FROM rt_sales, (SELECT product_name FROM rt_products WHERE tag_id = 1)`;
    expect(compiledQuery).toBe(expectedQuery);
  });
});
