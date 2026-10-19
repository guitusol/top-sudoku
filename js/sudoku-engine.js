/**
 * RandomPRNG - Generador Pseudo-Aleatorio Lehmer (Park-Miller) con semilla determinista
 */
export class RandomPRNG {
  constructor(seed = Date.now()) {
    if (typeof seed === 'string' && /^\d+$/.test(seed.trim())) {
      seed = parseInt(seed.trim(), 10);
    }
    this.seed = typeof seed === 'number' ? Math.floor(seed) : this._hashString(String(seed));
    this.seed = this.seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  _hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) || 12345;
  }

  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

/**
 * SudokuEngine - Motor lógico matemático para Sudoku
 * Diseñado para cálculo de candidatos (posibles), validación en tiempo real y resolución.
 */

export class SudokuEngine {
  constructor() {
    this.SIZE = 9;
    this.BOX_SIZE = 3;
  }

  /**
   * Crea un tablero vacío de 9x9 relleno de ceros
   */
  createEmptyGrid() {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  /**
   * Clona una matriz 9x9
   */
  cloneGrid(grid) {
    return grid.map(row => [...row]);
  }

  /**
   * Comprueba si colocar 'num' en (row, col) es válido según las reglas actuales del tablero
   */
  isValidMove(grid, row, col, num) {
    if (num < 1 || num > 9) return false;

    // Verificar fila (excluyendo la casilla actual)
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === num) return false;
    }

