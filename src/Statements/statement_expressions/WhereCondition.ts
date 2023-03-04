import StatementBuilderBase from '../StatementBuilderBase';
import MatchExprStatement from './MatchStatement';
import WhereStatement from './WhereStatement';


export default class WhereCondition implements StatementBuilderBase {
  protected matchStatement: MatchExprStatement = new MatchExprStatement();
  protected whereConditions: WhereStatement[] = [];

  build(): string {
    let statement = '';
    const hasMatchStatement: boolean = this.matchStatement.getParts().length > 0;
    const hasWhereStatements: boolean = this.whereConditions.length > 0;

    if (hasWhereStatements || hasMatchStatement) {
      statement = ' WHERE ';

      if (hasMatchStatement) {
        statement += `MATCH(${this.matchStatement.build()})`;
        if (hasWhereStatements) {
          statement += ' AND ';
        }
      }

      let stringStatements: string[];
      stringStatements = this.whereConditions.map((condition: StatementBuilderBase) => condition.build());
      statement += stringStatements.join(' AND ');
    }

    return statement;
  }

}