import StatementBuilderBase from '../StatementBuilderBase';

export default class MatchStatement implements StatementBuilderBase {
  protected parts: object[];
  protected escapeChars: object = {
    '\\': '\\\\',
    '(' : '\(',
    ')' : '\)',
    '!' : '\!',
    '@' : '\@',
    '~' : '\~',
    '&' : '\&',
    '/' : '\/',
    '^' : '\^',
    '$' : '\$',
    '=' : '\=',
    '<' : '\<'
  };

  constructor() {
    this.parts = [];
  }

  public getParts(): object[] {
    return this.parts;
  }

  public escapeSpecialChars(value: string): string {
    let newEscapedValue: string = value;

    for (const [key, value] of Object.entries(this.escapeChars)) {
      newEscapedValue = newEscapedValue.replace(key, value);
    }

    return newEscapedValue;
  }

  public match(fields: string[] | string, value: string, escapeValue: boolean = true) {
    const part = {
      logicalLeftRelation: ' ',
      fields: fields,
      value: value,
      escapeValue: escapeValue
    };

    this.parts = [...this.parts, part];
  }

  public orMatch(fields: string[] | string | undefined, value: string, escapeValue: boolean = true) {
    if (!this.parts.length) {
      throw Error('OR statement can\'t be used at the beginning of a MATCH expression');
    }

    const part = {
      logicalLeftRelation: ' | ',
      fields: fields,
      value: value,
      escapeValue: escapeValue
    };

    this.parts = [...this.parts, part];
  }

  public build(): string {
    let expression: string = '\'';

    for (let i = 0, length = this.parts.length; i < length; i++) {
      // @ts-ignore
      const { logicalLeftRelation, fields, value, escapeValue } = this.parts[i];
      if (i === 0) {
        expression += `(${this.buildFields(fields)}${this.buildValues(value, escapeValue)})`;
      } else {
        expression += logicalLeftRelation;
        expression += `(${this.buildFields(fields)}${this.buildValues(value, escapeValue)})`;
      }
    }

    expression += '\'';

    return expression;
  }

  /**
   * Generates fields for the full-text query condition.
   */
  protected buildFields(fields): string {
    let expression: string = '';

    if (fields !== undefined) {
      if (typeof fields === 'string') {
        expression += `@${fields} `;
      } else {  // if is an string[]
        if (fields[0] === '!') {
          expression += `@!(${fields.slice(1).join(',')}) `;
        } else {
          expression += `@(${fields.join(',')}) `;
        }
      }
    }

    return expression;
  }

  /**
   * Generates the text to search. It escapes the text if escapeValue
   * is true.
   */
  protected buildValues(value, escapeValue: boolean): string {
    return escapeValue ? this.escapeSpecialChars(value) : value;
  }
}
