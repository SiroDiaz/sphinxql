import MatchStatement from '../../../src/Statements/statement_expressions/MatchStatement';

describe('MATCH clause tests in isolation', () => {
  test('it escapes/replaces special chars', () => {
    const match = new MatchStatement();

    expect(match.escapeSpecialChars('hello')).toBe('hello');
    expect(match.escapeSpecialChars('hello world, order 66')).toBe('hello world, order 66');
    expect(match.escapeSpecialChars('(This is a expression) with expeci@l $$')).toBe(`\(This is a expression\) with expeci\@l \$\$`);
  });

  test('it searchs for the hello word', () => {
    const match = new MatchStatement();
    match.match(undefined, 'hello world');

    expect(match.getParts()).toHaveLength(1);
    expect(match.build()).toBe(`'(hello world)'`);
  });

  test('it searchs multiple text using various match method calls', () => {
    const match = new MatchStatement();
    match.match(undefined, 'hello');
    match.match(undefined, 'world');

    expect(match.getParts()).toHaveLength(2);
    expect(match.build()).toBe(`'(hello) (world)'`);

    match.match(undefined, 'how are you?');
    expect(match.getParts()).toHaveLength(3);
    expect(match.build()).toBe(`'(hello) (world) (how are you\?)'`);
  });

  test('it searchs in specific fields the text', () => {
    const match = new MatchStatement();
    match.match('title', 'hello world');

    expect(match.getParts()).toHaveLength(1);
    expect(match.build()).toBe(`'(@title hello world)'`);

    match.match(['title', 'content'], 'take the ball');
    expect(match.getParts()).toHaveLength(2);
    expect(match.build()).toBe(`'(@title hello world) (@(title,content) take the ball)'`);
  });

  test('it searchs text without escape', () => {
    const match = new MatchStatement();
    match.match('title', 'hello -world', false);

    expect(match.getParts()).toHaveLength(1);
    expect(match.build()).toBe(`'(@title hello -world)'`);
    match.match('content', '"hello world"~10', false);

    expect(match.getParts()).toHaveLength(2);
    expect(match.build()).toBe(`'(@title hello -world) (@content "hello world"~10)'`);
  });

  test('it searchs in specific fields the text using or operator', () => {
    const match = new MatchStatement();
    match.match('title', 'hello world');

    expect(match.getParts()).toHaveLength(1);
    expect(match.build()).toBe(`'(@title hello world)'`);

    match.orMatch(['title', 'content'], 'take the ball');
    expect(match.getParts()).toHaveLength(2);
    expect(match.build()).toBe(`'(@title hello world) | (@(title,content) take the ball)'`);
  });
});
