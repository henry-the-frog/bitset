import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BitSet } from '../src/index.js';

describe('Basic ops', () => {
  it('should set and test', () => {
    const bs = new BitSet(64);
    bs.set(5).set(10).set(63);
    assert.equal(bs.test(5), true);
    assert.equal(bs.test(10), true);
    assert.equal(bs.test(63), true);
    assert.equal(bs.test(0), false);
  });
  it('should clear', () => {
    const bs = new BitSet();
    bs.set(5);
    bs.clear(5);
    assert.equal(bs.test(5), false);
  });
  it('should toggle', () => {
    const bs = new BitSet();
    bs.toggle(3);
    assert.equal(bs.test(3), true);
    bs.toggle(3);
    assert.equal(bs.test(3), false);
  });
  it('should auto-grow', () => {
    const bs = new BitSet(8);
    bs.set(100);
    assert.equal(bs.test(100), true);
  });
});

describe('Bitwise ops', () => {
  it('should AND', () => {
    const a = BitSet.from([1, 2, 3]);
    const b = BitSet.from([2, 3, 4]);
    assert.deepEqual(a.and(b).toArray(), [2, 3]);
  });
  it('should OR', () => {
    const a = BitSet.from([1, 2]);
    const b = BitSet.from([3, 4]);
    assert.deepEqual(a.or(b).toArray(), [1, 2, 3, 4]);
  });
  it('should XOR', () => {
    const a = BitSet.from([1, 2, 3]);
    const b = BitSet.from([2, 3, 4]);
    assert.deepEqual(a.xor(b).toArray(), [1, 4]);
  });
});

describe('count', () => {
  it('should count set bits', () => {
    assert.equal(BitSet.from([1, 5, 10, 20, 31]).count(), 5);
  });
  it('should count zero for empty', () => {
    assert.equal(new BitSet().count(), 0);
  });
});

describe('isEmpty', () => {
  it('should detect empty', () => assert.equal(new BitSet().isEmpty(), true));
  it('should detect non-empty', () => { const bs = new BitSet(); bs.set(1); assert.equal(bs.isEmpty(), false); });
});

describe('iterate', () => {
  it('should toArray', () => assert.deepEqual(BitSet.from([5, 1, 10]).toArray(), [1, 5, 10]));
  it('should iterate', () => assert.deepEqual([...BitSet.from([3, 7])], [3, 7]));
});

describe('equals', () => {
  it('should compare equal', () => assert.equal(BitSet.from([1, 2]).equals(BitSet.from([1, 2])), true));
  it('should compare different', () => assert.equal(BitSet.from([1]).equals(BitSet.from([2])), false));
});

describe('clone', () => {
  it('should clone', () => {
    const a = BitSet.from([1, 2, 3]);
    const b = a.clone();
    b.clear(2);
    assert.equal(a.test(2), true);
    assert.equal(b.test(2), false);
  });
});
