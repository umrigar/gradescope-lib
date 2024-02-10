import { Errors } from 'cs544-js-utils';
//cwd == /autograder/submission
export default async function run_test_suites(descr, suites) {
    const testCaseInfos = [];
    let output = `# ${descr}`;
    for (const suite of suites) {
        let suiteName = 'UNKNOWN';
        try {
            suiteName = suite.opts.name;
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
/*
function errors<T>(result: Errors.Result<T>) {
  if (result.isOk) return;
  for (const err of result.errors) {
    let msg = `${err.options.code}: ${err.message}`;
    let opts = '';
    for (const [k, v] of Object.entries(err.options)) {
      if (k === 'code') continue;
      opts += `${k}=${v}`;
    }
    if (opts.length > 0) msg += '; ' + opts;
    console.error(msg);
  }
}

function panic<T>(result: Errors.Result<T>) : never {
  errors(result);
  process.exit(1);
}
*/
//# sourceMappingURL=run-tests.js.map