import FacetStatement from '../../src/Statements/FacetStatement';
import Expression from '../../src/Statements/Expression';

describe('Tests for FACET expressions', () => {
  test('simple FACET by columns', () => {
    const facet = new FacetStatement();
    facet.field('category_id');
    expect(facet.build()).toBe('category_id');

    facet.fields(['year', 'product_id']);
    expect(facet.build()).toBe('category_id, year, product_id');

    facet.field(Expression.raw('COUNT(something)'));
    expect(facet.build()).toBe(
      'category_id, year, product_id, COUNT(something)',
    );
  });

  test('by expression with different values', () => {
    const facet = new FacetStatement();
    facet
      .fields(['category_id', 'product_id'])
      .by(['category_id', 'product_id']);
    expect(facet.build()).toBe(
      `category_id, product_id BY category_id, product_id`,
    );
  });

  test('limit expression with and without offset', () => {
    const facet = new FacetStatement();
    facet.fields(['category_id', 'product_id']).offset(5);

    expect(facet.build()).toBe(`category_id, product_id LIMIT 5, 5`);

    facet.limit(10);
    expect(facet.build()).toBe(`category_id, product_id LIMIT 5, 10`);
  });

  test('group by method with expressions and string', () => {
    const facet = new FacetStatement();

    facet.field('category_id').orderBy(Expression.raw('FACET()'), 'DESC');
    expect(facet.build()).toBe('category_id ORDER BY FACET() DESC');
  });

  test('all facet methods working together', () => {
    const facet = new FacetStatement();
    facet
      .fields([Expression.raw('price_range AS fprice_range'), 'brand_name'])
      .orderBy('brand_name', 'ASC');

    expect(facet.build()).toBe(
      'price_range AS fprice_range, brand_name ORDER BY brand_name ASC',
    );

    facet.limit();

    expect(facet.build()).toBe(
      'price_range AS fprice_range, brand_name ORDER BY brand_name ASC LIMIT 5',
    );
  });
});
