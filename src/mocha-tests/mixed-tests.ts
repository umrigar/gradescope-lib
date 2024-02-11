import { assert, expect } from 'chai';

//use assert(result.isOk === true) and assert(result.isOk === false)
//to ensure that typescript narrows result correctly


describe('mixed tests', () => {

  it('must succeed for number equality', async () => {
    const val = 1 + 1;
    expect(val).to.equal(2);
  });

  it('must succeed for number inequality', () => {
    const val = 1 + 1;
    expect(val).not.to.equal(22);
  });

  it('must fail for number equality', async () => {
    const val = 1 + 1;
    expect(val).to.equal(22);
  });

  it.skip('must skip for number inequality', () => {
    const val = 1 + 1;
    expect(val).not.to.equal(2);
  });

  
});
