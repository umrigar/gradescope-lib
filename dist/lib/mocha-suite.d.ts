import * as BaseTypes from './base.js';
import { Errors } from 'cs544-js-utils';
type MochaSuiteInput = BaseTypes.TestSuiteOpts & {};
export default function makeMochaSuite(projectBaseDir: string, testPath: string, //rel to projectBaseDir
opts: MochaSuiteInput): MochaSuite;
declare class MochaSuite extends BaseTypes.TestSuite {
    readonly projectBaseDir: string;
    readonly testPath: string;
    constructor(projectBaseDir: string, testPath: string, opts: MochaSuiteInput);
    run(): Promise<Errors.Result<BaseTypes.TestCaseInfo[]>>;
}
export {};
//# sourceMappingURL=mocha-suite.d.ts.map