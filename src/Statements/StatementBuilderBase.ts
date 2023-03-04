export default interface StatementBuilderBase {
  /**
   * Builds the statement and return it as a string.
   * Each statement has it own implementation to generate a valid
   * SphinxQL query.
   */
  build(): string;
}
