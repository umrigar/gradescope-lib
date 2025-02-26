import * as E from './errors.js';
export type TestSuiteOpts = TestInputOpts & {
    name: string;
    abortOnFail?: boolean;
};
export declare class TestSuite {
    readonly testCases: TestCase[];
    readonly opts: TestSuiteOpts;
    constructor(testCases: TestCase[], opts: TestSuiteOpts);
    run(): Promise<E.Result<TestCaseInfo[], E.Err>>;
}
export interface TestCase {
    readonly opts: TestInputOpts;
    run(suiteOpts: TestInputOpts): Promise<E.Result<TestCaseInfo, E.Err>>;
}
export type GradescopeResults = {
    output: string;
    output_format: OutputFormat;
    stdout_visibility: Visibility;
    tests: TestCaseInfo[];
};
export type TestInput = {
    name: string;
    max_score?: number;
    name_format?: OutputFormat;
    output_format?: OutputFormat;
    "number"?: string;
    tags?: string[];
    visibility?: Visibility;
    timeoutMillis?: number;
};
export type TestInputOpts = Partial<TestInput>;
export type TestOutput = {
    status: Status;
    output: string;
    score?: number;
    extra_data?: Record<string, any>;
    stdout?: string;
    stderr?: string;
};
export type TestCaseInfo = TestInput & TestOutput;
export type Visibility = 'after_due_date' | //shown only after due date
'after_published' | //after grades pubished
'hidden' | //never shown to students
'visible';
export type OutputFormat = 'ansi' | 'html' | 'md' | 'simple_format' | 'text';
export type Status = 'failed' | 'passed';
//# sourceMappingURL=base.d.ts.map