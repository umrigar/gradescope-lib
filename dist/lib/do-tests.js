import fs from 'fs';
import Path from 'path';
import { Errors } from 'cs544-js-utils';
//cwd == /autograder/submission
const RESULTS = 'results.json';
export default async function main() {
    if (process.argv.length < 4) {
        const scriptName = Path.basename(process.argv[1]);
        const msg = `usage: ${scriptName} DESCR TEST_SUITE_FILE..`;
        panic(Errors.errResult(msg));
    }
    const [descr, ...testSuiteFiles] = process.argv.slice(2);
    const testCaseInfos = [];
    for (const f of testSuiteFiles) {
        let suiteName = f;
        let nTotal = 0;
        let nOk = 0;
        try {
            const suite = (await import(f)).default;
            suiteName = suite.opts.name;
            const suiteResult = await suite.run();
            if (!suiteResult.isOk)
                panic(suiteResult);
            const suiteInfos = suiteResult.val;
            testCaseInfos.push(...suiteResult.val);
            const doAbort = suite.opts.abortOnFail
                && suiteInfos.some(info => info.status === 'failed');
            if (doAbort) {
                console.log(`tests aborted on failing test suite ${suiteName}`);
                break;
            }
        }
        catch (err) {
            panic(Errors.errResult(`error running testsuite ${suiteName}: ${err}`));
        }
    }
    const gradescopeResults = makeGradescopeResults(descr, testCaseInfos);
    const resultsJson = JSON.stringify(gradescopeResults);
    fs.writeFileSync(RESULTS, resultsJson, 'utf8');
}
function makeGradescopeResults(descr, testCaseInfos) {
    return {
        output: `# ${descr}`,
        output_format: 'md',
        stdout_visibility: 'visible',
        tests: testCaseInfos,
    };
}
function errors(result) {
    if (result.isOk)
        return;
    for (const err of result.errors) {
        let msg = `${err.options.code}: ${err.message}`;
        let opts = '';
        for (const [k, v] of Object.entries(err.options)) {
            if (k === 'code')
                continue;
            opts += `${k}=${v}`;
        }
        if (opts.length > 0)
            msg += '; ' + opts;
        console.error(msg);
    }
}
function panic(result) {
    errors(result);
    process.exit(1);
}
//# sourceMappingURL=do-tests.js.map