    // Verificar columna (excluyendo la casilla actual)
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === num) return false;
    }

    // Verificar caja 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c] === num) return false;
      }
    }

    return true;
  }

  /**
   * Calcula los números posibles (candidatos) para una casilla vacía específica (row, col)
   * Devuelve un array con los números [1..9] que no colisionan con fila, columna ni caja.
   */
  getCandidatesForCell(grid, row, col) {
    if (grid[row][col] !== 0) {
      return []; // Ya tiene número
    }

    const used = new Set();

    // Números usados en la misma fila
    for (let c = 0; c < 9; c++) {
      if (grid[row][c] !== 0) used.add(grid[row][c]);
    }

    // Números usados en la misma columna
    for (let r = 0; r < 9; r++) {
      if (grid[r][col] !== 0) used.add(grid[r][col]);
    }

    // Números usados en la caja 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (grid[r][c] !== 0) used.add(grid[r][c]);
      }
    }

    const candidates = [];
    for (let n = 1; n <= 9; n++) {
      if (!used.has(n)) {
        candidates.push(n);
      }
    }
    return candidates;
  }

  /**
   * Calcula la matriz completa de posibilidades (9x9).
   * Para casillas llenas devuelve su número.
   * Para casillas vacías devuelve el array de candidatos posibles.
   */
  getAllPossibilities(grid) {
    const possibilities = Array.from({ length: 9 }, () => Array(9).fill(null));

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== 0) {
          possibilities[r][c] = { isFilled: true, value: grid[r][c] };
        } else {
          const candidates = this.getCandidatesForCell(grid, r, c);
          possibilities[r][c] = { isFilled: false, candidates };
        }
      }
    }

    return possibilities;
  }

  /**
   * Resuelve el Sudoku mediante Backtracking optimizado con heurística MRV (Minimum Remaining Values).
   * Devuelve { solved: true, solution: grid } o { solved: false, solution: null }
   */
  solve(grid) {
    const board = this.cloneGrid(grid);

    const backtrack = () => {
      // Buscar la casilla vacía con MENOR número de candidatos (heurística MRV)
      let minCandidates = 10;
      let targetRow = -1;
      let targetCol = -1;
      let bestCandidates = null;

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === 0) {
            const candidates = this.getCandidatesForCell(board, r, c);
            if (candidates.length === 0) {
              return false; // Casilla vacía sin opciones válidas -> callejón sin salida
            }
            if (candidates.length < minCandidates) {
              minCandidates = candidates.length;
              targetRow = r;
              targetCol = c;
              bestCandidates = candidates;
              if (minCandidates === 1) break; // Inmejorable
            }
          }
        }
        if (minCandidates === 1) break;
      }

      // Si no quedan casillas vacías, ¡Sudoku completado!
      if (targetRow === -1) {
        return true;
      }

      // Probar cada candidato
      for (const num of bestCandidates) {
        board[targetRow][targetCol] = num;
        if (backtrack()) {
          return true;
        }
        board[targetRow][targetCol] = 0; // Deshacer
      }

      return false;
    };

    const isSolved = backtrack();
    return {
      solved: isSolved,
      solution: isSolved ? board : null
    };
  }

  /**
   * Comprueba si el tablero actual está completamente lleno y es 100% correcto
   */
  isCompleted(grid) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = grid[r][c];
        if (val === 0 || !this.isValidMove(grid, r, c, val)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Encuentra casillas con candidato único ("Naked Single") para el modo tutor
   */
  findNakedSingles(grid) {
    const singles = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          const candidates = this.getCandidatesForCell(grid, r, c);
          if (candidates.length === 1) {
            singles.push({ row: r, col: c, value: candidates[0] });
          }
        }
      }
    }
    return singles;
  }

  static DIFICULTADES = {
    FACIL: { id: 'facil', name: 'Fácil', minClues: 38 },
    MEDIO: { id: 'medio', name: 'Medio', minClues: 32 },
    DIFICIL: { id: 'dificil', name: 'Difícil', minClues: 26 },
    ENDEMONIADO: { id: 'endemoniado', name: 'Endemoniado', minClues: 22 }
  };

  /**
   * Cuenta cuántas soluciones posibles tiene un tablero (hasta un límite para optimizar).
   * Si devuelve 1, la solución es única e indiscutible.
   */
  countSolutions(board, limit = 2) {
    let count = 0;
    const b = this.cloneGrid(board);

    const solveInternal = () => {
      let emptyRow = -1;
      let emptyCol = -1;
      let minCandidates = 10;

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (b[r][c] === 0) {
            const candidates = this.getCandidatesForCell(b, r, c);
            if (candidates.length === 0) return;
            if (candidates.length < minCandidates) {
              minCandidates = candidates.length;
              emptyRow = r;
              emptyCol = c;
              if (minCandidates === 1) break;
            }
          }
        }
        if (minCandidates === 1) break;
      }

      if (emptyRow === -1) {
        count++;
        return;
      }

      const cands = this.getCandidatesForCell(b, emptyRow, emptyCol);
      for (const n of cands) {
        b[emptyRow][emptyCol] = n;
        solveInternal();
        b[emptyRow][emptyCol] = 0;
        if (count >= limit) return;
      }
    };

    solveInternal();
    return count;
  }

  /**
   * Genera un tablero 9x9 completo y válido de forma pseudo-aleatoria según el PRNG.
   */
  generateFullBoard(prng = new RandomPRNG()) {
    const b = this.createEmptyGrid();

    const fillCell = (r, c) => {
      if (r === 9) return true;
      const nextR = c === 8 ? r + 1 : r;
      const nextC = c === 8 ? 0 : c + 1;

      const nums = prng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (const num of nums) {
        if (this.isValidMove(b, r, c, num)) {
          b[r][c] = num;
          if (fillCell(nextR, nextC)) return true;
          b[r][c] = 0;
        }
      }
      return false;
    };

    fillCell(0, 0);
    return b;
  }

  /**
   * Genera un Sudoku jugable y reproducible a partir de una dificultad y una semilla dada.
   * Garantiza que la solución sea 100% única.
   */
  generateGame(targetDifficulty = 'medio', seed = Math.floor(10000 + Math.random() * 90000)) {
    const prng = new RandomPRNG(seed);
    const fullBoard = this.generateFullBoard(prng);
    const puzzle = this.cloneGrid(fullBoard);

    const diffKey = String(targetDifficulty).toUpperCase();
    const config = SudokuEngine.DIFICULTADES[diffKey] || SudokuEngine.DIFICULTADES.MEDIO;
    const targetClues = config.minClues;

    const positions = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        positions.push([r, c]);
      }
    }
    const shuffledPositions = prng.shuffle(positions);

    let cluesRemaining = 81;
    for (const [r, c] of shuffledPositions) {
      if (cluesRemaining <= targetClues) break;
      const backup = puzzle[r][c];
      puzzle[r][c] = 0;

      // Asegurar solución única
      if (this.countSolutions(puzzle, 2) === 1) {
        cluesRemaining--;
      } else {
        puzzle[r][c] = backup;
      }
    }

    return {
      seed,
      difficulty: targetDifficulty.toLowerCase(),
      board: puzzle,
      solution: fullBoard,
      initialClues: cluesRemaining
    };
  }
}
