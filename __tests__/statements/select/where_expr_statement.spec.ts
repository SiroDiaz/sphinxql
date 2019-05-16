import WhereStatement from "../../../src/Statements/statement_expressions/WhereStatement";

describe('Tests for SELECT fields generator', () => {

  it('throws an error because empty column is invalid', () => {
    expect(() => {
      new WhereStatement('', '=', 'Siro');
    }).toThrow();
  });

  it('Enquotes the value if it is an string', () => {
    const generator = new WhereStatement('name', '=', 'Siro');

    expect(generator.build()).toBe(`name = 'Siro'`);
  });

  it('should create a simple column and compare it with a string', () => {
    const generator = new WhereStatement('name', '=', 'Siro');

    expect(generator.build()).toBe(`name = 'Siro'`);
  });

  it('should create a multiple column string', () => {
    let generator = new WhereStatement('id', '=', 1);
    expect(generator.build()).toBe(`id = 1`);

    generator = new WhereStatement('id', '>', 1);
    expect(generator.build()).toBe(`id > 1`);

    generator = new WhereStatement('id', '>=', 1);
    expect(generator.build()).toBe(`id >= 1`);

    generator = new WhereStatement('id', '>', '10');
    expect(generator.build()).toBe(`id > '10'`);
  });

  it('checks that an IN condition is well generated', () => {
    // const qb = connection.getQueryBuilder();
    let generator = new WhereStatement('id', 'IN', [10, 12, 14]);

    expect(generator.build()).toBe(`id IN (10, 12, 14)`);

    generator = new WhereStatement('tags', 'IN', ['clothes', 'shoes', 'complements']);
    expect(generator.build()).toBe(`tags IN ('clothes', 'shoes', 'complements')`);
  });

  it('checks that NOT IN condition is well generated', () => {
    // const qb = connection.getQueryBuilder();
    let generator = new WhereStatement('id', 'NOT IN', [10, 12, 14]);

    expect(generator.build()).toBe(`id NOT IN (10, 12, 14)`);

    generator = new WhereStatement('tags', 'NOT IN', ['clothes', 'shoes', 'complements']);
    expect(generator.build()).toBe(`tags NOT IN ('clothes', 'shoes', 'complements')`);
  });

  it('expects a well formed BETWEEN statement', () => {
    // const qb = connection.getQueryBuilder();
    let generator = new WhereStatement('year', 'BETWEEN', [2015, 2019]);

    expect(generator.build()).toBe(`year BETWEEN 2015 AND 2019`);

    // generator = new WhereStatement('tags', 'IN', ['clothes', 'shoes', 'complements']);
    // expect(generator.build()).toBe(`tags IN ('clothes', 'shoes', 'complements')`);
  });
});
