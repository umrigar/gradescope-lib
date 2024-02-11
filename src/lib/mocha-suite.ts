import fs from 'fs';

import makeCmdTest from './cmd-test.js';
import * as BaseTypes from './base.js';

import { Errors } from 'cs544-js-utils';

type MochaSuiteInput = BaseTypes.TestSuiteOpts & {
};

//projectBaseDir must contain package.json and be already built
export default function makeMochaSuite(projectBaseDir: string,
				       testPath: string, //rel to projectBaseDir
				       opts: MochaSuiteInput)
  : MochaSuite
{
  return new MochaSuite(projectBaseDir, testPath, opts);
}


class MochaSuite extends BaseTypes.TestSuite {
  private readonly projectBaseDir: string;
  private readonly testPath: string;
  constructor(projectBaseDir: string, testPath: string, opts: MochaSuiteInput) {
    super(makeMochaTestCase(projectBaseDir, testPath, opts),  opts);
    this.projectBaseDir = projectBaseDir; this.testPath = testPath;
  }

  async run() : Promise<Errors.Result<BaseTypes.TestCaseInfo[]>> {
    type Stats = { nTests: number, nSkips: number, nFails: number, };
    type MochaInfo = {
      title: string,
      fullTitle: string,
      err: { message?: string, },
    };
    const superResult = await super.run();
    if (!superResult.isOk) return superResult;
    const stdout = superResult.val[0]!.stdout ?? '';
    let mochaOut: Record<string, MochaInfo[]>;
    try {
      mochaOut = JSON.parse(stdout);
    }
    catch (err) {
      return Errors.errResult(`bad JSON from mocha: ${err}\n${stdout}`);
    }
    const { tests, pending, failures } = mochaOut;
    const pendingTitles = new Set(pending.map(p => p.fullTitle! as string));
    const failureTitles = new Set(failures.map(f => f.fullTitle! as string));
    const infos: BaseTypes.TestCaseInfo[] = [];
    for (const [i, test] of tests.entries()) {
      let output = '';
      const { title, fullTitle } = test;
      if (!title || !fullTitle) {
	output += `no title/fullTitle for test ${i}`;
	infos.push({ score: 0.0, name: 'UNKNOWN', status: 'failed', output });
      }
      else {
	const statusDetails =
	  pendingTitles.has(fullTitle)
	  ? 'skipped'
	  : failureTitles.has(fullTitle)
	  ? 'failed'
	  : 'passed';
	if (test.err.message) output += test.err.message;
	if (statusDetails === 'skipped') output += `**Skipped**\n `;
	infos.push({ score: 0.0,
		     name: title,
		     status: statusDetails === 'passed' ? 'passed' : 'failed',
		     output
		   });
      }
    }
    return Errors.okResult(infos);
  }
  
}

function makeMochaTestCase(projectBaseDir: string, testPath: string,
			   opts: MochaSuiteInput)
{
  const cmd = `cd ${projectBaseDir}; npx mocha --reporter json ${testPath}`;
  return [ makeCmdTest(cmd, opts), ];
}
