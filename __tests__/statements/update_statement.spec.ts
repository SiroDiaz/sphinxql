import sphinxql from '../../src/Sphinxql';

describe('Tests for UPDATE statement', () => {
  test('updates with a where condition', () => {
    const compiledQuery = sphinxql()
      .update('rt')
      .set({
        description: 'new description text for the post',
        title: 'UPDATE 2019!',
        rank: 12,
      })
      .where('id', '=', 2)
      .generate();
    const expectedQuery = `UPDATE rt SET description='new description text for the post', title='UPDATE 2019!', rank=12 WHERE id = 2`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('updates with a match condition', () => {
    const compiledQuery = sphinxql()
      .update('rt')
      .set({ title: 'UPDATE no dinosaurs in 2019!' })
      .match(['title', 'content'], 'dinosaur')
      .generate();
    const expectedQuery = `UPDATE rt SET title='UPDATE no dinosaurs in 2019!' WHERE MATCH('(@(title,content) dinosaur)')`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('updates with multiple conditions', () => {
    const compiledQuery = sphinxql()
      .update('rt')
      .set({ title: "UPDATE there're not dinosaurs in 2030!" })
      .match(['title', 'content'], 'dinosaur')
      .where('published_at', '<', 2030)
      .generate();
    const expectedQuery = `UPDATE rt SET title='UPDATE there\\'re not dinosaurs in 2030!' WHERE MATCH('(@(title,content) dinosaur)') AND published_at < 2030`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  it('updates with OPTION expression for customizing the search', () => {
    const compiledQuery = sphinxql()
      .select('id')
      .from('rt_sales')
      .match('product_name', '"iPhone XS"', false)
      .option('ranker', 'sph04')
      .generate();
    const expectedQuery = `SELECT id FROM rt_sales WHERE MATCH('(@product_name "iPhone XS")') OPTION ranker='sph04'`;

    expect(compiledQuery).toBe(expectedQuery);
  });
});
