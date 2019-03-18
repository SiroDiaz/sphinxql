import { QueryType } from './QueryType';

export default class QueryBuilder {
  type: QueryType;

  constructor(type: QueryType) {
    this.type = type;
  }
}
