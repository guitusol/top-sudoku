import { SudokuEngine } from './sudoku-engine.js';
import { SudokuStorage } from './sudoku-storage.js';

class SudokuApp {
  constructor() {
    this.engine = new SudokuEngine();
    this.storage = new SudokuStorage();

    // Estado del juego
    this.mode = 'idle'; // 'idle', 'plantear', 'jugando', 'resuelto'
    this.currentLevel = 'facil';
    this.currentNumber = 2;
    this.currentPuzzleId = 'facil_2';

    // Tableros
    this.initialGrid = this.engine.createEmptyGrid();
    this.playGrid = this.engine.createEmptyGrid();
    this.solutionGrid = null;

    // Selección de casilla activa
    this.selectedRow = 0;
    this.selectedCol = 0;

    // Posibilidades activas
    this.showPossibilities = false;

    // Cronómetro
    this.timerInterval = null;
    this.clockInterval = null;
    this.startTime = null;
    this.elapsedSeconds = 0;

    this.initDOM();
    this.bindEvents();
    this.currentSeed = null;
    this.startAnalogClock();

    // Comprobar si la URL trae semilla o nivel especificado (?semilla=... o ?seed=...)
    const urlParams = new URLSearchParams(window.location.search);
    const urlSeed = urlParams.get('semilla') || urlParams.get('seed');
    const urlNivel = urlParams.get('nivel') || urlParams.get('level');
    if (urlNivel && ['facil', 'medio', 'dificil', 'endemoniado'].includes(urlNivel.toLowerCase())) {
      this.currentLevel = urlNivel.toLowerCase();
      const radio = document.querySelector(`input[name="nivel"][value="${this.currentLevel}"]`);
      if (radio) radio.checked = true;
    }

    if (urlSeed) {
      this.loadPuzzleBySeed(urlSeed, this.currentLevel);
    } else {
      // Cargar Sudoku inicial por defecto (el clásico FoxPro #2)
      this.loadPuzzle('facil_2');
    }
  }

  initDOM() {
    this.dom = {
      // Cabecera / Reloj
      startDateInput: document.getElementById('start-date-input'),
      elapsedTimeInput: document.getElementById('elapsed-time-input'),
      digitalClock: document.getElementById('digital-clock'),
      analogHour: document.getElementById('analog-hour'),
      analogMinute: document.getElementById('analog-minute'),
      analogSecond: document.getElementById('analog-second'),

      // Tableros
      leftBoard: document.getElementById('left-board'),
      rightBoard: document.getElementById('right-board'),
      mobileTabs: document.getElementById('mobile-tabs'),
      tabGame: document.getElementById('tab-game'),
      tabPossibilities: document.getElementById('tab-possibilities'),
      leftPanel: document.getElementById('left-panel'),
      rightPanel: document.getElementById('right-panel'),

      // Botones de control
      btnPlantear: document.getElementById('btn-plantear'),
      btnCerrar: document.getElementById('btn-cerrar'),
      btnGrabar: document.getElementById('btn-grabar'),
      btnBuscar: document.getElementById('btn-buscar'),
      btnIniciar: document.getElementById('btn-iniciar'),
      btnResolver: document.getElementById('btn-resolver'),
      btnCancelar: document.getElementById('btn-cancelar'),
      btnPosibles: document.getElementById('btn-posibles'),
      btnReiniciar: document.getElementById('btn-reiniciar'),
      btnVerSolucion: document.getElementById('btn-ver-solucion'),

      // Semilla propuesta
      seedInput: document.getElementById('seed-input'),
      btnLoadSeed: document.getElementById('btn-load-seed'),
      btnRandomSeed: document.getElementById('btn-random-seed'),
      modalSeedInput: document.getElementById('modal-seed-input'),
      btnModalLoadSeed: document.getElementById('btn-modal-load-seed'),

      // Niveles y número
      levelRadios: document.querySelectorAll('input[name="nivel"]'),
      puzzleNumberInput: document.getElementById('puzzle-number-input'),
      statusBadge: document.getElementById('status-badge'),

      // Modales
      searchModal: document.getElementById('search-modal'),
      searchLevelFilter: document.getElementById('search-level-filter'),
      searchStatusFilter: document.getElementById('search-status-filter'),
      searchResultsList: document.getElementById('search-results-list'),
      btnCloseSearch: document.getElementById('btn-close-search'),

      confirmModal: document.getElementById('confirm-modal'),
      confirmMessage: document.getElementById('confirm-message'),
      btnConfirmYes: document.getElementById('btn-confirm-yes'),
      btnConfirmNo: document.getElementById('btn-confirm-no'),

      // Teclado numérico táctil móvil
      keypad: document.getElementById('touch-keypad')
    };

    this.renderLeftBoard();
    this.renderRightBoard();
  }

