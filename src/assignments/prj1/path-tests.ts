import { TestSuite, TestSuiteOpts } from '../../lib/base.js';
import makePathTest from '../../lib/path-test.js';

function test(path: string, mustExist = true) {
  const neg = mustExist ? '' : ' does not';
  const name = `check ${path}${neg} exists`;
  return makePathTest(path, { name });
}

const PRJ_DIR = './prj1-sol';
const TESTS = [
  test(`${PRJ_DIR}/make.sh`),
  test(`${PRJ_DIR}/run.sh`),
  test(`${PRJ_DIR}/elixir-data.ebnf`),
];



const SUITE_OPTS: TestSuiteOpts = {
  abortOnFail: true,
  visibility: 'visible',
  name: 'Path Tests',
};
export default new TestSuite(TESTS, SUITE_OPTS);



  
