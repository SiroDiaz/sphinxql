import { format } from 'sqlstring';
import ClientInterface from '../ClientInterface';

/**
 * INSERT INTO rtindex VALUES (val1, val2, ...), (val1, val2, ...);
 */

export default class InsertStatement {
  protected connection: ClientInterface;
  protected index: string;
  protected values: any;
  protected type: string;

  constructor(connection: ClientInterface, index: string, values: any, insertType: string = 'INSERT') {
    if (!index.length) {
      throw Error('real-time index must be valid but empty name provided');
    }
    if (!(values instanceof Array) && (typeof values !== 'object')) {
      throw Error(`Provide an array or an object (key-value pair) values`);
    }
    if ((values instanceof Array) && !values.length) {
      throw Error(`No document to insert`);
    }
    this.connection = connection;
    this.index = index;
    this.values = values;
    this.type = insertType
  }

  /**
   * Formats the VALUES of the document between parenthesis and escapes them.
   * values attribute can be of this types:
   *
   * [{id: 1, title: 'title...'}, {id: 2, title: 'other title'}]
   * OR
   * {id: 1, title: 'title...'}
   */
  protected renderValues(values: object, columns: string[]): string {
    const template: string = '?'.repeat(columns.length)
      .split('')
      .join(', ');

    // iterate through the columns array and format the values parenthesis
    let expression: string = '(';
    let compiledTemplate: string = template;

    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < columns.length; i++) {
      compiledTemplate = compiledTemplate.replace('?', format('?', values[columns[i]]));
    }
    return `${expression}${compiledTemplate})`;
  }

  public generate() : string {
    let valuesFields: string[] = [];
    // array of documents
    if (this.values instanceof Array) {
      const columns: string[] = Object.keys(this.values[0]);
      let expression: string = `${this.type} INTO ${this.index} `;
      expression += `${this.renderColumnList(columns)} VALUES `;

      valuesFields = this.values.map((values) => {
        return this.renderValues(values, columns);
      });

      return `${expression}${valuesFields.join(', ')}`;
    }

    // case of key-value object
    const columns: string[] = Object.keys(this.values);

    return `${this.type} INTO ${this.index} ${this.renderColumnList(columns)} ` +
      `VALUES ${this.renderValues(this.values, columns)}`;
  }

  public execute() {
    return this.connection.execute(this.generate(), []);
  }

  /**
   * Compiles the list of columns to insert in the correct order
   * the document/s. It goes before VALUES keyword.
   * 
   * Example output: (id, title, content)
   */
  protected renderColumnList(columns: string[]) : string {
    return `(${ columns.join(', ') })`;
  }
}
