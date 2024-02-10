import fs from 'fs';

import { TestInput, TestInputOpts, TestCase, TestCaseInfo, } from './base.js';

import { Errors } from 'cs544-js-utils';

type PathTestInput = TestInput & {
  isForbidden?: boolean, //path cannot exist
};

export default function makePathTest(path: string, opts: PathTestInput) {
  return new PathTest(path, opts);
}


class PathTest implements TestCase {
  private readonly path: string;
  private readonly opts: PathTestInput;
  constructor(path: string, opts: PathTestInput) {
    this.path = path;
    this.opts = opts;
  }

  async run(suiteOpts: TestInputOpts) : Promise<Errors.Result<TestCaseInfo>> {
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
      return Errors.okResult({
	score: 0.0,
	status: isOk ? 'passed' : 'failed',
	name,
	number: opts.number,
	output,
      });
    }
    catch (err) {
      return Errors.errResult(`error running test ${name}: ${err}`);
    }
  }
  
}
