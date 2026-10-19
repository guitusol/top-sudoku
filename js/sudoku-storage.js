/**
 * SudokuStorage - Gestión de almacenamiento local (LocalStorage)
 * Permite guardar, buscar, clasificar por nivel y filtrar entre resueltos y no resueltos.
 */

export class SudokuStorage {
  constructor() {
    this.STORAGE_KEY = 'top_sudoku_puzzles_v1';
    this.initDefaultPuzzles();
  }

  /**
   * Carga los sudokus por defecto si es la primera vez que se abre la app
   */
  initDefaultPuzzles() {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      const defaultCollection = [
        {
          id: 'facil_2',
          level: 'facil',
          number: 2,
          name: 'Sudoku Clásico FoxPro #2',
          isSolved: false,
          bestTime: null,
          initialGrid: [
            [1, 0, 0, 6, 0, 3, 9, 0, 2],
            [0, 2, 0, 5, 0, 1, 0, 7, 3],
            [0, 0, 0, 0, 9, 0, 5, 0, 0],
            [2, 0, 0, 0, 0, 0, 4, 0, 5],
            [0, 1, 0, 7, 0, 4, 0, 8, 0],
            [9, 0, 6, 0, 0, 0, 0, 0, 7],
            [0, 0, 2, 0, 7, 0, 0, 0, 0],
            [4, 6, 0, 9, 0, 5, 0, 2, 0],
            [7, 0, 5, 1, 0, 8, 0, 0, 4]
          ],
          createdAt: '2026-10-17'
        },
        {
          id: 'facil_1',
          level: 'facil',
          number: 1,
          name: 'Introducción básica #1',
          isSolved: false,
          bestTime: null,
          initialGrid: [
            [0, 0, 0, 2, 6, 0, 7, 0, 1],
            [6, 8, 0, 0, 7, 0, 0, 9, 0],
            [1, 9, 0, 0, 0, 4, 5, 0, 0],
            [8, 2, 0, 1, 0, 0, 0, 4, 0],
            [0, 0, 4, 6, 0, 2, 9, 0, 0],
            [0, 5, 0, 0, 0, 3, 0, 2, 8],
            [0, 0, 9, 3, 0, 0, 0, 7, 4],
            [0, 4, 0, 0, 5, 0, 0, 3, 6],
            [7, 0, 3, 0, 1, 8, 0, 0, 0]
          ],
          createdAt: '2026-10-17'
        },
        {
          id: 'medio_1',
          level: 'medio',
          number: 1,
          name: 'Nivel Medio Desafío #1',
          isSolved: false,
          bestTime: null,
          initialGrid: [
            [0, 2, 0, 6, 0, 8, 0, 0, 0],
            [5, 8, 0, 0, 0, 9, 7, 0, 0],
            [0, 0, 0, 0, 4, 0, 0, 0, 0],
            [3, 7, 0, 0, 0, 0, 5, 0, 0],
            [6, 0, 0, 0, 0, 0, 0, 0, 4],
            [0, 0, 8, 0, 0, 0, 0, 1, 3],
            [0, 0, 0, 0, 2, 0, 0, 0, 0],
            [0, 0, 9, 8, 0, 0, 0, 3, 6],
            [0, 0, 0, 3, 0, 6, 0, 9, 0]
          ],
          createdAt: '2026-10-17'
        },
        {
          id: 'dificil_1',
          level: 'dificil',
          number: 1,
          name: 'Deducción Profunda #1',
          isSolved: false,
          bestTime: null,
          initialGrid: [
            [0, 0, 0, 6, 0, 0, 4, 0, 0],
            [7, 0, 0, 0, 0, 3, 6, 0, 0],
            [0, 0, 0, 0, 9, 1, 0, 8, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 5, 0, 1, 8, 0, 0, 0, 3],
            [0, 0, 0, 3, 0, 6, 0, 4, 5],
            [0, 4, 0, 2, 0, 0, 0, 6, 0],
            [9, 0, 3, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 0, 0, 0, 1, 0, 0]
          ],
          createdAt: '2026-10-17'
        },
        {
          id: 'endemoniado_1',
          level: 'endemoniado',
          number: 1,
          name: 'Endemoniado Maestro #1',
          isSolved: false,
          bestTime: null,
          initialGrid: [
            [8, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 3, 6, 0, 0, 0, 0, 0],
            [0, 7, 0, 0, 9, 0, 2, 0, 0],
            [0, 5, 0, 0, 0, 7, 0, 0, 0],
            [0, 0, 0, 0, 4, 5, 7, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 3, 0],
            [0, 0, 1, 0, 0, 0, 0, 6, 8],
            [0, 0, 8, 5, 0, 0, 0, 1, 0],
            [0, 9, 0, 0, 0, 0, 4, 0, 0]
          ],
          createdAt: '2026-10-17'
        }
      ];
      this.saveAll(defaultCollection);
    }
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al leer sudokus de LocalStorage', e);
      return [];
    }
  }

  saveAll(puzzles) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(puzzles));
  }

  /**
   * Guarda un nuevo sudoku o actualiza uno existente
   */
  savePuzzle(level, number, grid, name = '') {
    const puzzles = this.getAll();
    const id = `${level}_${number}`;
    const existingIndex = puzzles.findIndex(p => p.id === id);

    const puzzleData = {
      id,
      level,
      number: parseInt(number, 10),
      name: name || `Sudoku ${level.toUpperCase()} #${number}`,
      isSolved: false,
      bestTime: null,
      initialGrid: grid,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (existingIndex >= 0) {
      puzzles[existingIndex] = { ...puzzles[existingIndex], ...puzzleData };
    } else {
      puzzles.push(puzzleData);
    }

    this.saveAll(puzzles);
    return puzzleData;
  }

  /**
   * Busca sudokus filtrando por nivel y opcionalmente por resueltos/no resueltos
   */
  filterPuzzles(level = 'todos', status = 'todos') {
    const puzzles = this.getAll();
    return puzzles.filter(p => {
      const matchLevel = (level === 'todos' || p.level === level);
      let matchStatus = true;
      if (status === 'resueltos') matchStatus = p.isSolved === true;
      if (status === 'no_resueltos') matchStatus = p.isSolved !== true;
      return matchLevel && matchStatus;
    });
  }

  /**
   * Marca un sudoku como resuelto y actualiza su mejor tiempo
   */
  markAsSolved(id, timeInSeconds) {
    const puzzles = this.getAll();
    const puzzle = puzzles.find(p => p.id === id);
    if (puzzle) {
      puzzle.isSolved = true;
      if (!puzzle.bestTime || timeInSeconds < puzzle.bestTime) {
        puzzle.bestTime = timeInSeconds;
      }
      this.saveAll(puzzles);
    }
  }

  getNextNumberForLevel(level) {
    const puzzles = this.getAll().filter(p => p.level === level);
    if (puzzles.length === 0) return 1;
    const maxNum = Math.max(...puzzles.map(p => p.number || 0));
    return maxNum + 1;
  }
}
