import * as BaseTypes from './base.js';
import * as E from './errors.js';
type MochaSuiteInput = BaseTypes.TestSuiteOpts & {};
export default function makeMochaSuite(projectBaseDir: string, testPath: string, //rel to projectBaseDir
opts: MochaSuiteInput): MochaSuite;
declare class MochaSuite extends BaseTypes.TestSuite {
    readonly projectBaseDir: string;
    readonly testPath: string;
    constructor(projectBaseDir: string, testPath: string, opts: MochaSuiteInput);
    run(): Promise<E.Result<BaseTypes.TestCaseInfo[], E.Err>>;
}
export {};
//# sourceMappingURL=mocha-suite.d.ts.map