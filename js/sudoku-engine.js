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
}
