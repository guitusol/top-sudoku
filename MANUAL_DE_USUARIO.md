# 📖 Manual del Usuario — Top-Sudoku
### Escuela y Solucionador Lógico de Sudoku

Bienvenido al manual oficial de **Top-Sudoku**, una aplicación interactiva concebida para aprender y disfrutar del sudoku mediante el descarte sistemático y la deducción matemática en tiempo real, sin recurrir jamás a la adivinación o al tanteo a ciegas.

---

## 📑 Índice de Contenidos
1. [Historia y Filosofía del Proyecto](#1-historia-y-filosofía-del-proyecto)
2. [El Tablero Dual (Los Dos Tableros Gemelos)](#2-el-tablero-dual-los-dos-tableros-gemelos)
3. [El Secreto Pedagógico: Posibilidades por Cuadro y Candidato Único](#3-el-secreto-pedagógico-posibilidades-por-cuadro-y-candidato-único)
4. [Validación en Caliente contra Errores](#4-validación-en-caliente-contra-errores)
5. [Controles y Modos de Juego (PC y Móvil)](#5-controles-y-modos-de-juego-pc-y-móvil)
6. [La Botonera de Acciones (Estilo FoxPro Clásico)](#6-la-botonera-de-acciones-estilo-foxpro-clásico)
7. [Banco de Sudokus y Buscador con Tiempos Récord](#7-banco-de-sudokus-y-buscador-con-tiempos-récord)
8. [Cómo Introducir tus Propios Sudokus (Modo Plantear)](#8-cómo-introducir-tus-propios-sudokus-modo-plantear)
9. [Resolución Automática por el Sistema (Solver MRV)](#9-resolución-automática-por-el-sistema-solver-mrv)

---

## 1. Historia y Filosofía del Proyecto

Top-Sudoku nació originalmente hace más de 20 años como una herramienta de escritorio desarrollada en **Visual FoxPro** por **Guillermo Tudela Soler**. Su propósito no era simplemente crear otro juego de pasatiempos, sino construir una **auténtica escuela de lógica** que permitiera al jugador comprender *por qué* un número debe ir en una casilla determinada.

Esta versión modernizada traslada aquella precisión y velocidad operativa a la web moderna y a los dispositivos móviles (PWA):
- **Cero dependencias externas**: Funciona al 100% de manera local y desconectada (*offline*).
- **Cero publicidad y máxima privacidad**: No recopila ningún dato personal ni muestra anuncios.
- **Rigor analítico**: Sin conjeturas arbitrarias. Cada jugada está respaldada por las leyes matemáticas del sudoku.

---

## 2. El Tablero Dual (Los Dos Tableros Gemelos)

La pantalla principal de Top-Sudoku presenta una arquitectura única de **dos tableros 9x9 sincronizados en espejo**:

```text
┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│     TABLERO DE JUEGO            │     │    POSIBILIDADES POR CUADRO     │
│   (Planteamiento y Resolución)  │ ◄─► │     (Asistente y Escuela)       │
│                                 │     │                                 │
│  Aquí colocas tus números       │     │  Calcula en tiempo real qué     │
│  [1..9] con teclado o ratón     │     │  números caben en cada celda    │
└─────────────────────────────────┘     └─────────────────────────────────┘
```

- **Tablero Izquierdo (Planteamiento y Juego)**: Es tu cuadrícula de juego. Contiene las pistas iniciales fijas (números en azul/negro fuerte) y las casillas que vas rellenando conforme avanzas en la partida.
- **Tablero Derecho («POSIBILIDADES POR CUADRO»)**: Es el cerebro analítico del sistema. En lugar de números grandes, muestra una pequeña matriz de 3x3 dentro de cada celda con **todos los números que matemáticamente pueden colocarse** sin incumplir las reglas de fila, columna y submatriz 3x3.

---

## 3. El Secreto Pedagógico: Posibilidades por Cuadro y Candidato Único

### ¿Cómo te ayuda a pensar el tablero de Posibilidades?
Conforme colocas un número en el tablero izquierdo, el tablero derecho **actualiza instantáneamente los candidatos** de todas las celdas afectadas, tachando mentalmente las opciones que ya no son posibles.

### La Detección de Candidato Único (*Naked Single*)
Esta es la técnica fundamental de la escuela Top-Sudoku:
- Cuando en una casilla del tablero derecho **solo queda un único número posible**, esa celda se resalta automáticamente en **color amarillo / dorado resplandeciente**.
- **Regla de oro**: Si una casilla solo tiene un candidato posible, **ese número es una certeza matemática**. Colócalo en el tablero izquierdo sin miedo, porque no existe ninguna otra opción válida.

Al colocar ese número, verás cómo se desbloquean nuevas casillas doradas en cadena por todo el tablero, enseñándote a resolver sudokus complejos por simple descarte lógico.

---

## 4. Validación en Caliente contra Errores

Top-Sudoku incorpora un validador en tiempo real:
- Si intentas colocar un número que ya existe en la misma fila, columna o cuadrante 3x3, **el sistema rechaza la jugada de inmediato** emitiendo una alerta visual.
- Esto te impide arrastrar errores durante media hora para descubrir al final que el sudoku no cuadra.

---

## 5. Controles y Modos de Juego (PC y Móvil)

### 💻 En Ordenador (PC / Portátil)
- **Navegación por casillas**: Clic con el ratón o con las **Flechas del teclado** (← ↑ ↓ →).
- **Colocar un número**: Pulsa las teclas numéricas del **1 al 9**.
- **Auto-avance inteligente**: Al colocar un número válido, el cursor avanza automáticamente a la siguiente casilla vacía para agilizar la mecanización.
- **Borrar**: Tecla **Supr**, **Retroceso** o la barra espaciadora.

### 📱 En Smartphone o Tablet
- En pantallas móviles estrechas, la interfaz conmuta a un cómodo selector de pestañas superiores:
  - Pestaña **🎮 Tablero de Juego**: Muestra el tablero para rellenar con el teclado táctil en pantalla.
  - Pestaña **🔍 Posibilidades por Cuadro**: Te permite consultar el mapa completo de candidatos y casillas doradas con un solo toque.

---

## 6. La Botonera de Acciones (Estilo FoxPro Clásico)

Debajo del tablero izquierdo se encuentra el panel de mando operativo:

| Botón | Función |
| :--- | :--- |
| **`plantear`** | Activa el modo de diseño para copiar un sudoku desde un periódico, revista o libro. |
| **`grabar`** | Guarda el sudoku actual en tu banco de datos local bajo el nivel y número seleccionados. |
| **`buscar`** | Abre la ventana de búsqueda con filtros (todos, no resueltos, resueltos) y récords de tiempo. |
| **`limpiar`** | Borra todos los números colocados por ti, dejando el sudoku en su estado inicial para empezar de cero. |
| **`resolver`** | La máquina resuelve automáticamente el sudoku completo mediante el algoritmo de Backtracking. |

---

## 7. Banco de Sudokus y Buscador con Tiempos Récord

Top-Sudoku viene con un banco de planteamientos precargados organizados en **4 niveles de dificultad**:
- 🟢 **Fácil**: Ideal para aprender a usar las posibilidades y el descarte de candidato único.
- 🟡 **Medio**: Requiere combinar candidatos únicos con deducciones de fila y columna.
- 🔴 **Difícil**: Mayor número de casillas vacías y combinaciones cruzadas.
- 🟣 **Endemoniado**: Planteamientos extremos para maestros del sudoku.

### El Buscador:
Pulsando el botón **`buscar`**, se despliega una ventana donde puedes:
- Filtrar por sudokus **Resueltos** o **No Resueltos**.
- Consultar la fecha de resolución y el **mejor tiempo récord** obtenido.
- Seleccionar y cargar cualquier sudoku con un solo clic.

---

## 8. Cómo Introducir tus Propios Sudokus (Modo Plantear)

Si tienes un sudoku en un periódico, revista o libro y quieres resolverlo o guardarlo:
1. Pulsa el botón **`plantear`**. El estado cambiará a *"Planteando"*.
2. Haz clic en las casillas e introduce los números iniciales con el teclado.
3. Elige el **Nivel** (fácil, medio, difícil o endemoniado) y asígnale un **Número** en la casilla correspondiente.
4. Pulsa **`grabar`**. El sistema validará que tenga solución única y lo guardará permanentemente en tu navegador.
5. Pulsa de nuevo **`plantear`** para salir del modo de edición y empezar a jugar.

---

## 9. Resolución Automática por el Sistema (Solver MRV)

Si te encuentras bloqueado o deseas comprobar si un sudoku propio tiene solución:
- Pulsa el botón **`resolver`**.
- El motor ejecutará su algoritmo de resolución matemática (*Minimum Remaining Values Backtracking*).
- El tablero se completará en milisegundos con la solución matemática exacta.

---

*Top-Sudoku © 2026. Diseñado y desarrollado por Guillermo Tudela Soler / Conectividad y Comunicaciones, S.L.*
