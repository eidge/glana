import IGCParser from 'igc-parser';

class Parser {
  parse(igc_contents: string) {
    return IGCParser.parse(igc_contents);
  }
}

export default Parser;
