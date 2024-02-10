import { TestInput, TestInputOpts, TestCase, TestCaseInfo } from './base.js';
import { Errors } from 'cs544-js-utils';
type PathTestInput = TestInput & {
    isForbidden?: boolean;
};
export default function makePathTest(path: string, opts: PathTestInput): PathTest;
declare class PathTest implements TestCase {
    private readonly path;
    private readonly opts;
    constructor(path: string, opts: PathTestInput);
    run(suiteOpts: TestInputOpts): Promise<Errors.Result<TestCaseInfo>>;
}
export {};
//# sourceMappingURL=path-test.d.ts.map