import { SudokuEngine } from './sudoku-engine.js';
import { SudokuStorage } from './sudoku-storage.js';
import { SudokuOCR } from './sudoku-ocr.js';

class SudokuApp {
  constructor() {
    this.engine = new SudokuEngine();
    this.storage = new SudokuStorage();

    // Estado del juego
    this.mode = 'idle'; // 'idle', 'plantear', 'jugando', 'resuelto'
    this.currentLevel = 'facil';
    this.currentNumber = 2;
    this.currentPuzzleId = 'facil_2';

    // Motor de Visión OCR
    this.ocr = new SudokuOCR();
    this.ocrGrid = null;
    this.ocrWarpedCanvas = null;
    this.ocrSelectedRow = 0;
    this.ocrSelectedCol = 0;

    // Tableros
    this.initialGrid = this.engine.createEmptyGrid();
    this.playGrid = this.engine.createEmptyGrid();
    this.solutionGrid = null;

    // Selección de casilla activa
    this.selectedRow = 0;
    this.selectedCol = 0;

    // Posibilidades activas en pantalla espejo
    this.showPossibilities = false;

    // NUEVA OPCIÓN: Superponer posibles en el tablero de solución (pantalla izquierda)
    this.overlayPossibilities = localStorage.getItem('top_sudoku_overlay_possibilities') === 'true';

    // Criterio de rechazo de casilla ('solucion' vs 'situacion_actual')
    this.rejectionCriterion = localStorage.getItem('top_sudoku_rejection_criterion') || 'solucion';

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

      // Superponer posibles en pantalla de solución (Nueva opción)
      toggleOverlayPossibilities: document.getElementById('toggle-overlay-possibilities'),
      btnToggleOverlayFast: document.getElementById('btn-toggle-overlay-fast'),
      badgeOverlayActive: document.getElementById('badge-overlay-active'),

      // Botones de control
      btnPlantear: document.getElementById('btn-plantear'),
      btnCerrar: document.getElementById('btn-cerrar'),
      btnHeaderCerrar: document.getElementById('btn-header-cerrar'),
      exitScreen: document.getElementById('exit-screen'),
      btnExitTryClose: document.getElementById('btn-exit-try-close'),
      btnExitResume: document.getElementById('btn-exit-resume'),
      btnGrabar: document.getElementById('btn-grabar'),
      btnBuscar: document.getElementById('btn-buscar'),
      btnIniciar: document.getElementById('btn-iniciar'),
      btnResolver: document.getElementById('btn-resolver'),
      btnCancelar: document.getElementById('btn-cancelar'),
      btnPosibles: document.getElementById('btn-posibles'),
      btnPosiblesMirror: document.getElementById('btn-posibles-mirror'),
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

      // Criterio de rechazo de casilla
      rejectionRadios: document.querySelectorAll('input[name="criterio_rechazo"]'),

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
      keypad: document.getElementById('touch-keypad'),

      // Módulo OCR e Importación por Imagen
      btnScanPhoto: document.getElementById('btn-scan-photo'),
      ocrModal: document.getElementById('ocr-modal'),
      btnCloseOcr: document.getElementById('btn-close-ocr'),
      ocrCameraInput: document.getElementById('ocr-camera-input'),
      ocrFileInput: document.getElementById('ocr-file-input'),
      ocrDropZone: document.getElementById('ocr-drop-zone'),
      btnOcrSample: document.getElementById('btn-ocr-sample'),
      ocrStepUpload: document.getElementById('ocr-step-upload'),
      ocrStepProcessing: document.getElementById('ocr-step-processing'),
      ocrStepReview: document.getElementById('ocr-step-review'),
      ocrProgressBar: document.getElementById('ocr-progress-bar'),
      ocrProgressTitle: document.getElementById('ocr-progress-title'),
      ocrProgressDesc: document.getElementById('ocr-progress-desc'),
      ocrPreviewCanvas: document.getElementById('ocr-preview-canvas'),
      ocrGridBoard: document.getElementById('ocr-grid-board'),
      ocrCluesCount: document.getElementById('ocr-clues-count'),
      ocrValidationBadge: document.getElementById('ocr-validation-badge'),
      ocrValidationText: document.getElementById('ocr-validation-text'),
      btnOcrRescan: document.getElementById('btn-ocr-rescan'),
      btnOcrLoadBoard: document.getElementById('btn-ocr-load-board'),
      btnOcrLoadAndSave: document.getElementById('btn-ocr-load-and-save')
    };

    // Sincronizar radio del criterio de rechazo guardado
    const activeRejection = document.querySelector(`input[name="criterio_rechazo"][value="${this.rejectionCriterion}"]`);
    if (activeRejection) activeRejection.checked = true;

    // Sincronizar opción de superponer posibles
    this.updateOverlayUI();

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
    this.dom.btnPosiblesMirror?.addEventListener('click', () => this.togglePosibles());
    this.dom.btnReiniciar.addEventListener('click', () => this.handleReiniciar());
    this.dom.btnCerrar.addEventListener('click', () => this.handleCerrar());
    this.dom.btnHeaderCerrar?.addEventListener('click', () => this.handleCerrar());
    this.dom.btnExitTryClose?.addEventListener('click', () => this.tryCloseWindow());
    this.dom.btnExitResume?.addEventListener('click', () => this.resumeFromExit());

    // Superponer posibles en pantalla de solución
    this.dom.toggleOverlayPossibilities?.addEventListener('change', (e) => {
      this.toggleOverlayPossibilities(e.target.checked);
    });
    this.dom.btnToggleOverlayFast?.addEventListener('click', () => {
      this.toggleOverlayPossibilities();
    });