  bindEvents() {
    // Teclado físico
    window.addEventListener('keydown', (e) => this.handlePhysicalKeyboard(e));

    // Botones de acción
    this.dom.btnPlantear.addEventListener('click', () => this.handlePlantear());
    this.dom.btnGrabar.addEventListener('click', () => this.handleGrabar());
    this.dom.btnBuscar.addEventListener('click', () => this.openSearchModal());
    this.dom.btnIniciar.addEventListener('click', () => this.handleIniciar());
    this.dom.btnResolver.addEventListener('click', () => this.handleResolver());
    this.dom.btnVerSolucion.addEventListener('click', () => this.handleResolver());
    this.dom.btnCancelar.addEventListener('click', () => this.handleCancelar());
    this.dom.btnPosibles.addEventListener('click', () => this.togglePosibles());
    this.dom.btnReiniciar.addEventListener('click', () => this.handleReiniciar());
    this.dom.btnCerrar.addEventListener('click', () => this.handleCerrar());

    // Semilla propuesta
    this.dom.btnLoadSeed?.addEventListener('click', () => this.handleProposeSeed());
    this.dom.seedInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleProposeSeed();
    });
    this.dom.btnRandomSeed?.addEventListener('click', () => this.handleRandomSeed());
    this.dom.btnModalLoadSeed?.addEventListener('click', () => this.handleModalProposeSeed());
    this.dom.modalSeedInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleModalProposeSeed();
    });

    // Niveles radio buttons y número
    this.dom.levelRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.currentLevel = e.target.value;
        if (this.mode === 'plantear') {
          this.dom.puzzleNumberInput.value = this.storage.getNextNumberForLevel(this.currentLevel);
        } else if (this.currentSeed) {
          this.loadPuzzleBySeed(this.currentSeed, this.currentLevel);
        } else {
          this.loadPuzzleByLevelAndNumber(this.currentLevel, parseInt(this.dom.puzzleNumberInput.value, 10) || 1);
        }
      });
    });

    this.dom.puzzleNumberInput.addEventListener('change', () => {
      if (this.mode !== 'plantear') {
        const num = parseInt(this.dom.puzzleNumberInput.value, 10) || 1;
        this.loadPuzzleByLevelAndNumber(this.currentLevel, num);
      }
    });

    // Filtros de búsqueda
    this.dom.searchLevelFilter.addEventListener('change', () => this.updateSearchResults());
    this.dom.searchStatusFilter.addEventListener('change', () => this.updateSearchResults());
    this.dom.btnCloseSearch.addEventListener('click', () => this.closeSearchModal());

    // Pestañas móviles (Juego vs Posibilidades)
    if (this.dom.tabGame && this.dom.tabPossibilities) {
      this.dom.tabGame.addEventListener('click', () => this.switchMobileTab('game'));
      this.dom.tabPossibilities.addEventListener('click', () => this.switchMobileTab('possibilities'));
    }

    // Teclado táctil
    if (this.dom.keypad) {
      this.dom.keypad.addEventListener('click', (e) => {
        const btn = e.target.closest('.keypad-btn');
        if (!btn) return;
        const val = btn.dataset.val;
        if (val === 'clear') {
          this.setCellValue(this.selectedRow, this.selectedCol, 0);
        } else if (val === 'posibles') {
          this.togglePosibles();
        } else if (val === 'up') {
          this.selectCell(Math.max(0, this.selectedRow - 1), this.selectedCol);
        } else if (val === 'down') {
          this.selectCell(Math.min(8, this.selectedRow + 1), this.selectedCol);
        } else if (val === 'left') {
          this.selectCell(this.selectedRow, Math.max(0, this.selectedCol - 1));
        } else if (val === 'right') {
          this.selectCell(this.selectedRow, Math.min(8, this.selectedCol + 1));
        } else {
          const num = parseInt(val, 10);
          if (num >= 1 && num <= 9) {
            this.setCellValue(this.selectedRow, this.selectedCol, num);
          }
        }
      });
    }
  }

  /**
   * Renderiza las 81 casillas del tablero izquierdo (Juego / Planteamiento)
   */
  renderLeftBoard() {
    this.dom.leftBoard.innerHTML = '';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        cell.addEventListener('click', () => {
          this.selectCell(r, c);
        });

        this.dom.leftBoard.appendChild(cell);
      }
    }
    this.updateBoardDisplay();
  }

  /**
   * Renderiza las 81 casillas del tablero derecho (Posibilidades por cuadro / Espejo)
   */
  renderRightBoard() {
    this.dom.rightBoard.innerHTML = '';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'possibility-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        this.dom.rightBoard.appendChild(cell);
      }
    }
    this.updateRightBoardDisplay();
  }

  selectCell(row, col) {
    this.selectedRow = row;
    this.selectedCol = col;
    this.updateHighlights();
  }

  updateHighlights() {
    const leftCells = this.dom.leftBoard.querySelectorAll('.sudoku-cell');
    const selectedVal = this.playGrid[this.selectedRow][this.selectedCol];

    leftCells.forEach(cell => {
      const r = parseInt(cell.dataset.row, 10);
      const c = parseInt(cell.dataset.col, 10);

      cell.classList.remove('selected', 'highlight-axis', 'same-number');

      if (r === this.selectedRow && c === this.selectedCol) {
        cell.classList.add('selected');
      } else if (r === this.selectedRow || c === this.selectedCol || 
                (Math.floor(r / 3) === Math.floor(this.selectedRow / 3) && Math.floor(c / 3) === Math.floor(this.selectedCol / 3))) {
        cell.classList.add('highlight-axis');
      }

      if (selectedVal !== 0 && this.playGrid[r][c] === selectedVal) {
        cell.classList.add('same-number');
      }
    });
  }

  /**
   * Actualiza el contenido visual del tablero izquierdo
   */
  updateBoardDisplay() {
    const cells = this.dom.leftBoard.querySelectorAll('.sudoku-cell');
    cells.forEach(cell => {
      const r = parseInt(cell.dataset.row, 10);
      const c = parseInt(cell.dataset.col, 10);
      const val = this.playGrid[r][c];
      const isInitial = this.initialGrid[r][c] !== 0;

      cell.textContent = val !== 0 ? val : '';
      cell.classList.remove('initial', 'user-placed');

      if (val !== 0) {
        if (isInitial && this.mode !== 'plantear') {
          cell.classList.add('initial');
        } else {
          cell.classList.add('user-placed');
        }
      }
    });

    this.updateHighlights();
    this.updateRightBoardDisplay();
  }

  /**
   * Actualiza la pantalla de la derecha ("POSIBILIDADES POR CUADRO")
   */
  updateRightBoardDisplay() {
    const cells = this.dom.rightBoard.querySelectorAll('.possibility-cell');
    const possibilities = this.engine.getAllPossibilities(this.playGrid);

    cells.forEach(cell => {
      const r = parseInt(cell.dataset.row, 10);
      const c = parseInt(cell.dataset.col, 10);
      const info = possibilities[r][c];

      cell.innerHTML = '';
      cell.classList.remove('single-candidate');

      if (info.isFilled) {
        // En espejo con el número fijado
        cell.textContent = info.value;
      } else {
        // Si el botón de "Posibles" está activado, pinta los candidatos
        if (this.showPossibilities) {
          const candidates = info.candidates;
          if (candidates.length === 1) {
            // ¡Candidato único! Resaltado pedagógico especial
            cell.classList.add('single-candidate');
            cell.textContent = candidates[0];
          } else if (candidates.length > 0) {
            const box = document.createElement('div');
            box.className = 'candidate-box';
            box.textContent = candidates.join(' ');
            cell.appendChild(box);
          }
        }
      }
    });
  }

  /**
   * Manejo de entrada de números (desde teclado físico o táctil)
   */
  setCellValue(row, col, num) {
    if (this.mode === 'idle') {
      this.setStatus('Pulsa "Iniciar" para jugar o "Plantear" para crear uno nuevo.', 'warn');
      return;
    }

    // Si estamos jugando y es una casilla inicial fijada, no permitir sobreescribir
    if (this.mode === 'jugando' && this.initialGrid[row][col] !== 0) {
      return;
    }

    // Si queremos borrar (num === 0)
    if (num === 0) {
      this.playGrid[row][col] = 0;
      if (this.mode === 'plantear') {
        this.initialGrid[row][col] = 0;
      }
      this.updateBoardDisplay();
      return;
    }

    // Modo Plantear: validamos que no choque con lo ya puesto
    if (this.mode === 'plantear') {
      if (!this.engine.isValidMove(this.playGrid, row, col, num)) {
        this.flashCellError(row, col);
        this.setStatus(`El número ${num} colisiona en fila, columna o caja 3x3.`, 'error');
        return;
      }
      this.playGrid[row][col] = num;
      this.initialGrid[row][col] = num;
      this.updateBoardDisplay();
      this.advanceToNextCell(row, col);
      return;
    }

    // Modo Jugando: REGLA DE ORO DE GUILLERMO -> Si el número no es correcto según la distribución, se rechaza
    if (this.mode === 'jugando') {
      if (!this.engine.isValidMove(this.playGrid, row, col, num)) {
        this.flashCellError(row, col);
        this.setStatus(`¡Rechazado! El número ${num} no es válido en esta posición.`, 'error');
        return;
      }

      this.playGrid[row][col] = num;
      this.updateBoardDisplay();

      // Comprobar si completó el Sudoku
      if (this.engine.isCompleted(this.playGrid)) {
        this.handleGameWon();
      } else {
        this.advanceToNextCell(row, col);
      }
    }
  }

  /**
   * Avance automático inteligente: Salta a la siguiente casilla vacía hacia la derecha
   */
  advanceToNextCell(currentRow, currentCol) {
    // 1. Buscar hacia adelante desde la casilla actual
    for (let r = currentRow; r < 9; r++) {
      const startC = (r === currentRow) ? currentCol + 1 : 0;
      for (let c = startC; c < 9; c++) {
        if (this.playGrid[r][c] === 0) {
          this.selectCell(r, c);
          return;
        }
      }
    }
    // 2. Si llegó al final, buscar desde el principio (casillas que hayan quedado atrás)
    for (let r = 0; r <= currentRow; r++) {
      const endC = (r === currentRow) ? currentCol : 9;
      for (let c = 0; c < endC; c++) {
        if (this.playGrid[r][c] === 0) {
          this.selectCell(r, c);
          return;
        }
      }
    }
  }

  flashCellError(row, col) {
    const cell = this.dom.leftBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
      cell.classList.add('cell-error');
      setTimeout(() => cell.classList.remove('cell-error'), 400);
    }
  }

  handlePhysicalKeyboard(e) {
    // Si hay un modal abierto, no interceptar
    if (!this.dom.searchModal.classList.contains('hidden') || !this.dom.confirmModal.classList.contains('hidden')) {
      return;
    }

    // Movimiento con flechas de dirección
    if (e.key === 'ArrowUp') {
      this.selectCell(Math.max(0, this.selectedRow - 1), this.selectedCol);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      this.selectCell(Math.min(8, this.selectedRow + 1), this.selectedCol);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      this.selectCell(this.selectedRow, Math.max(0, this.selectedCol - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      this.selectCell(this.selectedRow, Math.min(8, this.selectedCol + 1));
      e.preventDefault();
    } else if (e.key >= '1' && e.key <= '9') {
      this.setCellValue(this.selectedRow, this.selectedCol, parseInt(e.key, 10));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      this.setCellValue(this.selectedRow, this.selectedCol, 0);
    }
  }

  // --- BOTONES DE CONTROL SEGÚN LAS REGLAS DE GUILLERMO ---

  /**
   * 2.- Botón Plantear: Limpia y predispone el tablero para meter los números iniciales
   */
  handlePlantear() {
    this.stopTimer();
    this.mode = 'plantear';
    this.initialGrid = this.engine.createEmptyGrid();
    this.playGrid = this.engine.createEmptyGrid();
    this.showPossibilities = false;
    this.currentPuzzleId = null;

    this.dom.startDateInput.value = '';
    this.dom.elapsedTimeInput.value = '00:00';
    this.dom.puzzleNumberInput.value = this.storage.getNextNumberForLevel(this.currentLevel);

    this.setStatus('Modo PLANTEAR activado: Introduce los números iniciales del nuevo Sudoku.', 'info');
    this.updateBoardDisplay();
  }

  /**
   * 3.- Botón Grabar: Guarda el planteamiento inicial en la colección
   */
  handleGrabar() {
    const hasNumbers = this.initialGrid.some(row => row.some(n => n !== 0));
    if (!hasNumbers) {
      alert('El tablero está vacío. Introduce al menos los números iniciales para poder grabarlo.');
      return;
    }

    const num = parseInt(this.dom.puzzleNumberInput.value, 10) || 1;
    const customName = this.currentSeed
      ? `Sudoku Semilla #${this.currentSeed} (${this.currentLevel.toUpperCase()})`
      : '';
    const puzzle = this.storage.savePuzzle(this.currentLevel, num, this.initialGrid, customName);
    this.currentPuzzleId = puzzle.id;
    this.setStatus(`Sudoku grabado con éxito en nivel "${this.currentLevel.toUpperCase()}" con el número ${num}.`, 'success');
  }

  /**
   * 4.- Botón Buscar: Abre el buscador clasificado por dificultad y resuelto/no resuelto
   */
  openSearchModal() {
    this.dom.searchModal.classList.remove('hidden');
    this.updateSearchResults();
  }

  closeSearchModal() {
    this.dom.searchModal.classList.add('hidden');
  }

  updateSearchResults() {
    const level = this.dom.searchLevelFilter.value;
    const status = this.dom.searchStatusFilter.value;
    const puzzles = this.storage.filterPuzzles(level, status);

    this.dom.searchResultsList.innerHTML = '';

    if (puzzles.length === 0) {
      this.dom.searchResultsList.innerHTML = '<div class="text-gray-500 py-4 text-center">No se encontraron sudokus con esos filtros.</div>';
      return;
    }

    puzzles.forEach(p => {
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between p-3 border rounded hover:bg-blue-50 cursor-pointer transition';
      item.innerHTML = `
        <div>
          <span class="font-bold text-blue-900">${p.name}</span>
          <span class="text-xs ml-2 px-2 py-0.5 rounded ${p.level === 'facil' ? 'bg-green-100 text-green-800' : p.level === 'medio' ? 'bg-yellow-100 text-yellow-800' : p.level === 'dificil' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}">${p.level.toUpperCase()}</span>
          <div class="text-xs text-gray-500 mt-0.5">Estado: ${p.isSolved ? '✅ Resuelto' : '⏳ Pendiente'} ${p.bestTime ? `| Mejor tiempo: ${this.formatTime(p.bestTime)}` : ''}</div>
        </div>
        <button class="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700">Cargar</button>
      `;

      item.addEventListener('click', () => {
        this.loadPuzzle(p.id);
        this.closeSearchModal();
      });

      this.dom.searchResultsList.appendChild(item);
    });
  }

  loadPuzzle(puzzleId) {
    const puzzles = this.storage.getAll();
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return;

    this.stopTimer();
    this.mode = 'idle';
    this.currentSeed = null;
    if (this.dom.seedInput) this.dom.seedInput.value = '';
    this.currentPuzzleId = puzzle.id;
    this.currentLevel = puzzle.level;
    this.currentNumber = puzzle.number;

    // Actualizar radios
    const radio = document.querySelector(`input[name="nivel"][value="${puzzle.level}"]`);
    if (radio) radio.checked = true;
    this.dom.puzzleNumberInput.value = puzzle.number;

    this.initialGrid = this.engine.cloneGrid(puzzle.initialGrid);
    this.playGrid = this.engine.cloneGrid(puzzle.initialGrid);
    this.showPossibilities = false;

    this.dom.startDateInput.value = '';
    this.dom.elapsedTimeInput.value = '00:00';

    this.setStatus(`Cargado ${puzzle.name}. Pulsa "Iniciar" para comenzar la partida.`, 'info');
    this.updateBoardDisplay();
  }

  loadPuzzleByLevelAndNumber(level, num) {
    const id = `${level}_${num}`;
    const puzzle = this.storage.getAll().find(p => p.id === id);
    if (puzzle) {
      this.loadPuzzle(id);
    } else {
      const firstInLevel = this.storage.getAll().find(p => p.level === level);
      if (firstInLevel) {
        this.loadPuzzle(firstInLevel.id);
      } else {
        this.setStatus(`No hay sudokus guardados en nivel "${level.toUpperCase()}". Usa "Plantear" para crear uno.`, 'warn');
      }
    }
  }

  /**
   * 5.- Botón Iniciar: Restaura el tablero al planteamiento inicial limpio,
   *     arranca el cronómetro y registra la fecha/hora de inicio.
   */
  handleIniciar() {
    if (this.mode === 'plantear') {
      alert('Estás en modo "Plantear". Pulsa primero "Grabar" para guardar este planteamiento o "Cancelar".');
      return;
    }

    // 1. Restaurar el tablero de juego a las casillas iniciales del planteamiento (limpia soluciones o números puestos)
    this.playGrid = this.engine.cloneGrid(this.initialGrid);
    this.mode = 'jugando';
    this.startTime = new Date();
    this.elapsedSeconds = 0;
    this.dom.elapsedTimeInput.value = '00:00';

    const formattedDate = this.startTime.toLocaleDateString() + ' ' + this.startTime.toLocaleTimeString();
    this.dom.startDateInput.value = formattedDate;

    this.startTimer();
    this.updateBoardDisplay(); // ¡Limpia el tablero y lo deja listo para resolver!
    this.setStatus('Partida en curso. Tablero preparado con los números iniciales. ¡A resolver!', 'success');
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      this.dom.elapsedTimeInput.value = this.formatTime(this.elapsedSeconds);
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * 8.- Botón Posibles: Alterna la visualización de candidatos en la pantalla derecha
   */
  togglePosibles() {
    this.showPossibilities = !this.showPossibilities;
    this.dom.btnPosibles.classList.toggle('bg-amber-100', this.showPossibilities);
    this.dom.btnPosibles.classList.toggle('border-amber-500', this.showPossibilities);
    this.updateRightBoardDisplay();

    if (this.showPossibilities) {
      const singles = this.engine.findNakedSingles(this.playGrid);
      if (singles.length > 0) {
        this.setStatus(`Calculadas posibilidades: ¡Hay ${singles.length} casilla(s) con candidato único (resaltadas en amarillo)!`, 'info');
      } else {
        this.setStatus('Calculadas posibilidades por cuadro en tiempo real.', 'info');
      }
    }
  }

  /**
   * 9.- Botón Resolver / Ver solución: Pide confirmación antes de resolver
   */
  handleResolver() {
    this.openConfirmModal('¿Verdaderamente deseas resolver el Sudoku y ver la solución completa?', () => {
      this.stopTimer();
      this.mode = 'resuelto';

      if (this.solutionGrid) {
        this.playGrid = this.engine.cloneGrid(this.solutionGrid);
        this.updateBoardDisplay();
        this.setStatus('Sudoku resuelto con la solución matemática exacta de la semilla.', 'success');
      } else {
        const result = this.engine.solve(this.initialGrid);
        if (result.solved) {
          this.playGrid = this.engine.cloneGrid(result.solution);
          this.updateBoardDisplay();
          this.setStatus('Sudoku resuelto con el motor matemático MRV.', 'success');
        } else {
          alert('No se ha encontrado una solución matemáticamente válida para esta distribución.');
        }
      }
    });
  }

  /**
   * 10.- Botón Reiniciar: Vuelve al estado inicial del planteamiento
   */
  handleReiniciar() {
    this.openConfirmModal('¿Deseas reiniciar la partida y volver a empezar desde los números iniciales?', () => {
      this.playGrid = this.engine.cloneGrid(this.initialGrid);
      this.elapsedSeconds = 0;
      this.dom.elapsedTimeInput.value = '00:00';
      this.showPossibilities = false;
      this.mode = 'jugando';
      this.startTimer();
      this.updateBoardDisplay();
      this.setStatus('Partida reiniciada.', 'info');
    });
  }

  handleCancelar() {
    this.playGrid = this.engine.cloneGrid(this.initialGrid);
    this.updateBoardDisplay();
    this.setStatus('Cambios cancelados.', 'info');
  }

  handleCerrar() {
    this.stopTimer();
    this.mode = 'idle';
    this.setStatus('Sesión cerrada.', 'info');
  }

  handleGameWon() {
    this.stopTimer();
    this.mode = 'resuelto';
    if (this.currentPuzzleId) {
      this.storage.markAsSolved(this.currentPuzzleId, this.elapsedSeconds);
    }
    this.setStatus(`¡ENHORABUENA! 🎉 Has completado el Sudoku en ${this.formatTime(this.elapsedSeconds)}.`, 'success');
    alert(`¡Felicidades, Guillermo! 🎉\nHas resuelto el Sudoku con éxito en un tiempo de ${this.formatTime(this.elapsedSeconds)}.`);
  }

  // --- MODAL DE CONFIRMACIÓN ---
  openConfirmModal(msg, onConfirm) {
    this.dom.confirmMessage.textContent = msg;
    this.dom.confirmModal.classList.remove('hidden');

    const handleYes = () => {
      this.dom.confirmModal.classList.add('hidden');
      cleanup();
      onConfirm();
    };

    const handleNo = () => {
      this.dom.confirmModal.classList.add('hidden');
      cleanup();
    };

    const cleanup = () => {
      this.dom.btnConfirmYes.removeEventListener('click', handleYes);
      this.dom.btnConfirmNo.removeEventListener('click', handleNo);
    };

    this.dom.btnConfirmYes.addEventListener('click', handleYes);
    this.dom.btnConfirmNo.addEventListener('click', handleNo);
  }

  // --- RELOJ ANALÓGICO / DIGITAL ESTILO FOXPRO ---
  startAnalogClock() {
    const update = () => {
      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours();

      this.dom.digitalClock.textContent = now.toLocaleTimeString();

      const secDeg = (sec / 60) * 360;
      const minDeg = ((min + sec / 60) / 60) * 360;
      const hrDeg = (((hr % 12) + min / 60) / 12) * 360;

      this.dom.analogSecond.style.transform = `rotate(${secDeg}deg)`;
      this.dom.analogMinute.style.transform = `rotate(${minDeg}deg)`;
      this.dom.analogHour.style.transform = `rotate(${hrDeg}deg)`;
    };

    update();
    this.clockInterval = setInterval(update, 1000);
  }

  // --- PESTAÑAS MÓVILES (Juego vs Posibilidades) ---
  switchMobileTab(tab) {
    if (tab === 'game') {
      this.dom.leftPanel.classList.remove('hidden');
      this.dom.rightPanel.classList.add('hidden');
      this.dom.tabGame.classList.add('bg-blue-600', 'text-white');
      this.dom.tabGame.classList.remove('bg-white', 'text-gray-700');
      this.dom.tabPossibilities.classList.remove('bg-blue-600', 'text-white');
      this.dom.tabPossibilities.classList.add('bg-white', 'text-gray-700');
    } else {
      this.dom.leftPanel.classList.add('hidden');
      this.dom.rightPanel.classList.remove('hidden');
      this.dom.tabPossibilities.classList.add('bg-blue-600', 'text-white');
      this.dom.tabPossibilities.classList.remove('bg-white', 'text-gray-700');
      this.dom.tabGame.classList.remove('bg-blue-600', 'text-white');
      this.dom.tabGame.classList.add('bg-white', 'text-gray-700');
    }
  }

  setStatus(text, type = 'info') {
    if (!this.dom.statusBadge) return;
    this.dom.statusBadge.textContent = text;
    this.dom.statusBadge.className = 'text-xs font-semibold px-3 py-1.5 rounded transition';

    if (type === 'error') {
      this.dom.statusBadge.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-300');
    } else if (type === 'success') {
      this.dom.statusBadge.classList.add('bg-emerald-100', 'text-emerald-800', 'border', 'border-emerald-300');
    } else if (type === 'warn') {
      this.dom.statusBadge.classList.add('bg-amber-100', 'text-amber-800', 'border', 'border-amber-300');
    } else {
      this.dom.statusBadge.classList.add('bg-blue-100', 'text-blue-800', 'border', 'border-blue-200');
    }
  }

  /**
   * Maneja la proposición de una semilla introducida por el usuario
   */
  handleProposeSeed() {
    const raw = this.dom.seedInput?.value.trim();
    if (!raw) {
      this.handleRandomSeed();
      return;
    }
    this.loadPuzzleBySeed(raw, this.currentLevel);
  }

  /**
   * Genera y propone una semilla pseudo-aleatoria nueva (🎲)
   */
  handleRandomSeed() {
    const newSeed = Math.floor(10000 + Math.random() * 90000);
    if (this.dom.seedInput) {
      this.dom.seedInput.value = newSeed;
    }
    this.loadPuzzleBySeed(newSeed, this.currentLevel);
  }

  /**
   * Carga una semilla propuesta desde el modal de búsqueda
   */
  handleModalProposeSeed() {
    const raw = this.dom.modalSeedInput?.value.trim();
    if (!raw) return;
    this.closeSearchModal();
    if (this.dom.seedInput) {
      this.dom.seedInput.value = raw;
    }
    this.loadPuzzleBySeed(raw, this.currentLevel);
  }

  /**
   * Genera y carga el Sudoku matemático correspondiente a la semilla y dificultad dadas
   */
  loadPuzzleBySeed(seed, difficulty = this.currentLevel) {
    this.stopTimer();
    this.mode = 'idle';
    this.currentSeed = seed;
    this.currentLevel = difficulty;
    this.currentPuzzleId = `seed_${seed}_${difficulty}`;

    // Actualizar radios en UI
    const radio = document.querySelector(`input[name="nivel"][value="${difficulty}"]`);
    if (radio) radio.checked = true;

    // Generar puzzle matemático con solución única garantizada
    const game = this.engine.generateGame(difficulty, seed);
    this.initialGrid = this.engine.cloneGrid(game.board);
    this.playGrid = this.engine.cloneGrid(game.board);
    this.solutionGrid = this.engine.cloneGrid(game.solution);
    this.showPossibilities = false;

    this.dom.startDateInput.value = '';
    this.dom.elapsedTimeInput.value = '00:00';
    if (this.dom.seedInput) {
      this.dom.seedInput.value = seed;
    }
    if (this.dom.modalSeedInput) {
      this.dom.modalSeedInput.value = seed;
    }

    // Sincronizar URL sin recargar la página
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('semilla', seed);
        url.searchParams.set('nivel', difficulty);
        window.history.replaceState({ semilla: seed, nivel: difficulty }, '', url.toString());
      } catch (e) {}
    }

    this.setStatus(`🌱 Semilla "${seed}" cargada (${difficulty.toUpperCase()} — ${game.initialClues} pistas iniciales). Pulsa "Iniciar" para comenzar.`, 'success');
    this.updateBoardDisplay();
  }
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  window.sudokuApp = new SudokuApp();
});
