//set up for specific gradescope output

import * as E from './errors.js';

export type TestSuiteOpts = TestInputOpts & {
  name: string,
  abortOnFail?: boolean
};

export class TestSuite {
  readonly testCases: TestCase[];
  readonly opts: TestSuiteOpts;
  constructor(testCases: TestCase[], opts: TestSuiteOpts) {
    this.testCases = testCases;
    this.opts = opts;
  }

  async run() : Promise<E.Result<TestCaseInfo[], E.Err>> {
    const testCaseInfos: TestCaseInfo[] = [];
    for (const testCase of this.testCases) {
      const inputOpts: TestSuiteOpts = {
	...DEFAULT_TEST_INPUT, ...this.opts, ...testCase.opts,
      };
      const millis = inputOpts.timeoutMillis!;
      const result0 = await doTestCaseWithTimeout(testCase, inputOpts, millis);
      if (!result0.isOk) return result0;
      const result = { ...inputOpts, ...result0.val };
      testCaseInfos.push(result);
    }
    return E.okResult(testCaseInfos);
  }
  
  
};

async function doTestCaseWithTimeout(testCase: TestCase, opts: TestSuiteOpts,
				     timeoutMillis: number)
  : Promise<E.Result<TestCaseInfo, E.Err>>
{
  //should be ReturnType<typeof setTimeout>, but ts insisting on number
  //when third argument passed to setTimeout()
  let timer: number; 
  try {
    const testPromise: Promise<E.Result<TestCaseInfo, E.Err>> =
      new Promise(async (resolve) => resolve(await testCase.run(opts)));
    const timeoutPromise: Promise<E.Result<TestCaseInfo, E.Err>> =
      new Promise(resolve => {
	const timeoutMsg =
	  `timeout of ${timeoutMillis} millis exceeded running ${opts.name}`;	
	const timeoutError = E.errResult(timeoutMsg);
   	timer = setTimeout(resolve, timeoutMillis, timeoutError);
      });
    return await Promise.race([testPromise, timeoutPromise]);
  }
  finally {
    if (timer!) clearTimeout(timer);
  }
}

export interface TestCase {

  readonly opts: TestInputOpts;
  run(suiteOpts: TestInputOpts) : Promise<E.Result<TestCaseInfo, E.Err>>;
  
}

export type GradescopeResults = {
  output: string,
  output_format: OutputFormat,
  stdout_visibility: Visibility,
  tests: TestCaseInfo[],
}


// inputs for individual test cases (usually shared by all tests in a
// test suite)
export type TestInput = {
  //most props related to those documented for individual gradescope tests
  name: string,
  max_score?: number,
  name_format?: OutputFormat,
  output_format?: OutputFormat,
  "number"?: string,
  tags?: string[],
  visibility?: Visibility,
  timeoutMillis?: number,
};

export type TestInputOpts = Partial<TestInput>;

const DEFAULT_TEST_INPUT = {
  name_format: 'md' as OutputFormat,
  output_format: 'md' as OutputFormat,
  visibility: 'after_published' as Visibility,
  timeoutMillis: 2000,
};

export type TestOutput = {
  //most props related to those documented for individual gradescope tests
  status: Status,
  output: string,
  score?: number,
  extra_data?: Record<string, any>,
  stdout?: string,
  stderr?: string,
};


//supertype of gradescope individual test result
export type TestCaseInfo = TestInput & TestOutput;


//gradescope specific types.
export type Visibility =
  'after_due_date' |  //shown only after due date
  'after_published' | //after grades pubished
  'hidden'  |         //never shown to students
  'visible'           //always shown to students  
;

export type OutputFormat =
  'ansi' |
  'html' |
  'md' |
  'simple_format' |
  'text'
;

export type Status = 'failed' | 'passed';


  
