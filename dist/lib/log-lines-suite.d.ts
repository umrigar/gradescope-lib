import * as BaseTypes from './base.js';
import * as E from './errors.js';
type LogLinesSuiteInput = BaseTypes.TestSuiteOpts & {
    ignoreRe?: RegExp;
    matchRe?: RegExp;
    nameRe: RegExp;
    okRe: RegExp;
};
export default function makeLogLinesSuite(cmd: string, opts: LogLinesSuiteInput): LogLinesSuite;
declare class LogLinesSuite extends BaseTypes.TestSuite {
    readonly opts: LogLinesSuiteInput;
    constructor(cmd: string, opts: LogLinesSuiteInput);
    run(): Promise<E.Result<BaseTypes.TestCaseInfo[], E.Err>>;
}
export {};
//# sourceMappingURL=log-lines-suite.d.ts.map