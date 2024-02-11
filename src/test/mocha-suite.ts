import makeMochaSuite from '../lib/mocha-suite.js';

import { assert, expect } from 'chai';

import Path from 'path';

//use assert(result.isOk === true) and assert(result.isOk === false)
//to ensure that typescript narrows result correctly

describe('mocha suite tests', () => {

  let baseDir: string;

  beforeEach(() => baseDir = getBaseDir());

  it('must run all okay tests', async () => {
    const testPath = TEST_PATHS.ok;
    const suite = makeMochaSuite(baseDir, { name: 'All Ok', testPath });
    const result = await suite.run();
    assert(result.isOk);
    expect(result.val.length).is.above(0);
    expect(result.val.every(info => info.status === 'passed')).equal(true);
  });

  it('must run all failed tests', async () => {
    const testPath = TEST_PATHS.fail;
    const suite = makeMochaSuite(baseDir, { name: 'All Fail', testPath });
    const result = await suite.run();
    assert(result.isOk);
    expect(result.val.length).is.above(0);
    expect(result.val.every(info => info.status === 'failed')).to.equal(true);
  });

  it('must run mixed tests', async () => {
    const testPath = TEST_PATHS.mixed;
    const suite = makeMochaSuite(baseDir, { name: 'Mixed Status', testPath });
    const result = await suite.run();
    assert(result.isOk);
    const oks = result.val.filter(info => info.status === 'passed');
    expect(oks.length).is.above(0);
    const fails = result.val.filter(info => info.status === 'failed');
    expect(fails.length).is.above(0);
    const skips = result.val.filter(info =>
      info.status === 'failed' && /skip/i.test(info.output));
    expect(skips.length).is.above(0);
  });

});


const TEST_PATHS = {
  ok: 'dist/mocha-tests/ok-tests.js',
  fail: 'dist/mocha-tests/fail-tests.js',
  mixed: 'dist/mocha-tests/mixed-tests.js',
}

function getBaseDir() {
  const url = new URL(import.meta.url);
  const thisDir = Path.dirname(url.pathname);
  return Path.normalize(Path.join(thisDir, '..', '..'));
}

