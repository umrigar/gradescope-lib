import fs from 'fs';

import makeCmdTest from './cmd-test.js';
import * as BaseTypes from './base.js';

import * as E from './errors.js';

type NodeTestSuiteInput = BaseTypes.TestSuiteOpts & {
  testPatterns?: string[],
  isCliTest?: boolean, //for testing from command-line
};

//projectBaseDir must contain package.json and be already built
export default function
makeNodeTestSuite(projectBaseDir: string,
		  testPath: string, //rel to projectBaseDir
		  opts: NodeTestSuiteInput)
  : NodeTestSuite
{
  return new NodeTestSuite(projectBaseDir, testPath, opts);
}


class NodeTestSuite extends BaseTypes.TestSuite {
  readonly projectBaseDir: string;
  readonly testPath: string;

  constructor(projectBaseDir: string, testPath: string,
	      opts: NodeTestSuiteInput) {
    super(makeNodeTestCase(projectBaseDir, testPath, opts),  opts);
    this.projectBaseDir = projectBaseDir; this.testPath = testPath;
  }

  async run() : Promise<E.Result<BaseTypes.TestCaseInfo[], E.Err>> {
    type Stats = { nTests: number, nSkips: number, nFails: number, };
    const superResult = await super.run();
    if (!superResult.isOk) return superResult;
    const stdout = superResult.val[0]!.stdout ?? '';
    let testOut: any;
    try {
      testOut = JSON.parse(stdout);
    }
    catch (err) {
      return E.errResult(E.Err.err(`bad JSON from test: ${err}\n${stdout}`));
    }
    const infos: BaseTypes.TestCaseInfo[] = [];
    this.appendTestInfos(testOut, infos);
    return E.okResult(infos);
  }

  //crappy input format needs context passed from containing object to
  //array elements
  appendTestInfos(testOut: any, infos: BaseTypes.TestCaseInfo[],
		  isTestCase=false, labels='')
  {
    if (Array.isArray(testOut)) {
      testOut.forEach(x => this.appendTestInfos(x, infos, isTestCase, labels));
    }
    else if (!isTestCase) { //presumably a testsuite
      if ((testOut.name ?? '').length > 0) {
	labels += (labels ? ':' : '') + testOut.name;
      }
      if (testOut.testsuite !== undefined) {
	this.appendTestInfos(testOut.testsuite, infos, false, labels);
      }
      else if (testOut.testcase !== undefined) {
	this.appendTestInfos(testOut.testcase, infos, true, labels);
      }
      else {
	console.assert(false, `bad testsuite ${JSON.stringify(testOut)}`);
      }
    }
    else { //isTestCase
      console.assert(testOut.name !== undefined);
      const name = (labels ? `${labels}: ` : '') + testOut.name;
      const status = (testOut.failure || testOut.skipped) ? 'failed' : 'passed';
      const output = //clumsy array access due to input format
	(status === 'passed')
	? ''
        : (testOut.failure)
        ? testOut.failure[0].message
	: testOut.skipped[0].type;
      const score = (status === 'passed') ? (this.opts.max_score ?? 0.0) : 0.0;
      const extra_data = { nodeTest: testOut };
      const testN = (infos.length + 1).toString();
      const output_format = 'md';
      infos.push({name, status, output, output_format, score,
		  extra_data, 'number': testN});
    }
  }
    
}

function makeNodeTestCase(projectBaseDir: string, testPath: string,
			   opts: NodeTestSuiteInput)
{
  const testPatterns = (opts.testPatterns ?? [])
   .map(pattern => `--test-name-pattern "${pattern.replaceAll('"', '\\"')}"`)
			 .join(' ');
  const testCmd = opts.isCliTest
    ? `cat ${testPath}`
    : `node --test --test-reporter junit ${testPatterns} ${testPath}`;
  const cmd = `
    cd ${projectBaseDir};
    ${testCmd}  | npx junit2json -p -
  `;
  return [ makeCmdTest(cmd, opts), ];
}

// for testing from command-line change DO_CLI_TEST to true and then
// run this file using node dist/lib/node-test-suite.js with a single
// argument giving the path to a file containing node-test output in
// junit XML format.
const DO_CLI_TEST = true;

if (DO_CLI_TEST) {
  async function cliTest() {
    const testPath = process.argv[2];
    if (!testPath) { E.panic(`usage: ${process.argv[1]} JUNIT_XML_PATH`); }
    const suite = new NodeTestSuite('.', testPath,
				    {name: 'CLI Tests', isCliTest: true });
    const result = await suite.run();
    if (!result.isOk) E.panic(result.err.toString());
    console.dir(result.val, { depth:  null});
  }

  await cliTest();
}
