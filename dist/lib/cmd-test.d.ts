import { TestInput, TestInputOpts, TestCase, TestCaseInfo } from './base.js';
import * as E from './errors.js';
type DiffSpec = {
    expectedPath: string;
    actualPath: string;
    label?: string;
};
type CmdTestInput = TestInput & {
    mustFail?: boolean;
    stderrMustBeEmpty?: boolean;
    diffSpecs?: DiffSpec[];
};
export default function makeCmdTest(cmd: string, opts: CmdTestInput): CmdTest;
declare class CmdTest implements TestCase {
    private readonly cmd;
    readonly opts: CmdTestInput;
    constructor(cmd: string, opts: CmdTestInput);
    run(suiteOpts: TestInputOpts): Promise<E.Result<TestCaseInfo, E.Err>>;
}
export {};
//# sourceMappingURL=cmd-test.d.ts.map