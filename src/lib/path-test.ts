import fs from 'fs';

import { TestInput, TestInputOpts, TestCase, TestCaseInfo, } from './base.js';

import * as E from './errors.js';

type PathTestInput = TestInput & {
  isForbidden?: boolean, //path cannot exist
};

export default function makePathTest(path: string, opts: PathTestInput) {
  return new PathTest(path, opts);
}


class PathTest implements TestCase {
  private readonly path: string;
  readonly opts: PathTestInput;
  constructor(path: string, opts: PathTestInput) {
    this.path = path;
    this.opts = opts;
  }

  async run(suiteOpts: TestInputOpts) : Promise<E.Result<TestCaseInfo, E.Err>> {
    const path = this.path;
    const opts = {...suiteOpts, ...this.opts };
    const name =  opts.name ?? `Checking for path ${path} in submission...`;
    try {
      const isForbidden = opts.isForbidden ?? false;
      const exists = fs.existsSync(path);
      const isOk = isForbidden ? !exists : exists;
      const prefix = isForbidden ? 'Forbidden path' : 'Required path';
      const existsStr = exists ? 'exists' : 'does not exist';
      let output = `${prefix} \`${path}\` ${existsStr}`;
      return E.okResult({
	score: isOk ? (opts.max_score ?? 0.0) : 0.0,
	status: isOk ? 'passed' : 'failed',
	name,
	number: opts.number,
	output,
      });
    }
    catch (err) {
      return E.errResult(E.Err.err(`error running test ${name}: ${err}`));
    }
  }
  
}
