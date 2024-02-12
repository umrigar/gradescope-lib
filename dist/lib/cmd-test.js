import fs from 'fs';
import child_process from 'child_process';
import util from 'util';
import { Errors } from 'cs544-js-utils';
const promisify = util.promisify;
const exec = promisify(child_process.exec);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
export default function makeCmdTest(cmd, opts) {
    return new CmdTest(cmd, opts);
}
class CmdTest {
    cmd;
    opts;
    constructor(cmd, opts) {
        this.cmd = cmd;
        this.opts = opts;
    }
    async run(suiteOpts) {
        const cmd = this.cmd;
        const opts = this.opts;
        const name = opts.name;
        try {
            const execOpts = makeExecOpts(opts);
            const { error, stdout, stderr } = await execCmd(cmd, execOpts);
            let output = '';
            if (error) {
                output += `**Error Code**: ${error.code ?? error.signal}\n`;
                if (error.signal) {
                    output += `${JSON.stringify(error, null, 2)}\n `;
                }
            }
            if (stdout)
                output += `### Standard Output\n${stdout}\n`;
            if (stderr)
                output += `### Standard Error\n${stderr}\n`;
            const mustFail = !!opts.mustFail;
            const isOk = (error === undefined) || (error.signal && opts.okOnSignal);
            let status = (mustFail === !isOk) ? 'passed' : 'failed';
            if (!mustFail && error === undefined) {
                for (const diffSpec of (opts.diffSpecs ?? [])) {
                    const diffResult = await doDiff(diffSpec, execOpts);
                    if (!diffResult.isOk) {
                        status = 'failed';
                        const err = diffResult.errors[0];
                        if (err.options.code === 'DIFF') {
                            output += `diff ${diffSpec.label ?? ''}\n`;
                            output += err.options.diff;
                        }
                        else {
                            output += `diff ${diffSpec.label ?? ''} failed\n`;
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
                stdout,
                stderr,
            });
        }
        catch (err) {
            return Errors.errResult(`error running test ${name}: ${err}`);
        }
    }
}
const TIMEOUT_MILLIS = 2000;
function makeExecOpts(opts) {
    return {
        timeout: opts.timeoutMillis ?? TIMEOUT_MILLIS,
    };
}
async function doDiff(diffSpec, opts) {
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
async function execCmd(cmd, execOpts) {
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
//# sourceMappingURL=cmd-test.js.map