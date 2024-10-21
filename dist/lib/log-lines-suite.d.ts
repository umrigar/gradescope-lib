import * as BaseTypes from './base.js';
import { Errors } from 'cs544-js-utils';
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
    run(): Promise<Errors.Result<BaseTypes.TestCaseInfo[]>>;
}
export {};
//# sourceMappingURL=log-lines-suite.d.ts.map