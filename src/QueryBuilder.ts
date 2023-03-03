import FlushRTIndexStatement from './Statements/FlushRTIndexStatement';
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
  /**
   * Run raw queries and passes an array (optional) of parameters.
   * Returns a promise with the result in mysql2 connector return the format
   * @param q
   * @param values
   */

  public select(...fields: string[]): SelectStatement {
    return new SelectStatement(...fields);
  }

  public insert(index: string, values: any): InsertStatement {
    return new InsertStatement(index, values);
  }

  public replace(index: string, values: any): InsertStatement {
    return new InsertStatement(index, values, 'REPLACE');
  }

  public update(index: string): UpdateStatement {
    return new UpdateStatement(index);
  }

  public delete(index: string): DeleteStatement {
    return new DeleteStatement(index);
  }

  public optimizeIndex(index: string): OptimizeIndexStatement {
    return new OptimizeIndexStatement(index);
  }

  public attachIndex(diskIndex: string): AttachIndexStatement {
    return new AttachIndexStatement(diskIndex);
  }

  public flushRTIndex(index: string): FlushRTIndexStatement {
    return new FlushRTIndexStatement(index);
  }

  public truncate(rtIndex: string): TruncateStatement {
    return new TruncateStatement(rtIndex);
  }

  public reloadIndex(index: string): ReloadIndexStatement {
    return new ReloadIndexStatement(index);
  }

  get transaction(): TransactionStatement {
    return new TransactionStatement();
  }
}
