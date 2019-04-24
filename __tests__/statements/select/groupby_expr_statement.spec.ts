import GroupByExprStatement from '../../../src/Statements/select/GroupByExprStatement';

describe('Tests for GROUP BY expressions', () => {

  it('Generates an empty group by expression', () => {
    const generator = new GroupByExprStatement([]);

    expect(generator.build()).toBe(``);
  });

  it('generates valid GROUP BY expressions', () => {
    let generator = new GroupByExprStatement(['country']);
    expect(generator.build()).toBe(`country`);

    generator = new GroupByExprStatement(['group', 'name']);
    expect(generator.build()).toBe(`group, name`);
  });
});
