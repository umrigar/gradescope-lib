import fs from 'fs';

import makeCmdTest from './cmd-test.js';
import * as BaseTypes from './base.js';

import { Errors } from 'cs544-js-utils';

type LogLinesSuiteInput = BaseTypes.TestSuiteOpts & {
  ignoreRe?: RegExp,  // skip line if this matches
  matchRe?: RegExp,   // skip line if this does not match
  nameRe: RegExp,     // extract test name as $1 from this match
  okRe: RegExp,       // must match if test passed
};

export default function makeLogLinesSuite(cmd: string,
					  opts: LogLinesSuiteInput)
  : LogLinesSuite
{
  return new LogLinesSuite(cmd, opts);
}


class LogLinesSuite extends BaseTypes.TestSuite {
  readonly opts: LogLinesSuiteInput;
  constructor(cmd: string, opts: LogLinesSuiteInput) {
    super(makeLogLinesTestCase(cmd, opts),  opts);
    this.opts = opts;
  }

  async run() : Promise<Errors.Result<BaseTypes.TestCaseInfo[]>> {
    const { ignoreRe, matchRe, nameRe, okRe } = this.opts;
    const superResult = await super.run();
    if (!superResult.isOk) return superResult;
    const stdout = superResult.val[0]!.stdout ?? '';
    const infos: BaseTypes.TestCaseInfo[] = [];
    for (const line of stdout.split('\n')) {
      if (ignoreRe && ignoreRe.test(line)) continue;
      if (matchRe && !matchRe.test(line)) continue;
      const m = line.match(nameRe);
      const name = (m && m[1]) ?? '';
      const isFailed = !okRe.test(line);
      const status = isFailed ? 'failed' : 'passed';      
      const info: BaseTypes.TestCaseInfo = {
	score: (status == 'passed') ? (this.opts.max_score ?? 0.0) : 0.0,
	name: name,
	status,
	output_format: 'md',
	output: line,
      };
      infos.push(info);
    }
    return Errors.okResult(infos);
  }
  
}



function makeLogLinesTestCase(cmd: string, opts: LogLinesSuiteInput) {
  return [ makeCmdTest(cmd, opts), ];
}
