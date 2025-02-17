import * as E from './errors.js';
export default async function runTestSuites(descr, suites) {
    const testCaseInfos = [];
    let output = `# ${descr}\n\n`;
    const results = {};
    let [nTotalAcc, nFailedAcc] = [0, 0];
    let abortSuite = '';
    for (const suite of suites) {
        let suiteName = 'UNKNOWN';
        try {
            suiteName = suite.opts.name;
            const suiteResult = await suite.run();
            if (!suiteResult.isOk)
                return suiteResult;
            const suiteInfos = suiteResult.val;
            testCaseInfos.push(...suiteInfos);
            const failInfos = suiteInfos.filter(info => info.status === 'failed');
            const [nTotal, nFailed] = [suiteInfos.length, failInfos.length];
            nTotalAcc += nTotal;
            nFailedAcc += nFailed;
            output += `**${suiteName}**: ${nFailed}/${nTotal} failures \n`;
            results[suiteName] = { nTotal, nFailed };
            const doAbort = suite.opts.abortOnFail && nFailed > 0;
            if (doAbort) {
                abortSuite = suiteName;
                break;
            }
        }
        catch (err) {
            const msg = `error running testsuite ${suiteName}: ${err}`;
            return E.errResult(E.Err.err(msg));
        }
    }
    output += `**Total**: ${nFailedAcc}/${nTotalAcc} failures \n`;
    if (abortSuite) {
        output += `tests aborted on failing test suite ${abortSuite}`;
    }
    const gradescopeResults = makeGradescopeResults(output, testCaseInfos);
    return E.okResult(gradescopeResults);
}
function makeGradescopeResults(output, testCaseInfos) {
    return {
        output,
        output_format: 'md',
        stdout_visibility: 'after_published',
        tests: testCaseInfos,
    };
}
//# sourceMappingURL=run-test-suites.js.map