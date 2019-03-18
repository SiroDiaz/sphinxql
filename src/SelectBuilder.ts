import StatementBuilderBase from './StatementBuilderBase';

export default class SelectBuilder extends StatementBuilderBase {
  build(): String {
    throw new Error("Method not implemented.");
  }
  
  validate(): Boolean {
    throw new Error("Method not implemented.");
  }
}