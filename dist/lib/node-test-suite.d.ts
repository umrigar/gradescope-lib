import * as BaseTypes from './base.js';
import * as E from './errors.js';
type NodeTestSuiteInput = BaseTypes.TestSuiteOpts & {
    testPatterns?: string[];
    isCliTest?: boolean;
};
export default function makeNodeTestSuite(projectBaseDir: string, testPath: string, //rel to projectBaseDir
opts: NodeTestSuiteInput): NodeTestSuite;
declare class NodeTestSuite extends BaseTypes.TestSuite {
    readonly projectBaseDir: string;
    readonly testPath: string;
    constructor(projectBaseDir: string, testPath: string, opts: NodeTestSuiteInput);
    run(): Promise<E.Result<BaseTypes.TestCaseInfo[], E.Err>>;
    appendTestInfos(testOut: any, infos: BaseTypes.TestCaseInfo[], isTestCase?: boolean, labels?: string): void;
}
export {};
//# sourceMappingURL=node-test-suite.d.ts.map