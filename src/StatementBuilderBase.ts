export default abstract class StatementBuilderBase {
  private value;

  abstract build() : String;
  abstract validate() : Boolean;
}