    // Módulo OCR desde Imagen o Cámara
    this.dom.btnScanPhoto?.addEventListener('click', () => this.openOcrModal());
    this.dom.btnCloseOcr?.addEventListener('click', () => this.closeOcrModal());
    this.dom.ocrCameraInput?.addEventListener('change', (e) => this.handleOcrInputFiles(e.target.files));
    this.dom.ocrFileInput?.addEventListener('change', (e) => this.handleOcrInputFiles(e.target.files));
    this.dom.ocrDropZone?.addEventListener('click', () => this.dom.ocrFileInput?.click());
    this.dom.btnOcrSample?.addEventListener('click', () => this.handleOcrSample());
    this.dom.btnOcrRescan?.addEventListener('click', () => this.resetOcrModal());
    this.dom.btnOcrLoadBoard?.addEventListener('click', () => this.applyOcrGridToBoard(false));
    this.dom.btnOcrLoadAndSave?.addEventListener('click', () => this.applyOcrGridToBoard(true));

    // Drag & Drop en zona de subida OCR
    if (this.dom.ocrDropZone) {
      this.dom.ocrDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.dom.ocrDropZone.classList.add('bg-blue-100', 'border-blue-400');
      });
      this.dom.ocrDropZone.addEventListener('dragleave', () => {
        this.dom.ocrDropZone.classList.remove('bg-blue-100', 'border-blue-400');
      });
      this.dom.ocrDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.dom.ocrDropZone.classList.remove('bg-blue-100', 'border-blue-400');
        if (e.dataTransfer && e.dataTransfer.files) {
          this.handleOcrInputFiles(e.dataTransfer.files);
        }
      });
    }

    // Soporte para pegar imágenes del portapapeles (Ctrl + V)
    window.addEventListener('paste', (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            this.openOcrModal();
            this.processOcrImage(file);
            break;
          }
        }
      }
    });

    // Teclado numérico táctil de corrección OCR
    const ocrKeys = document.querySelectorAll('.ocr-key');
    ocrKeys.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.ocrVal, 10);
        if (!isNaN(val) && val >= 0 && val <= 9) {
          this.setOcrCellValue(this.ocrSelectedRow, this.ocrSelectedCol, val);
        }
      });
    });

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

    // Criterio de rechazo de casilla ('solucion' vs 'situacion_actual')
    this.dom.rejectionRadios?.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.rejectionCriterion = e.target.value;
        localStorage.setItem('top_sudoku_rejection_criterion', this.rejectionCriterion);
        if (this.rejectionCriterion === 'solucion') {
          this.setStatus('Criterio: Rechazo contra el resultado final (Solución única).', 'info');
        } else {
          this.setStatus('Criterio: Rechazo según la situación actual (Reglas clásicas de fila, col y caja).', 'info');
        }
      });
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

    this.dom.puzzleNumberInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    this.dom.puzzleNumberInput.addEventListener('focus', (e) => {
      e.target.select();
      setTimeout(() => {
        try {
          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (_) {}
      }, 300);
    });

    this.dom.puzzleNumberInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.dom.puzzleNumberInput.blur();
      }
    });

    const btnPrevPuzzle = document.getElementById('btn-prev-puzzle');
    const btnNextPuzzle = document.getElementById('btn-next-puzzle');
    if (btnPrevPuzzle) {
      btnPrevPuzzle.addEventListener('click', () => {
        let num = parseInt(this.dom.puzzleNumberInput.value, 10) || 1;
        if (num > 1) {
          num--;
          this.dom.puzzleNumberInput.value = num;
          this.dom.puzzleNumberInput.dispatchEvent(new Event('change'));
        }
      });
    }
    if (btnNextPuzzle) {
      btnNextPuzzle.addEventListener('click', () => {
        let num = parseInt(this.dom.puzzleNumberInput.value, 10) || 1;
        num++;
        this.dom.puzzleNumberInput.value = num;
        this.dom.puzzleNumberInput.dispatchEvent(new Event('change'));
      });
    }

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
        cell.addEventListener('click', () => {
          this.selectCell(r, c);
        });
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
    const rightCells = this.dom.rightBoard?.querySelectorAll('.possibility-cell') || [];
    const selectedVal = this.playGrid[this.selectedRow][this.selectedCol];

    const applyHighlightsToCellList = (cells) => {
      cells.forEach(cell => {
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);

        cell.classList.remove('selected', 'highlight-axis', 'same-number');

        if (r === this.selectedRow && c === this.selectedCol) {
          cell.classList.add('selected');
        } else if (r === this.selectedRow || c === this.selectedCol || 
                  (Math.floor(r / 3) === Math.floor(this.selectedRow / 3) && Math.floor(c / 3) === Math.floor(this.selectedCol / 3))) {
          // Sombra muy tenue en fila, columna y región 3x3
          cell.classList.add('highlight-axis');
        }

        if (selectedVal !== 0 && this.playGrid[r][c] === selectedVal) {
          cell.classList.add('same-number');
        }
      });
    };

    applyHighlightsToCellList(leftCells);
    if (rightCells.length > 0) {
      applyHighlightsToCellList(rightCells);
    }
  }

  /**
   * Actualiza el contenido visual del tablero izquierdo (Planteamiento y Solución)
   */
  updateBoardDisplay() {
    const cells = this.dom.leftBoard.querySelectorAll('.sudoku-cell');
    const possibilities = (this.overlayPossibilities || this.showPossibilities) 
      ? this.engine.getAllPossibilities(this.playGrid) 
      : null;

    cells.forEach(cell => {
      const r = parseInt(cell.dataset.row, 10);
      const c = parseInt(cell.dataset.col, 10);
      const val = this.playGrid[r][c];
      const isInitial = this.initialGrid[r][c] !== 0;

      cell.innerHTML = '';
      cell.classList.remove('initial', 'user-placed', 'single-candidate');

      if (val !== 0) {
        cell.textContent = val;
        if (isInitial && this.mode !== 'plantear') {
          cell.classList.add('initial');
        } else {
          cell.classList.add('user-placed');
        }
      } else {
        // Casilla vacía en tablero de solución
        if (this.overlayPossibilities && this.mode !== 'plantear' && possibilities) {
          const info = possibilities[r][c];
          const candidates = info.candidates;
          if (candidates.length === 1) {
            // Candidato único: fondo especial y número directo destacado
            cell.classList.add('single-candidate');
            const singleSpan = document.createElement('span');
            singleSpan.className = 'single-candidate-num';
            singleSpan.textContent = candidates[0];
            singleSpan.title = `Candidato único: ${candidates[0]} (Clic para colocar)`;
            singleSpan.addEventListener('click', (e) => {
              e.stopPropagation();
              this.selectCell(r, c);
              this.setCellValue(r, c, candidates[0]);
            });
            cell.appendChild(singleSpan);
          } else if (candidates.length > 0) {
            const box = document.createElement('div');
            box.className = 'candidate-box overlay-candidate-box';
            candidates.forEach(cand => {
              const candSpan = document.createElement('span');
              candSpan.className = 'candidate-num';
              candSpan.textContent = cand;
              candSpan.title = `Poner ${cand} en la casilla (${r + 1}, ${c + 1})`;
              candSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectCell(r, c);
                this.setCellValue(r, c, cand);
              });
              box.appendChild(candSpan);
            });
            cell.appendChild(box);
          }
        }
      }
    });

    this.updateRightBoardDisplay();
    this.updateHighlights();
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
            const singleSpan = document.createElement('span');
            singleSpan.className = 'single-candidate-num';
            singleSpan.textContent = candidates[0];
            singleSpan.title = `Candidato único: ${candidates[0]} (Clic para colocar en tablero)`;
            singleSpan.addEventListener('click', (e) => {
              e.stopPropagation();
              this.selectCell(r, c);
              this.setCellValue(r, c, candidates[0]);
            });
            cell.appendChild(singleSpan);
          } else if (candidates.length > 0) {
            const box = document.createElement('div');
            box.className = 'candidate-box';
            candidates.forEach(cand => {
              const candSpan = document.createElement('span');
              candSpan.className = 'candidate-num';
              candSpan.textContent = cand;
              candSpan.title = `Poner ${cand} en la casilla (${r + 1}, ${c + 1})`;
              candSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectCell(r, c);
                this.setCellValue(r, c, cand);
              });
              box.appendChild(candSpan);
            });
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
    // Si la partida no ha comenzado (modo 'idle'), iniciar automáticamente
    if (this.mode === 'idle') {
      this.handleIniciar();
    }

    if (this.mode === 'resuelto') {
      this.setStatus('Sudoku resuelto. Pulsa "Reiniciar" o "Iniciar" para comenzar una nueva partida.', 'info');
      return;
    }

    // Si estamos jugando y es una casilla inicial fijada, no permitir sobreescribir
    if (this.mode === 'jugando' && this.initialGrid[row][col] !== 0) {
      this.setStatus(`La casilla (${row + 1}, ${col + 1}) es una pista inicial fija del Sudoku.`, 'warn');
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

    // Modo Jugando: VALIDACIÓN SEGÚN EL CRITERIO ELEGIDO POR EL JUGADOR
    if (this.mode === 'jugando') {
      if (this.rejectionCriterion === 'solucion') {
        // Opción A: Comprobación estricta contra el Resultado Final (Solución única)
        if (!this.solutionGrid) {
          const res = this.engine.solve(this.initialGrid);
          if (res.solved) {
            this.solutionGrid = this.engine.cloneGrid(res.solution);
          }
        }

        if (this.solutionGrid && this.solutionGrid[row][col] !== 0) {
          if (num !== this.solutionGrid[row][col]) {
            this.flashCellError(row, col);
            this.setStatus(`¡Rechazado! El número ${num} no coincide con el resultado final de esta casilla.`, 'error');
            return;
          }
        } else {
          if (!this.engine.isValidMove(this.playGrid, row, col, num)) {
            this.flashCellError(row, col);
            this.setStatus(`¡Rechazado! El número ${num} colisiona en fila, columna o caja 3x3.`, 'error');
            return;
          }
        }
      } else {
        // Opción B: Comprobación según la Situación Actual de la casilla (Reglas clásicas)
        if (!this.engine.isValidMove(this.playGrid, row, col, num)) {
          this.flashCellError(row, col);
          const collisions = this.findCollisions(this.playGrid, row, col, num);
          collisions.forEach(c => this.flashCellError(c.row, c.col));
          this.setStatus(`¡Rechazado! El número ${num} colisiona en fila, columna o caja 3x3 en la situación actual.`, 'error');
          return;
        }
      }

      this.playGrid[row][col] = num;
      this.updateBoardDisplay();

      // Comprobar si completó el Sudoku o si está lleno
      if (this.engine.isCompleted(this.playGrid)) {
        this.handleGameWon();
      } else {
        const isFull = this.playGrid.every(r => r.every(v => v !== 0));
        if (isFull) {
          this.setStatus('Tablero completo, pero contiene contradicciones o números repetidos.', 'error');
        } else {
          this.advanceToNextCell(row, col);
        }
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

  /**
   * Localiza todas las casillas que provocan colisión con 'num' en fila, col o caja 3x3
   */
  findCollisions(grid, row, col, num) {
    const collisions = [];
    // Fila
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === num) collisions.push({ row, col: c });
    }
    // Columna
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === num) collisions.push({ row: r, col });
    }
    // Caja 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c] === num) {
          if (!collisions.some(item => item.row === r && item.col === c)) {
            collisions.push({ row: r, col: c });
          }
        }
      }
    }
    return collisions;
  }

  flashCellError(row, col) {
    const cell = this.dom.leftBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
      cell.classList.add('cell-error');
      setTimeout(() => cell.classList.remove('cell-error'), 400);
    }
  }

  handlePhysicalKeyboard(e) {
    // Manejo de teclado dentro del Modal OCR (Revisión interactiva)
    if (this.dom.ocrModal && !this.dom.ocrModal.classList.contains('hidden')) {
      if (e.key === 'Escape') {
        this.closeOcrModal();
        return;
      }
      if (this.dom.ocrStepReview && !this.dom.ocrStepReview.classList.contains('hidden')) {
        if (e.key >= '1' && e.key <= '9') {
          this.setOcrCellValue(this.ocrSelectedRow, this.ocrSelectedCol, parseInt(e.key, 10));
          return;
        }
        if (e.key === '0' || e.key === 'Delete' || e.key === 'Backspace') {
          this.setOcrCellValue(this.ocrSelectedRow, this.ocrSelectedCol, 0);
          return;
        }
        if (e.key === 'ArrowUp') {
          this.ocrSelectedRow = Math.max(0, this.ocrSelectedRow - 1);
          this.renderOcrReviewBoard();
          e.preventDefault();
          return;
        }
        if (e.key === 'ArrowDown') {
          this.ocrSelectedRow = Math.min(8, this.ocrSelectedRow + 1);
          this.renderOcrReviewBoard();
          e.preventDefault();
          return;
        }
        if (e.key === 'ArrowLeft') {
          this.ocrSelectedCol = Math.max(0, this.ocrSelectedCol - 1);
          this.renderOcrReviewBoard();
          e.preventDefault();
          return;
        }
        if (e.key === 'ArrowRight') {
          this.ocrSelectedCol = Math.min(8, this.ocrSelectedCol + 1);
          this.renderOcrReviewBoard();
          e.preventDefault();
          return;
        }
      }
      return;
    }

    // Si el usuario está escribiendo en un input, textarea o select, no interceptar
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    // Si hay un modal abierto, no interceptar
    if (!this.dom.searchModal.classList.contains('hidden') || !this.dom.confirmModal.classList.contains('hidden')) {
      return;
    }

    // Movimiento con flechas de dirección
    if (e.key === 'ArrowUp') {
      this.selectCell(Math.max(0, this.selectedRow - 1), this.selectedCol);
      e.preventDefault();
      return;
    } else if (e.key === 'ArrowDown') {
      this.selectCell(Math.min(8, this.selectedRow + 1), this.selectedCol);
      e.preventDefault();
      return;
    } else if (e.key === 'ArrowLeft') {
      this.selectCell(this.selectedRow, Math.max(0, this.selectedCol - 1));
      e.preventDefault();
      return;
    } else if (e.key === 'ArrowRight') {
      this.selectCell(this.selectedRow, Math.min(8, this.selectedCol + 1));
      e.preventDefault();
      return;
    }

    // Detección robusta de números (teclado alfanumérico estándar y teclado numérico NumPad)
    let num = null;
    if (e.key >= '1' && e.key <= '9') {
      num = parseInt(e.key, 10);
    } else if (e.code && e.code.startsWith('Numpad') && e.code.length === 7) {
      const d = parseInt(e.code.replace('Numpad', ''), 10);
      if (d >= 1 && d <= 9) num = d;
    } else if (e.code && e.code.startsWith('Digit') && e.code.length === 6) {
      const d = parseInt(e.code.replace('Digit', ''), 10);
      if (d >= 1 && d <= 9) num = d;
    }

    if (num !== null) {
      this.setCellValue(this.selectedRow, this.selectedCol, num);
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0' || e.code === 'Numpad0' || e.code === 'Digit0') {
      this.setCellValue(this.selectedRow, this.selectedCol, 0);
    } else if (e.key === 'p' || e.key === 'P') {
      this.togglePosibles();
    } else if (e.key === 'o' || e.key === 'O') {
      this.toggleOverlayPossibilities();
    }
  }

  // --- BOTONES DE CONTROL SEGÚN LAS REGLAS DE GUILLERMO ---

  /**
   * 2.- Botón Plantear: Limpia y predispone el tablero para meter los números iniciales
   */
  handlePlantear() {
    this.stopTimer();
    this.mode = 'plantear';
    this.currentSeed = null;
    this.currentBoardString = null;
    this.initialGrid = this.engine.createEmptyGrid();
    this.playGrid = this.engine.createEmptyGrid();
    this.solutionGrid = null;
    this.showPossibilities = false;

    const nextNum = this.storage.getNextNumberForLevel(this.currentLevel);
    this.currentPuzzleId = `custom_${Date.now()}`;
    this.currentNumber = nextNum;
    this.dom.puzzleNumberInput.value = nextNum;

    this.dom.startDateInput.value = '';
    this.dom.elapsedTimeInput.value = '00:00';
    if (this.dom.seedInput) this.dom.seedInput.value = '';

    this.setStatus(`Modo PLANTEAR activado: Introduce los números iniciales para el Sudoku #${nextNum} (${this.currentLevel.toUpperCase()}). Pulsa "Grabar" al terminar.`, 'info');
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

    // Comprobar si el planteamiento tiene solución matemática válida antes de guardar
    const res = this.engine.solve(this.initialGrid);
    if (!res.solved) {
      alert('Este planteamiento no tiene ninguna solución matemática válida. Revisa los números introducidos.');
      this.setStatus('Error: El planteamiento introducido no tiene solución matemática.', 'error');
      return;
    }
    this.solutionGrid = this.engine.cloneGrid(res.solution);

    // Determinar el número asignado en la colección
    let num = parseInt(this.dom.puzzleNumberInput.value, 10);
    const existingForLevel = this.storage.getAll().filter(p => p.level === this.currentLevel);
    const alreadyExists = existingForLevel.some(p => p.number === num && p.id !== this.currentPuzzleId);

    // Si es un nuevo planteamiento o semilla, o si el número ya existe en otro puzle, asignar el siguiente número libre
    if (!num || isNaN(num) || num <= 0 || alreadyExists) {
      num = this.storage.getNextNumberForLevel(this.currentLevel);
      this.dom.puzzleNumberInput.value = num;
    }

    let customName = '';
    if (this.currentSeed) {
      customName = `Sudoku Semilla #${this.currentSeed} (${this.currentLevel.toUpperCase()})`;
    } else if (this.currentBoardString) {
      customName = `Sudoku Cadena #${num} (${this.currentLevel.toUpperCase()})`;
    } else if (this.mode === 'plantear') {
      customName = `Sudoku Planteado #${num} (${this.currentLevel.toUpperCase()})`;
    } else {
      customName = `Sudoku ${this.currentLevel.toUpperCase()} #${num}`;
    }

    const puzzle = this.storage.savePuzzle(this.currentLevel, num, this.initialGrid, customName, this.currentSeed);
    this.currentPuzzleId = puzzle.id;
    this.currentNumber = num;

    // Actualizar el número del selector al siguiente hueco libre para el próximo guardado
    const nextFreeNum = this.storage.getNextNumberForLevel(this.currentLevel);
    this.dom.puzzleNumberInput.value = nextFreeNum;

    // Si estábamos en modo plantear, pasamos a modo reposo listo para jugar
    if (this.mode === 'plantear') {
      this.mode = 'idle';
    }

    this.setStatus(`Sudoku guardado con éxito en tu colección como #${num} (${puzzle.name}). ¡Queda archivado para el buscador!`, 'success');
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
      const isDefault = p.id.startsWith('facil_1') || p.id.startsWith('facil_2') || p.id.startsWith('medio_1') || p.id.startsWith('dificil_1') || p.id.startsWith('endemoniado_1');
      item.className = 'flex items-center justify-between p-3 border rounded hover:bg-blue-50 transition gap-2';
      item.innerHTML = `
        <div class="flex-1 cursor-pointer" data-action="load">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-blue-900">#${p.number} — ${p.name}</span>
            <span class="text-xs px-2 py-0.5 rounded font-semibold ${p.level === 'facil' ? 'bg-green-100 text-green-800' : p.level === 'medio' ? 'bg-yellow-100 text-yellow-800' : p.level === 'dificil' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}">${p.level.toUpperCase()}</span>
            ${p.seed ? `<span class="text-[10px] bg-slate-100 text-slate-700 border border-slate-300 px-1.5 py-0.5 rounded font-mono">🌱 ${p.seed}</span>` : ''}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            Estado: ${p.isSolved ? '✅ Resuelto' : '⏳ Pendiente'} ${p.bestTime ? `| Récord: ${this.formatTime(p.bestTime)}` : ''} ${p.createdAt ? `| Guardado: ${p.createdAt}` : ''}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded cursor-pointer transition shadow-xs" data-action="load">Cargar</button>
          ${!isDefault ? `<button class="px-2 py-1 text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs rounded transition cursor-pointer" title="Eliminar este Sudoku guardado" data-action="delete">🗑️</button>` : ''}
        </div>
      `;

      item.addEventListener('click', (e) => {
        const delBtn = e.target.closest('[data-action="delete"]');
        if (delBtn) {
          e.stopPropagation();
          if (confirm(`¿Seguro que deseas eliminar "#${p.number} — ${p.name}" de tu colección?`)) {
            this.storage.deletePuzzle(p.id);
            this.updateSearchResults();
            this.setStatus(`Sudoku #${p.number} eliminado de tu colección.`, 'info');
          }
          return;
        }

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
    const res = this.engine.solve(puzzle.initialGrid);
    this.solutionGrid = res.solved ? this.engine.cloneGrid(res.solution) : null;
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
    if (!this.solutionGrid) {
      const res = this.engine.solve(this.initialGrid);
      this.solutionGrid = res.solved ? this.engine.cloneGrid(res.solution) : null;
    }
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
   * Actualiza el estado visual de los controles de la opción Superponer Posibles
   */
  updateOverlayUI() {
    if (this.dom.toggleOverlayPossibilities) {
      this.dom.toggleOverlayPossibilities.checked = this.overlayPossibilities;
    }
    if (this.dom.badgeOverlayActive) {
      this.dom.badgeOverlayActive.classList.toggle('hidden', !this.overlayPossibilities);
    }
    if (this.dom.btnToggleOverlayFast) {
      this.dom.btnToggleOverlayFast.classList.toggle('bg-amber-200', this.overlayPossibilities);
      this.dom.btnToggleOverlayFast.classList.toggle('border-amber-400', this.overlayPossibilities);
      this.dom.btnToggleOverlayFast.classList.toggle('text-amber-950', this.overlayPossibilities);
      this.dom.btnToggleOverlayFast.classList.toggle('font-bold', this.overlayPossibilities);
      const textEl = document.getElementById('text-toggle-overlay-fast');
      if (textEl) {
        textEl.textContent = this.overlayPossibilities ? 'Ocultar posibles' : 'Superponer posibles';
      }
    }
  }

  /**
   * Alterna la opción de superponer posibles directamente en el tablero de solución
   */
  toggleOverlayPossibilities(forceState = null) {
    if (forceState !== null) {
      this.overlayPossibilities = forceState;
    } else {
      this.overlayPossibilities = !this.overlayPossibilities;
    }
    localStorage.setItem('top_sudoku_overlay_possibilities', this.overlayPossibilities);
    this.updateOverlayUI();
    this.updateBoardDisplay();

    if (this.overlayPossibilities) {
      this.setStatus('Superposición de posibles activada en la pantalla de solución. Puedes resolver viendo los candidatos en cada casilla.', 'info');
    } else {
      this.setStatus('Superposición de posibles desactivada.', 'info');
    }
  }

  /**
   * 8.- Botón Posibles: Alterna la visualización de candidatos y despliega la pantalla espejo directamente
   */
  togglePosibles(forceState = null) {
    if (forceState !== null) {
      this.showPossibilities = forceState;
    } else {
      this.showPossibilities = !this.showPossibilities;
    }

    const btns = [this.dom.btnPosibles, this.dom.btnPosiblesMirror];
    btns.forEach(btn => {
      if (btn) {
        btn.classList.toggle('bg-amber-300', this.showPossibilities);
        btn.classList.toggle('border-amber-500', this.showPossibilities);
        btn.classList.toggle('ring-2', this.showPossibilities);
        btn.classList.toggle('ring-amber-400', this.showPossibilities);
      }
    });

    // En pantallas estrechas o móviles, desplegar directamente la pestaña de la pantalla espejo
    if (this.showPossibilities && window.innerWidth < 1024) {
      this.switchMobileTab('possibilities');
    }

    this.updateRightBoardDisplay();

    if (this.showPossibilities) {
      const singles = this.engine.findNakedSingles(this.playGrid);
      if (singles.length > 0) {
        this.setStatus(`Calculadas posibilidades: ¡Hay ${singles.length} casilla(s) con candidato único (resaltadas en amarillo)!`, 'info');
      } else {
        this.setStatus('Calculadas posibilidades por cuadro en tiempo real en la pantalla espejo.', 'info');
      }
    } else {
      this.setStatus('Pantalla espejo en modo estándar.', 'info');
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

  hasUserMadeMoves() {
    if (this.mode !== 'jugando') return false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.initialGrid[r][c] === 0 && this.playGrid[r][c] !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  handleCerrar() {
    if (this.hasUserMadeMoves()) {
      this.openConfirmModal('Tienes una partida en curso con números colocados. ¿Deseas abandonar la partida y salir de Top-Sudoku? Se perderá el avance actual.', () => {
        this.executeExit();
      });
      return;
    }
    this.executeExit();
  }

  executeExit() {
    this.stopTimer();
    this.mode = 'idle';
    this.setStatus('Sesión cerrada.', 'info');

    // 1. Si se ejecuta dentro de wrapper nativo (Capacitor / Cordova / Electron)
    try {
      if (typeof window !== 'undefined' && window.Capacitor?.Plugins?.App?.exitApp) {
        window.Capacitor.Plugins.App.exitApp();
        return;
      }
      if (typeof window !== 'undefined' && window.Capacitor?.App?.exitApp) {
        window.Capacitor.App.exitApp();
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.app?.exitApp) {
        navigator.app.exitApp();
        return;
      }
    } catch (e) {}

    // 2. Intentar cerrar ventana si el navegador lo permite
    try {
      window.close();
    } catch (e) {}

    // 3. Mostrar pantalla completa de salida
    if (this.dom.exitScreen) {
      this.dom.exitScreen.classList.remove('hidden');
    }
  }

  tryCloseWindow() {
    try {
      if (window.history && window.history.length > 1) {
        window.history.back();
        return;
      }
    } catch (e) {}
    try {
      window.close();
    } catch (e) {}
  }

  resumeFromExit() {
    if (this.dom.exitScreen) {
      this.dom.exitScreen.classList.add('hidden');
    }
    this.setStatus('¡Bienvenido de nuevo a Top-Sudoku!', 'info');
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

      // Al desplegar la pantalla espejo, activar los posibles directamente
      if (!this.showPossibilities) {
        this.togglePosibles(true);
      }
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
   * Interpreta cadenas de 81 caracteres numéricos o puntos como tableros completos
   */
  parseBoardString(raw) {
    if (typeof raw !== 'string') return null;
    const clean = raw.trim().replace(/[\s\r\n]/g, '');
    if (clean.length === 81 && /^[0-9.]+$/.test(clean)) {
      const grid = [];
      for (let r = 0; r < 9; r++) {
        const row = [];
        for (let c = 0; c < 9; c++) {
          const char = clean[r * 9 + c];
          const val = (char === '.' || char === '0') ? 0 : parseInt(char, 10);
          row.push(val);
        }
        grid.push(row);
      }
      return grid;
    }
    return null;
  }

  /**
   * Carga un Sudoku tanto si el usuario introduce una semilla como una cadena de 81 caracteres
   */
  loadPuzzleBySeedOrString(raw, difficulty = this.currentLevel) {
    const board81 = this.parseBoardString(raw);
    if (board81) {
      this.stopTimer();
      this.mode = 'idle';
      this.currentSeed = null;
      this.currentBoardString = raw.trim();
      this.currentLevel = difficulty;

      const nextNum = this.storage.getNextNumberForLevel(this.currentLevel);
      this.currentPuzzleId = `str81_${Date.now()}`;
      this.currentNumber = nextNum;
      this.dom.puzzleNumberInput.value = nextNum;

      this.initialGrid = this.engine.cloneGrid(board81);
      this.playGrid = this.engine.cloneGrid(board81);
      const res = this.engine.solve(board81);
      this.solutionGrid = res.solved ? this.engine.cloneGrid(res.solution) : null;
      this.showPossibilities = false;

      this.dom.startDateInput.value = '';
      this.dom.elapsedTimeInput.value = '00:00';
      if (this.dom.seedInput) this.dom.seedInput.value = raw.substring(0, 12) + '...';

      this.setStatus(`Cadena de 81 caracteres cargada (${difficulty.toUpperCase()}). Asignado nº ${nextNum} en colección. Pulsa "Iniciar" para jugar o "Grabar" para guardarlo.`, 'success');
      this.updateBoardDisplay();
      return;
    }

    this.loadPuzzleBySeed(raw, difficulty);
  }

  /**
   * Maneja la proposición de una semilla o cadena introducida por el usuario
   */
  handleProposeSeed() {
    const raw = this.dom.seedInput?.value.trim();
    if (!raw) {
      this.handleRandomSeed();
      return;
    }
    this.loadPuzzleBySeedOrString(raw, this.currentLevel);
  }

  /**
   * Genera y propone una semilla pseudo-aleatoria nueva (🎲)
   */
  handleRandomSeed() {
    const newSeed = Math.floor(10000 + Math.random() * 90000);
    if (this.dom.seedInput) {
      this.dom.seedInput.value = newSeed;
    }
    this.loadPuzzleBySeedOrString(newSeed, this.currentLevel);
  }

  /**
   * Carga una semilla o cadena propuesta desde el modal de búsqueda
   */
  handleModalProposeSeed() {
    const raw = this.dom.modalSeedInput?.value.trim();
    if (!raw) return;
    this.closeSearchModal();
    if (this.dom.seedInput) {
      this.dom.seedInput.value = raw;
    }
    this.loadPuzzleBySeedOrString(raw, this.currentLevel);
  }

  /**
   * Genera y carga el Sudoku matemático correspondiente a la semilla y dificultad dadas
   */
  loadPuzzleBySeed(seed, difficulty = this.currentLevel) {
    this.stopTimer();
    this.mode = 'idle';
    this.currentSeed = seed;
    this.currentBoardString = null;
    this.currentLevel = difficulty;
    
    const nextNum = this.storage.getNextNumberForLevel(this.currentLevel);
    this.currentPuzzleId = `seed_${seed}_${difficulty}`;
    this.currentNumber = nextNum;
    this.dom.puzzleNumberInput.value = nextNum;

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

  // ==========================================
  // MÓDULO DE ESCANEO OCR E IMPORTACIÓN DE IMAGEN
  // ==========================================

  openOcrModal() {
    if (this.dom.ocrModal) {
      this.dom.ocrModal.classList.remove('hidden');
      this.resetOcrModal();
    }
  }

  closeOcrModal() {
    if (this.dom.ocrModal) {
      this.dom.ocrModal.classList.add('hidden');
    }
  }

  resetOcrModal() {
    if (this.dom.ocrStepUpload) this.dom.ocrStepUpload.classList.remove('hidden');
    if (this.dom.ocrStepProcessing) this.dom.ocrStepProcessing.classList.add('hidden');
    if (this.dom.ocrStepReview) this.dom.ocrStepReview.classList.add('hidden');
    this.updateOcrProgress(0, '');
  }

  updateOcrProgress(percent, message) {
    if (this.dom.ocrProgressBar) {
      this.dom.ocrProgressBar.style.width = `${percent}%`;
    }
    if (this.dom.ocrProgressDesc && message) {
      this.dom.ocrProgressDesc.textContent = message;
    }
  }

  async handleOcrInputFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type || !file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, WebP).');
      return;
    }
    await this.processOcrImage(file);
  }

  async handleOcrSample() {
    const sampleCanvas = this.ocr.generateSampleSudokuCanvas();
    await this.processOcrImage(sampleCanvas);
  }

  async processOcrImage(imageSource) {
    if (this.dom.ocrStepUpload) this.dom.ocrStepUpload.classList.add('hidden');
    if (this.dom.ocrStepProcessing) this.dom.ocrStepProcessing.classList.remove('hidden');
    if (this.dom.ocrStepReview) this.dom.ocrStepReview.classList.add('hidden');

    try {
      this.updateOcrProgress(15, 'Cargando y optimizando imagen...');
      const canvas = await this.ocr.loadImageToCanvas(imageSource);

      this.updateOcrProgress(25, 'Detectando cuadrícula y alineando perspectiva...');
      const corners = this.ocr.detectGridCorners(canvas);
      const warped = this.ocr.warpPerspective(canvas, corners, 450);
      this.ocrWarpedCanvas = warped;

      this.updateOcrProgress(35, 'Extrayendo 81 casillas y reconociendo números...');
      const { grid } = await this.ocr.recognizeGrid(warped, (p, msg) => {
        this.updateOcrProgress(p, msg);
      });

      this.ocrGrid = grid;
      this.showOcrReviewStep();
    } catch (e) {
      console.error('Error durante el escaneo OCR:', e);
      alert('Ocurrió un error al procesar la imagen: ' + (e.message || e));
      this.resetOcrModal();
    }
  }

  showOcrReviewStep() {
    if (this.dom.ocrStepUpload) this.dom.ocrStepUpload.classList.add('hidden');
    if (this.dom.ocrStepProcessing) this.dom.ocrStepProcessing.classList.add('hidden');
    if (this.dom.ocrStepReview) this.dom.ocrStepReview.classList.remove('hidden');

    // Dibujar preview de la foto procesada
    if (this.dom.ocrPreviewCanvas && this.ocrWarpedCanvas) {
      this.dom.ocrPreviewCanvas.width = this.ocrWarpedCanvas.width;
      this.dom.ocrPreviewCanvas.height = this.ocrWarpedCanvas.height;
      const ctx = this.dom.ocrPreviewCanvas.getContext('2d');
      ctx.drawImage(this.ocrWarpedCanvas, 0, 0);
    }

    this.ocrSelectedRow = 0;
    this.ocrSelectedCol = 0;
    this.renderOcrReviewBoard();
    this.validateOcrGrid();
  }

  renderOcrReviewBoard() {
    if (!this.dom.ocrGridBoard || !this.ocrGrid) return;
    this.dom.ocrGridBoard.innerHTML = '';

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = this.ocrGrid[r][c];
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.style.fontSize = '14px';
        cell.style.cursor = 'pointer';

        if (r === this.ocrSelectedRow && c === this.ocrSelectedCol) {
          cell.classList.add('selected');
        }

        if (val !== 0) {
          cell.textContent = String(val);
          cell.classList.add('initial');
          if (!this.engine.isValidMove(this.ocrGrid, r, c, val)) {
            cell.classList.add('cell-error');
          }
        }

        cell.addEventListener('click', () => {
          this.ocrSelectedRow = r;
          this.ocrSelectedCol = c;
          this.renderOcrReviewBoard();
        });

        this.dom.ocrGridBoard.appendChild(cell);
      }
    }
  }

  setOcrCellValue(row, col, num) {
    if (!this.ocrGrid) return;
    this.ocrGrid[row][col] = num;
    this.renderOcrReviewBoard();
    this.validateOcrGrid();

    // Auto-avance inteligente al escribir un número
    if (num > 0) {
      if (col < 8) {
        this.ocrSelectedCol = col + 1;
      } else if (row < 8) {
        this.ocrSelectedRow = row + 1;
        this.ocrSelectedCol = 0;
      }
      this.renderOcrReviewBoard();
    }
  }

  validateOcrGrid() {
    if (!this.ocrGrid) return;

    let clues = 0;
    let hasCollisions = false;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = this.ocrGrid[r][c];
        if (val !== 0) {
          clues++;
          if (!this.engine.isValidMove(this.ocrGrid, r, c, val)) {
            hasCollisions = true;
          }
        }
      }
    }

    if (this.dom.ocrCluesCount) {
      this.dom.ocrCluesCount.textContent = `${clues} pistas detectadas`;
    }

    const badge = this.dom.ocrValidationBadge;
    const text = this.dom.ocrValidationText;
    if (!badge || !text) return;

    if (hasCollisions) {
      badge.className = 'px-2.5 py-1 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1';
      text.textContent = '⚠️ Números repetidos en fila/col/caja';
      return;
    }

    if (clues < 17) {
      badge.className = 'px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1';
      text.textContent = `ℹ️ ${clues} pistas (mínimo 17)`;
      return;
    }

    // Resolver con motor de backtracking
    const solveRes = this.engine.solve(this.ocrGrid);
    if (solveRes.solved) {
      badge.className = 'px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1';
      text.textContent = `✅ Solución matemática válida (${clues} pistas)`;
    } else {
      badge.className = 'px-2.5 py-1 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1';
      text.textContent = '❌ Sin solución matemática. Revisa algún número';
    }
  }

  applyOcrGridToBoard(andSave = false) {
    if (!this.ocrGrid) return;

    const res = this.engine.solve(this.ocrGrid);
    if (!res.solved) {
      if (!confirm('Este planteamiento parece no tener solución matemática única. ¿Deseas cargarlo de todos modos?')) {
        return;
      }
    }

    let clues = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.ocrGrid[r][c] !== 0) clues++;
      }
    }

    // Cargar en el tablero
    this.initialGrid = this.engine.cloneGrid(this.ocrGrid);
    this.playGrid = this.engine.cloneGrid(this.ocrGrid);
    this.solutionGrid = res.solved ? this.engine.cloneGrid(res.solution) : null;
    this.mode = 'idle';
    this.showPossibilities = false;

    // Asignar siguiente número libre en colección
    const nextNum = this.storage.getNextNumberForLevel(this.currentLevel);
    this.dom.puzzleNumberInput.value = nextNum;
    this.currentNumber = nextNum;
    this.currentPuzzleId = `ocr_${Date.now()}`;
    this.currentSeed = null;

    if (this.dom.seedInput) this.dom.seedInput.value = 'Foto-OCR';

    this.dom.startDateInput.value = '';
    this.dom.elapsedTimeInput.value = '00:00';

    if (andSave) {
      const name = `Sudoku Escaneado #${nextNum}`;
      this.storage.savePuzzle(this.currentLevel, nextNum, this.initialGrid, name, 'Foto-OCR');
      this.currentPuzzleId = `${this.currentLevel}_${nextNum}`;
      this.dom.puzzleNumberInput.value = this.storage.getNextNumberForLevel(this.currentLevel);
      this.setStatus(`📷 Sudoku escaneado y grabado en colección como "${name}" (${clues} pistas). Pulsa "Iniciar" para resolver.`, 'success');
    } else {
      this.setStatus(`📷 Sudoku importado desde imagen con éxito (${clues} pistas). Pulsa "Iniciar" para jugar o "Posibles" para ver candidatos.`, 'success');
    }

    this.closeOcrModal();
    this.updateBoardDisplay();
  }

}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  window.sudokuApp = new SudokuApp();
});
