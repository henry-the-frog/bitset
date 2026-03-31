// bitset.js — Compact bit set using Uint32Array

export class BitSet {
  constructor(size = 32) {
    this._words = new Uint32Array(Math.ceil(size / 32));
    this._size = size;
  }

  set(bit) { this._grow(bit); this._words[bit >> 5] |= 1 << (bit & 31); return this; }
  clear(bit) { if (bit >> 5 < this._words.length) this._words[bit >> 5] &= ~(1 << (bit & 31)); return this; }
  test(bit) { return bit >> 5 < this._words.length ? !!(this._words[bit >> 5] & (1 << (bit & 31))) : false; }
  toggle(bit) { this._grow(bit); this._words[bit >> 5] ^= 1 << (bit & 31); return this; }

  and(other) { const r = new BitSet(Math.max(this._size, other._size)); const len = Math.min(this._words.length, other._words.length); for (let i = 0; i < len; i++) r._words[i] = this._words[i] & other._words[i]; return r; }
  or(other) { const r = new BitSet(Math.max(this._size, other._size)); for (let i = 0; i < this._words.length; i++) r._words[i] = this._words[i]; for (let i = 0; i < other._words.length; i++) r._words[i] |= other._words[i]; return r; }
  xor(other) { const r = new BitSet(Math.max(this._size, other._size)); for (let i = 0; i < Math.max(this._words.length, other._words.length); i++) r._words[i] = (this._words[i] || 0) ^ (other._words[i] || 0); return r; }
  not() { const r = new BitSet(this._size); for (let i = 0; i < this._words.length; i++) r._words[i] = ~this._words[i]; return r; }

  count() {
    let c = 0;
    for (let i = 0; i < this._words.length; i++) {
      let w = this._words[i];
      w = w - ((w >> 1) & 0x55555555);
      w = (w & 0x33333333) + ((w >> 2) & 0x33333333);
      c += (((w + (w >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24;
    }
    return c;
  }

  isEmpty() { for (let i = 0; i < this._words.length; i++) if (this._words[i]) return false; return true; }

  toArray() {
    const result = [];
    for (let i = 0; i < this._words.length * 32; i++) if (this.test(i)) result.push(i);
    return result;
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this._words.length * 32; i++) if (this.test(i)) yield i;
  }

  toString() { return this.toArray().join(', '); }

  equals(other) {
    const len = Math.max(this._words.length, other._words.length);
    for (let i = 0; i < len; i++) if ((this._words[i] || 0) !== (other._words[i] || 0)) return false;
    return true;
  }

  clone() {
    const r = new BitSet(this._size);
    r._words.set(this._words);
    return r;
  }

  _grow(bit) {
    const needed = (bit >> 5) + 1;
    if (needed > this._words.length) {
      const newWords = new Uint32Array(needed);
      newWords.set(this._words);
      this._words = newWords;
      this._size = needed * 32;
    }
  }

  static from(bits) {
    const bs = new BitSet(Math.max(...bits, 0) + 1);
    for (const b of bits) bs.set(b);
    return bs;
  }
}
