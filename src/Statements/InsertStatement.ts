import { format } from 'sqlstring';
import ClientInterface from '../ClientInterface';

/**
 * INSERT INTO rtindex VALUES (val1, val2, ...), (val1, val2, ...);
 */

export default class InsertStatement {
  protected connection: ClientInterface;
  protected index: string;
  protected values: any;

  constructor(connection: ClientInterface, index: string, values: any) {
    if (!index.length) {
      throw Error('real-time index must be valid but empty name provided');
    }
    if (!(values instanceof Array)) {
      throw Error(`Provide an array or an array of arrays for the values`);
    }
    if (!values.length) {
      throw Error(`empty record can not be inserted`);
    }
    this.connection = connection;
    this.index = index;
    this.values = values;
  }

  protected static renderValues(values: any[]): string {
    const template: string = '?'.repeat(values.length)
      .split('')
      .join(', ');

    return format(`(${template})`, values);
  }

  public generate() : string {
    let valuesFields: string[] = [];

    if (this.values.length && this.values[0] instanceof Array) {
      valuesFields = this.values.map((values) => {
        return InsertStatement.renderValues(values);
      });
    } else {
      valuesFields.push(InsertStatement.renderValues(this.values));
    }

    return `INSERT INTO ${this.index} VALUES ${valuesFields.join(', ')}`;
  }

  public execute() {
    const query = this.generate();
    // make query

    return query;
  }
}
