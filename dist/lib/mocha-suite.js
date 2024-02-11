import makeCmdTest from './cmd-test.js';
import * as BaseTypes from './base.js';
import { Errors } from 'cs544-js-utils';
export const DEFAULT_TEST_PATH = 'dist/grade-tests';
//projectBaseDir must contain package.json and be already built
export default function makeMochaSuite(projectBaseDir, opts) {
    return new MochaSuite(projectBaseDir, opts);
}
class MochaSuite extends BaseTypes.TestSuite {
    projectBaseDir;
    constructor(projectBaseDir, opts) {
        super(makeMochaTestCase(projectBaseDir, opts), opts);
        this.projectBaseDir = projectBaseDir;
    }
    async run() {
        const superResult = await super.run();
        if (!superResult.isOk)
            return superResult;
        const stdout = superResult.val[0].stdout ?? '';
        let mochaOut;
        try {
            mochaOut = JSON.parse(stdout);
        }
        catch (err) {
            return Errors.errResult(`bad mocha JSON ${stdout}`);
        }
        const { tests, pending, failures } = mochaOut;
        const pendingTitles = new Set(pending.map(p => p.fullTitle));
        const failureTitles = new Set(failures.map(f => f.fullTitle));
        const infos = [];
        for (const [i, test] of tests.entries()) {
            let output = '';
            const { title, fullTitle } = test;
            if (!title || !fullTitle) {
                output += `no title/fullTitle for test ${i}`;
                infos.push({ score: 0.0, name: 'UNKNOWN', status: 'failed', output });
            }
            else {
                const statusDetails = pendingTitles.has(fullTitle)
                    ? 'skipped'
                    : failureTitles.has(fullTitle)
                        ? 'failed'
                        : 'passed';
                if (test.err.message)
                    output += test.err.message;
                if (statusDetails === 'skipped')
                    output += `**Skipped**\n `;
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
function makeMochaTestCase(projectBaseDir, opts) {
    const testPath = opts.testPath ?? DEFAULT_TEST_PATH;
    const cmd = `cd ${projectBaseDir}; npx mocha --reporter json ${testPath}`;
    return [makeCmdTest(cmd, opts),];
}
//# sourceMappingURL=mocha-suite.js.map