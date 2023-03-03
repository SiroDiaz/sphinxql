import sphinxql from '../../src/Sphinxql';

describe('Tests for DELETE statement', () => {
  test('deletes with a where condition', () => {
    const compiledQuery = sphinxql()
      .delete('rt')
      .where('id', '=', 2)
      .generate();
    const expectedQuery = `DELETE FROM rt WHERE id = 2`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('deletes with a match condition', () => {
    const compiledQuery = sphinxql()
      .delete('rt')
      .match(['title', 'content'], 'dinosaur')
      .generate();
    const expectedQuery = `DELETE FROM rt WHERE MATCH('(@(title,content) dinosaur)')`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('deletes with multiple conditions', () => {
    const compiledQuery = sphinxql()
      .delete('rt')
      .match(['title', 'content'], 'dinosaur')
      .where('published_at', '<', 2030)
      .generate();
    const expectedQuery = `DELETE FROM rt WHERE MATCH('(@(title,content) dinosaur)') AND published_at < 2030`;

    expect(compiledQuery).toBe(expectedQuery);
  });
});
