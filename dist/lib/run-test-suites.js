import { Errors } from 'cs544-js-utils';
//cwd == /autograder/submission
export default async function runTestSuites(descr, suites) {
    const testCaseInfos = [];
    let output = `# ${descr}`;
    for (const suite of suites) {
        let suiteName = 'UNKNOWN';
        try {
            suiteName = suite.opts.name;
            output += `## ${suiteName}`;
            const suiteResult = await suite.run();
            if (!suiteResult.isOk)
                return suiteResult;
            const suiteInfos = suiteResult.val;
            testCaseInfos.push(...suiteResult.val);
            const doAbort = suite.opts.abortOnFail
                && suiteInfos.some(info => info.status === 'failed');
            if (doAbort) {
                output += `tests aborted on failing test suite ${suiteName}`;
                break;
            }
        }
        catch (err) {
            return Errors.errResult(`error running testsuite ${suiteName}: ${err}`);
        }
    }
    const gradescopeResults = makeGradescopeResults(output, testCaseInfos);
    return Errors.okResult(gradescopeResults);
}
function makeGradescopeResults(output, testCaseInfos) {
    return {
        output,
        output_format: 'md',
        stdout_visibility: 'visible',
        tests: testCaseInfos,
    };
}
//# sourceMappingURL=run-test-suites.js.map