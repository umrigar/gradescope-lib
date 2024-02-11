import * as BaseTypes from './base.js';
import { Errors } from 'cs544-js-utils';
export declare const DEFAULT_TEST_PATH = "dist/grade-tests";
type MochaSuiteInput = BaseTypes.TestSuiteOpts & {
    testPath?: string;
};
export default function makeMochaSuite(projectBaseDir: string, opts: MochaSuiteInput): MochaSuite;
declare class MochaSuite extends BaseTypes.TestSuite {
    private readonly projectBaseDir;
    constructor(projectBaseDir: string, opts: MochaSuiteInput);
    run(): Promise<Errors.Result<BaseTypes.TestCaseInfo[]>>;
}
export {};
//# sourceMappingURL=mocha-suite.d.ts.map