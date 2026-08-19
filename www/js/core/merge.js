/**
 * Lógica de fusão (merge) de uma linha do tabuleiro 2048.
 * Trabalha sempre no sentido "para a esquerda"; moves.js se encarrega de
 * rotacionar/espelhar o tabuleiro para reaproveitar essa mesma função
 * nas 4 direções.
 */

/**
 * Compacta uma linha para a esquerda, removendo zeros do meio,
 * sem realizar merges. Ex: [0,2,0,4] -> [2,4,0,0]
 * @param {number[]} line
 * @returns {number[]}
 */
function compactLine(line) {
  const values = line.filter((value) => value !== 0);
  while (values.length < line.length) {
    values.push(0);
  }
  return values;
}

/**
 * Aplica merge (fusão) para a esquerda em uma única linha, seguindo a
 * regra clássica do 2048: cada bloco só pode se fundir uma vez por jogada,
 * e blocos iguais adjacentes viram um bloco com o dobro do valor.
 * @param {number[]} line - linha já compactada ou não (será compactada internamente).
 * @returns {{line: number[], gained: number, moved: boolean, mergedValues: number[]}}
 *   line: nova linha após merge e compactação final.
 *   gained: pontuação obtida com os merges desta linha.
 *   moved: true se a linha resultante é diferente da linha original.
 *   mergedValues: valores resultantes de cada merge ocorrido nesta linha
 *     (usado pelo gatekeeper para detectar blocos gatilho — 16/64/256/1024).
 */
function mergeLineLeft(line) {
  const original = line.slice();
  const compacted = compactLine(line);
  const result = [];
  const mergedValues = [];
  let gained = 0;

  for (let i = 0; i < compacted.length; i++) {
    const current = compacted[i];
    const next = compacted[i + 1];

    if (current !== 0 && current === next) {
      const mergedValue = current * 2;
      result.push(mergedValue);
      mergedValues.push(mergedValue);
      gained += mergedValue;
      i++; // pula o próximo, já que foi consumido no merge
    } else {
      result.push(current);
    }
  }

  while (result.length < line.length) {
    result.push(0);
  }

  const moved = !original.every((value, index) => value === result[index]);

  return { line: result, gained, moved, mergedValues };
}

module.exports = {
  compactLine,
  mergeLineLeft
};
