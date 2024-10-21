import makeCmdTest from './cmd-test.js';
import * as BaseTypes from './base.js';
import { Errors } from 'cs544-js-utils';
export default function makeLogLinesSuite(cmd, opts) {
    return new LogLinesSuite(cmd, opts);
}
class LogLinesSuite extends BaseTypes.TestSuite {
    opts;
    constructor(cmd, opts) {
        super(makeLogLinesTestCase(cmd, opts), opts);
        this.opts = opts;
    }
    async run() {
        const { ignoreRe, matchRe, nameRe, okRe } = this.opts;
        const superResult = await super.run();
        if (!superResult.isOk)
            return superResult;
        const stdout = superResult.val[0].stdout ?? '';
        const infos = [];
        for (const line of stdout.split('\n')) {
            if (ignoreRe && ignoreRe.test(line))
                continue;
            if (matchRe && !matchRe.test(line))
                continue;
            const m = line.match(nameRe);
            const name = (m && m[1]) ?? '';
            const isFailed = !okRe.test(line);
            const info = {
                score: 0.0,
                name: name,
                status: isFailed ? 'failed' : 'passed',
                output_format: 'md',
                output: line,
            };
            infos.push(info);
        }
        return Errors.okResult(infos);
    }
}
function makeLogLinesTestCase(cmd, opts) {
    return [makeCmdTest(cmd, opts),];
}
//# sourceMappingURL=log-lines-suite.js.map