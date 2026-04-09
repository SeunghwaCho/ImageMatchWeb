import { Block } from '../game/Block';

describe('Block', () => {
  test('default constructor creates empty block', () => {
    const b = new Block();
    expect(b.type).toBe(0);
    expect(b.x).toBe(0);
    expect(b.y).toBe(0);
    expect(b.far).toBe(0);
  });

  test('copy constructor copies all fields', () => {
    const original = new Block();
    original.set(5, 3, 7, 2);
    const copy = new Block(original);
    expect(copy.type).toBe(5);
    expect(copy.x).toBe(3);
    expect(copy.y).toBe(7);
    expect(copy.far).toBe(2);
  });

  test('position constructor sets x and y', () => {
    const b = new Block(4, 6);
    expect(b.x).toBe(4);
    expect(b.y).toBe(6);
    expect(b.type).toBe(0);
  });

  test('set updates all fields', () => {
    const b = new Block();
    b.set(10, 2, 3, 5);
    expect(b.type).toBe(10);
    expect(b.x).toBe(2);
    expect(b.y).toBe(3);
    expect(b.far).toBe(5);
  });

  test('set without far defaults far to 0', () => {
    const b = new Block();
    b.set(10, 2, 3);
    expect(b.far).toBe(0);
  });

  test('clone creates independent copy', () => {
    const b = new Block();
    b.set(7, 1, 2, 3);
    const c = b.clone();
    c.type = 99;
    expect(b.type).toBe(7);
    expect(c.type).toBe(99);
  });

  test('clone preserves all fields', () => {
    const b = new Block();
    b.set(7, 1, 2, 3);
    const c = b.clone();
    expect(c.type).toBe(7);
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.far).toBe(3);
  });
});
