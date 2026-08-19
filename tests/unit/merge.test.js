const { compactLine, mergeLineLeft } = require('../../www/js/core/merge');

describe('merge', () => {
  test('compactLine remove zeros do meio mantendo a ordem', () => {
    expect(compactLine([0, 2, 0, 4])).toEqual([2, 4, 0, 0]);
    expect(compactLine([2, 0, 0, 4])).toEqual([2, 4, 0, 0]);
  });

  test('mergeLineLeft funde par de blocos iguais adjacentes', () => {
    const { line, gained, moved } = mergeLineLeft([2, 2, 0, 0]);
    expect(line).toEqual([4, 0, 0, 0]);
    expect(gained).toBe(4);
    expect(moved).toBe(true);
  });

  test('mergeLineLeft não funde o mesmo bloco duas vezes na mesma jogada', () => {
    const { line, gained } = mergeLineLeft([2, 2, 2, 2]);
    expect(line).toEqual([4, 4, 0, 0]);
    expect(gained).toBe(8);
  });

  test('mergeLineLeft não funde valores diferentes', () => {
    const { line, moved } = mergeLineLeft([2, 4, 0, 0]);
    expect(line).toEqual([2, 4, 0, 0]);
    expect(moved).toBe(false);
  });

  test('mergeLineLeft marca moved=false quando nada muda', () => {
    const { moved } = mergeLineLeft([2, 0, 0, 0]);
    expect(moved).toBe(false);
  });

  test('mergeLineLeft marca moved=true quando só desliza sem merge', () => {
    const { line, moved, gained } = mergeLineLeft([0, 0, 2, 0]);
    expect(line).toEqual([2, 0, 0, 0]);
    expect(moved).toBe(true);
    expect(gained).toBe(0);
  });
});
