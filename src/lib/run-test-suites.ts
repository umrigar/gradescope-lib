import fs from 'fs';
import Path from 'path';

import { Errors } from 'cs544-js-utils';

import { TestSuite, TestCase, TestCaseInfo, GradescopeResults,
	 OutputFormat, Visibility,
       }
  from './base.js';

//cwd == /autograder/submission

type SuiteCounts = { nTotal: number, nFailed: number };
export default async function
runTestSuites(descr: string, suites: TestSuite[])
  : Promise<Errors.Result<GradescopeResults>>
{
  const testCaseInfos : TestCaseInfo[] = [];
  let output =  `# ${descr}\n\n`;
  const results: Record<string, SuiteCounts> = {};
  let [ nTotalAcc, nFailedAcc ] = [ 0, 0 ];
  let abortSuite = '';
  for (const suite of suites) {
    let suiteName = 'UNKNOWN';
    try {
      suiteName = suite.opts.name;
      const suiteResult = await suite.run();
      if (!suiteResult.isOk) return suiteResult;
      const suiteInfos = suiteResult.val;
      testCaseInfos.push(...suiteInfos);
      const failInfos = suiteInfos.filter(info => info.status === 'failed');
      const [ nTotal, nFailed ] = [ suiteInfos.length, failInfos.length ];
      nTotalAcc += nTotal; nFailedAcc += nFailed;
      output += `**${suiteName}**: ${nFailed}/${nTotal} failures \n`;
      results[suiteName] = { nTotal, nFailed };
      const doAbort = suite.opts.abortOnFail && nFailed > 0;
      if (doAbort) {
	abortSuite = suiteName;
	break;
      }
    }
    catch (err) {
      return Errors.errResult(`error running testsuite ${suiteName}: ${err}`);
    }
  }
  output += `**Total**: ${nFailedAcc}/${nTotalAcc} failures \n`;
  if (abortSuite) {
    output += `tests aborted on failing test suite ${abortSuite}`;
  }
  const gradescopeResults = makeGradescopeResults(output, testCaseInfos);
  return Errors.okResult(gradescopeResults);
}

function
  makeGradescopeResults(output: string, testCaseInfos: TestCaseInfo[]) 
  : GradescopeResults 
{
  return {
    output,
    output_format: 'md',
    stdout_visibility: 'after_published',
    tests: testCaseInfos,
  };
}




