import { assert, expect } from 'chai';

//use assert(result.isOk === true) and assert(result.isOk === false)
//to ensure that typescript narrows result correctly


describe('fail tests', () => {

  it('must fail for number equality', async () => {
    const val = 1 + 1;
    expect(val).to.equal(22);
  });

  it('must fail for number inequality', () => {
    const val = 1 + 1;
    expect(val).to.not.equal(2);
  });

});
