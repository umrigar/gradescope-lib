import { TestInput, TestInputOpts, TestCase, TestCaseInfo } from './base.js';
import * as E from './errors.js';
type PathTestInput = TestInput & {
    isForbidden?: boolean;
};
export default function makePathTest(path: string, opts: PathTestInput): PathTest;
declare class PathTest implements TestCase {
    private readonly path;
    readonly opts: PathTestInput;
    constructor(path: string, opts: PathTestInput);
    run(suiteOpts: TestInputOpts): Promise<E.Result<TestCaseInfo, E.Err>>;
}
export {};
//# sourceMappingURL=path-test.d.ts.map