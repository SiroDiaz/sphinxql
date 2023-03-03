import sphinxql from '../../src/Sphinxql';

describe('Tests RELOAD INDEX statement', () => {
  test('reload index statement is generated', () => {
    const compiledQuery = sphinxql().reloadIndex('my_index').generate();
    const expectedQuery = `RELOAD INDEX my_index`;

    expect(compiledQuery).toBe(expectedQuery);
  });

  test('reload index statement with the path is generated', () => {
    const compiledQuery = sphinxql()
      .reloadIndex('my_index')
      .from('/home/mighty/new_index_files')
      .generate();

    const expectedQuery = `RELOAD INDEX my_index FROM '/home/mighty/new_index_files'`;
    expect(compiledQuery).toBe(expectedQuery);
  });
});
