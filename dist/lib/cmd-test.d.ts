import { TestInput, TestInputOpts, TestCase, TestCaseInfo } from './base.js';
import { Errors } from 'cs544-js-utils';
type DiffSpec = {
    expectedPath: string;
    actualPath: string;
    label?: string;
};
type CmdTestInput = TestInput & {
    mustFail?: boolean;
    diffSpecs?: DiffSpec[];
};
export default function makeCmdTest(cmd: string, opts: CmdTestInput): CmdTest;
declare class CmdTest implements TestCase {
    private readonly cmd;
    private readonly opts;
    constructor(cmd: string, opts: CmdTestInput);
    run(suiteOpts: TestInputOpts): Promise<Errors.Result<TestCaseInfo>>;
}
export {};
//# sourceMappingURL=cmd-test.d.ts.map