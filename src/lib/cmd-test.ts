import fs from 'fs';
import child_process from 'child_process';
import util from 'util';

import { TestInput, TestInputOpts, TestCase, TestCaseInfo, Status }
  from './base.js';

import { Errors } from 'cs544-js-utils';

const promisify = util.promisify;
const exec = promisify(child_process.exec);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

type DiffSpec = {
  expectedPath: string,
  actualPath: string,
  label?: string,
};
type CmdTestInput = TestInput & {
  mustFail?: boolean,      //command must fail for test to succeed
  diffSpecs?: DiffSpec[],  //paths to be diff'd
};

export default function makeCmdTest(cmd: string, opts: CmdTestInput) {
  return new CmdTest(cmd, opts);
}


class CmdTest implements TestCase {
  private readonly cmd: string;
  private readonly opts: CmdTestInput;
  constructor(cmd: string, opts: CmdTestInput) {
    this.cmd = cmd;
    this.opts = opts;
  }

  async run(suiteOpts: TestInputOpts) : Promise<Errors.Result<TestCaseInfo>> {
    const cmd = this.cmd;
    const opts = this.opts;
    const name =  opts.name;
    try {
      const execOpts = makeExecOpts(opts);
      const { error, stdout, stderr } = await execCmd(cmd, execOpts);
      let output = '';
      if (error) {
	output += `**Error Code**: ${error.code}\n`;
	output += error.message;
	console.log(JSON.stringify(error, null, 2));
      }
      if (stdout) output += `### Standard Output\n${stdout}\n`;
      if (stderr) output += `### Standard Error\n${stderr}\n`;
      const mustFail = !!opts.mustFail;
      const didError = (error !== undefined);
      let status: Status = (mustFail === didError) ? 'passed' : 'failed';
      if (!mustFail && !didError) {
	for (const diffSpec of (opts.diffSpecs ?? [])) {
	  const diffResult = await doDiff(diffSpec, execOpts);
	  if (!diffResult.isOk) {
	    status = 'failed';
	    const err = diffResult.errors[0]!;
	    if (err.options.code === 'DIFF') {
	      output += `diff ${diffSpec.label??''}\n`;
	      output += err.options.diff;
	    }
	    else {
	      output += `diff ${diffSpec.label??''} failed\n`;
	      output += err.message;	      
	    }
	  }
	}
      }
      return Errors.okResult({
	score: 0.0,
	status,
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

const TIMEOUT_MILLIS = 2000;

type ExecOpts = { timeout: number };
function makeExecOpts(opts: CmdTestInput) : ExecOpts {
  return {
    timeout: opts.timeoutMillis ?? TIMEOUT_MILLIS,
  };
}


async function doDiff(diffSpec: DiffSpec, opts: ExecOpts) {
  const { expectedPath, actualPath, label } = diffSpec;
  const cmd = `diff -u "${expectedPath}" "${actualPath}"`;
  const { error, stdout, stderr } = await execCmd(cmd, opts);
  if (error) {
    if (error.code == 1) {
      const err = Errors.errResult('diff', { code: 'DIFF', diff: stdout });
      return err;
    }
    else {
      const msg = `cannot exec \`${cmd}\`: ${error.message}`;
      return Errors.errResult(msg, 'ERR');
    }
  }
  else {
    console.assert(stdout === '');
    console.assert(stderr === '');
    return Errors.VOID_RESULT;
  }
}

async function execCmd(cmd: string, execOpts: ExecOpts) {
  let stdout, stderr, error;
  try {
    ({ stdout, stderr } = await exec(cmd, execOpts));
  }
  catch (err) {
    error = err;
    ({ stdout, stderr } = err);    
  }
  return { error, stderr, stdout, };
}


