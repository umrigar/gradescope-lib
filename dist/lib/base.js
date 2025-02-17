//set up for specific gradescope output
import * as E from './errors.js';
export class TestSuite {
    testCases;
    opts;
    constructor(testCases, opts) {
        this.testCases = testCases;
        this.opts = opts;
    }
    async run() {
        const testCaseInfos = [];
        for (const testCase of this.testCases) {
            const inputOpts = {
                ...DEFAULT_TEST_INPUT, ...this.opts, ...testCase.opts,
            };
            const millis = inputOpts.timeoutMillis;
            const result0 = await doTestCaseWithTimeout(testCase, inputOpts, millis);
            if (!result0.isOk)
                return result0;
            const result = { ...inputOpts, ...result0.val };
            testCaseInfos.push(result);
        }
        return E.okResult(testCaseInfos);
    }
}
;
async function doTestCaseWithTimeout(testCase, opts, timeoutMillis) {
    //should be ReturnType<typeof setTimeout>, but ts insisting on number
    //when third argument passed to setTimeout()
    let timer;
    try {
        const testPromise = new Promise(async (resolve) => resolve(await testCase.run(opts)));
        const timeoutPromise = new Promise(resolve => {
            const timeoutMsg = `timeout of ${timeoutMillis} millis exceeded running ${opts.name}`;
            const timeoutError = E.errResult(timeoutMsg);
            timer = setTimeout(resolve, timeoutMillis, timeoutError);
        });
        return await Promise.race([testPromise, timeoutPromise]);
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
const DEFAULT_TEST_INPUT = {
    name_format: 'md',
    output_format: 'md',
    visibility: 'after_published',
    timeoutMillis: 2000,
};
//# sourceMappingURL=base.js.map