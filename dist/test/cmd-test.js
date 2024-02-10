import makeTest from '../lib/cmd-test.js';
import { assert, expect } from 'chai';
import fs from 'fs';
//use assert(result.isOk === true) and assert(result.isOk === false)
//to ensure that typescript narrows result correctly
describe('command tests without diffs', () => {
    it('must succeed for running ls command', async () => {
        const test = makeTest('ls', { name: 'ls', });
        const result = await test.run({});
        assert(result.isOk);
        expect(result.val.status).to.equal('passed');
        expect(result.val.output).to.not.have.length(0);
    });
    it('must fail for running ls command with expected failure', async () => {
        const test = makeTest('ls', { name: 'ls', mustFail: true });
        const result = await test.run({});
        assert(result.isOk);
        expect(result.val.status).to.equal('failed');
        expect(result.val.output).to.not.have.length(0);
    });
    it('must fail for running false command', async () => {
        const test = makeTest('false', { name: 'false', });
        const result = await test.run({});
        assert(result.isOk);
        expect(result.val.status).to.equal('failed');
    });
    it('must succeed for false command with expected failure', async () => {
        const test = makeTest('false', { name: 'false to fail', mustFail: true });
        const result = await test.run({});
        assert(result.isOk);
        expect(result.val.status).to.equal('passed');
    });
});
describe('command tests with diffs', () => {
    beforeEach(() => fs.writeFileSync(IN_PATH, CONTENT, 'utf8'));
    afterEach(() => fs.unlinkSync(IN_PATH));
    it('must succeed for copying file to stdout', async () => {
        const diffSpecs = [
            { expectedPath: IN_PATH,
                actualPath: OUT_PATH,
                label: 'copy',
            },
        ];
        const opts = { name: 'copy', diffSpecs };
        const test = makeTest(`cat "${IN_PATH}" > "${OUT_PATH}"`, opts);
        const result = await test.run({});
        assert(result.isOk);
        expect(result.val.status).to.equal('passed');
    });
    it('must succeed for copying stdin to stdout', async () => {
        const diffSpecs = [
            { expectedPath: IN_PATH,
                actualPath: OUT_PATH,
                label: 'copy',
            },
        ];
        const opts = { name: 'copy', diffSpecs };
        const test = makeTest(`cat < "${IN_PATH}" > "${OUT_PATH}"`, opts);
        const result = await test.run({});
        assert(result.isOk);
        expect(result.val.status).to.equal('passed');
    });
    it('must succeed for echoing content', async () => {
        const diffSpecs = [
            { expectedPath: IN_PATH,
                actualPath: OUT_PATH,
                label: 'copy',
            },
        ];
        const opts = { name: 'echo', diffSpecs };
        const test = makeTest(`echo -n "${CONTENT}" > "${OUT_PATH}"`, opts);
        const result = await test.run({});
        assert(result.isOk);
        expect(result.val.status).to.equal('passed');
    });
    it('must fail for echoing content with extra newline', async () => {
        const diffSpecs = [
            { expectedPath: IN_PATH,
                actualPath: OUT_PATH,
                label: 'copy',
            },
        ];
        const opts = { name: 'echo', diffSpecs };
        const test = makeTest(`echo "${CONTENT}" > "${OUT_PATH}"`, opts);
        const result = await test.run({});
        assert(result.isOk);
        expect(result.val.status).to.equal('failed');
    });
});
const IN_PATH = `/tmp/cmd-test.in`;
const OUT_PATH = `/tmp/cmd-test.out`;
const CONTENT = `
  Betty bought a bit of butter
  But the bit of butter was bitter
  So Betty bought a better bit of butter
  To make the bitter butter better.
`.replace('\n', '');
//# sourceMappingURL=cmd-test.js.map