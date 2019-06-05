import Expression from './Statements/Expression';
import * as sqlstring from 'sqlstring';

export function getExpressionCompare(value: any) {
  if (value instanceof Expression) {
    return value.getExpression();
  }
  if (typeof value === 'string') {
    return sqlstring.escape(value);
  }
  if (typeof value === 'number') {
    return value;
  }

  return value;
}
