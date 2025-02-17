import fs from 'fs';
import * as E from './errors.js';
export default function makePathTest(path, opts) {
    return new PathTest(path, opts);
}
class PathTest {
    path;
    opts;
    constructor(path, opts) {
        this.path = path;
        this.opts = opts;
    }
    async run(suiteOpts) {
        const path = this.path;
        const opts = { ...suiteOpts, ...this.opts };
        const name = opts.name ?? `Checking for path ${path} in submission...`;
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
//# sourceMappingURL=path-test.js.map