import ClientInterface from './ClientInterface';
import InsertStatement from './Statements/InsertReplaceStatement';
import SelectStatement from './Statements/SelectStatement';
import TransactionStatement from './Statements/TransactionStatement';
import UpdateStatement from './Statements/UpdateStatement';
import DeleteStatement from './Statements/DeleteStatement';
import AttachIndexStatement from './Statements/AttachIndexStatement';
import TruncateStatement from './Statements/TruncateStatement';
import ReloadIndexStatement from './Statements/ReloadIndexStatement';
import OptimizeIndexStatement from './Statements/OptimizeIndexStatement';

export default class QueryBuilder {
  // protected type: QueryType;
  protected connection: ClientInterface;

  constructor(connection: ClientInterface) {
    this.connection = connection;
  }

  /**
   *
   * @param q
   * @param values
   */
  public query(q: string, values?: Array<any>) : Promise<any> {
    if (values !== undefined) {
      return this.connection.execute(q, values);
    }

    return this.connection.query(q);
  }

  public select(...fields: string[]): SelectStatement {
    return new SelectStatement(this.connection, ...fields);
  }

  public insert(index: string, values: any): InsertStatement {
    return new InsertStatement(this.connection, index, values);
  }

  public replace(index: string, values: any): InsertStatement {
    return new InsertStatement(this.connection, index, values, 'REPLACE');
  }

  public update(index: string): UpdateStatement {
    return new UpdateStatement(this.connection, index);
  }

  public delete(index: string): DeleteStatement {
    return new DeleteStatement(this.connection, index);
  }

  public optimizeIndex(index: string): OptimizeIndexStatement {
    return new OptimizeIndexStatement(this.connection, index);
  }

  public attachIndex(diskIndex: string): AttachIndexStatement {
    return new AttachIndexStatement(this.connection, diskIndex);
  }

  public truncate(rtIndex: string): TruncateStatement {
    return new TruncateStatement(this.connection, rtIndex);
  }

  public reloadIndex(index: string): ReloadIndexStatement {
    return new ReloadIndexStatement(this.connection, index);
  }

  get transaction(): TransactionStatement {
    return new TransactionStatement(this.connection);
  }
}
