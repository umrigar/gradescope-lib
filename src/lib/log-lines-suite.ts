import fs from 'fs';

import makeCmdTest from './cmd-test.js';
import * as BaseTypes from './base.js';

import * as E from './errors.js';

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

  async run() : Promise<E.Result<BaseTypes.TestCaseInfo[], E.Err>> {
    const { ignoreRe, matchRe, nameRe, okRe } = this.opts;
    const superResult = await super.run();
    if (!superResult.isOk) return superResult;
    const stdout = superResult.val[0]!.stdout ?? '';
    const infos: BaseTypes.TestCaseInfo[] = [];
    for (const line of stdout.split('\n')) {
      if (ignoreRe && ignoreRe.test(line)) continue;
      if (matchRe && !matchRe.test(line)) continue;
      const m = line.match(nameRe);
      let name = (m && m[1]) ?? '';
      const isFailed = !okRe.test(line);
      const status = isFailed ? 'failed' : 'passed';
      const maxScore = (this.opts.max_score ?? 0.0);
      const score = (status == 'passed') ? maxScore : 0.0;
      if (maxScore > 0) name += ` (${score}/${maxScore})`;
      const info: BaseTypes.TestCaseInfo = {
	name: name,
	score,
	status,
	output_format: 'md',
	output: line,
      };
      infos.push(info);
    }
    return E.okResult(infos);
  }
  
}



function makeLogLinesTestCase(cmd: string, opts: LogLinesSuiteInput) {
  return [ makeCmdTest(cmd, opts), ];
}
