import makeTest from '../lib/path-test.js';

import { assert, expect } from 'chai';

//use assert(result.isOk === true) and assert(result.isOk === false)
//to ensure that typescript narrows result correctly


describe('path tests', () => {

  it('must succeed for forbidden non-existent file', async () => {
    const test = makeTest('xxx', { name: 'no file', isForbidden: true });
    const result = await test.run({});
    assert(result.isOk);
    expect(result.val.status).to.equal('passed');
  });

  it('must fail for required non-existent file', async () => {
    const test = makeTest('xxx', { name: 'no file', isForbidden: false });
    const result = await test.run({});
    assert(result.isOk);
    expect(result.val.status).to.equal('failed');
  });

  it('must succeed for required existing file', async () => {
    const test = makeTest(thisFilePath(), { name: 'required file', });
    const result = await test.run({});
    assert(result.isOk);
    expect(result.val.status).to.equal('passed');
  });
 
  it('must fail for forbidden existing file', async () => {
    const opts = { name: 'existing file', isForbidden: true };
    const test = makeTest(thisFilePath(), opts); 
    const result = await test.run({});
    assert(result.isOk);
    expect(result.val.status).to.equal('failed');
  });

  it('must succeed with score for required existing file', async () => {
    const score = 20;
    const test =
      makeTest(thisFilePath(), { name: 'required file', max_score: score,  });
    const result = await test.run({});
    assert(result.isOk);  
    expect(result.val.status).to.equal('passed');
    expect(result.val.score).to.equal(score);
  });
 
  it('must fail with score 0 for forbidden existing file', async () => { 
    const score = 20;
    const opts = { name: 'existing file', isForbidden: true, max_score: score };
    const test = makeTest(thisFilePath(), opts); 
    const result = await test.run({});
    assert(result.isOk);
    expect(result.val.status).to.equal('failed');
    expect(result.val.score).to.equal(0);
  });

});

function thisFilePath() {
  const url = new URL(import.meta.url);
  return url.pathname;
}

