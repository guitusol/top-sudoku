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

### 3.1. Tablero Espejo (Pantalla Derecha)
Conforme colocas un número en el tablero de juego (izquierdo), el tablero derecho **actualiza instantáneamente los candidatos** de todas las celdas afectadas, tachando las opciones que ya no son posibles.

### 3.2. 🌟 Nueva Opción: Superponer Posibles en la Pantalla de Solución
Además de consultar el tablero espejo derecho, Top-Sudoku incorpora una potente opción pedagógica: **superponer los candidatos calculados directamente dentro de las propias casillas vacías del tablero principal de juego**.
- **Cómo activarlo**: Puedes alternar esta opción en cualquier momento mediante:
  1. El botón de acceso rápido en la cabecera del tablero: `[🔍 Superponer posibles]`.
  2. La casilla de verificación en el panel de opciones: `[x] Superponer posibles en pantalla de solución`.
  3. Tu preferencia se guarda automáticamente en memoria (`localStorage`) para recordarla en tus siguientes partidas.
- **Resolver y ver posibilidades simultáneamente**: Mientras juegas y resuelves, las casillas vacías muestran en tiempo real y en formato compacto todos los números válidos para esa celda.
- **Candidato Único (*Naked Single*)**: Cuando en una casilla vacía solo cabe un único número posible, se resalta automáticamente en **color amarillo / ámbar dorado** con el número en grande. ¡Es una certeza matemática sin riesgo de error!
- **Colocación con un solo clic**: Puedes pulsar directamente con el ratón o el dedo sobre cualquiera de los números candidatos superpuestos en la casilla para colocarlo inmediatamente, o bien teclearlo.
- **Recálculo reactivo en vivo**: Al colocar un número, las posibilidades de todas las casillas vacías de su fila, columna y submatriz 3x3 se recalculan y actualizan al vuelo.

---

## 4. Validación en Caliente contra Errores

Top-Sudoku incorpora un validador en tiempo real según el criterio seleccionado en el panel:
- **Resultado final (Solución única)**: Comprueba el número contra la solución matemática definitiva del sudoku. Si no coincide, lo rechaza de inmediato con parpadeo rojo, evitando callejones sin salida tardíos (*deadlocks*).
- **Situación actual (Reglas clásicas)**: Permite ensayo y deducción libre, comprobando únicamente si el número colisiona con fila, columna o caja 3x3 presentes.

---

## 5. Controles y Modos de Juego (PC y Móvil)

### ⚡ Auto-Inicio Transparente de Partida
No es obligatorio pulsar previamente el botón verde "iniciar": al hacer clic en cualquier casilla vacía y teclear o pulsar un número (del 1 al 9), el sistema auto-inicia automáticamente la partida, arranca el cronómetro y registra la hora de inicio de forma inmediata.

### 💻 En Ordenador (PC / Portátil)
- **Navegación por casillas**: Clic con el ratón o con las **Flechas del teclado** (← ↑ ↓ →).
- **Colocar un número**: Pulsa las teclas numéricas del **1 al 9** (teclado alfanumérico o teclado numérico NumPad), o pulsa directamente los botones del teclado en pantalla bajo la cuadrícula.
- **Auto-avance inteligente**: Al colocar un número válido, el cursor avanza automáticamente a la siguiente casilla vacía para agilizar la resolución.
- **Borrar**: Tecla **Supr**, **Retroceso**, el **0** o el botón "Borrar" del teclado inferior.

### 📱 En Smartphone o Tablet
- En pantallas móviles estrechas, la interfaz conmuta a un cómodo selector de pestañas superiores:
  - Pestaña **🎮 Tablero de Juego**: Muestra el tablero para rellenar con el teclado táctil en pantalla y la opción de superponer posibles activa.
  - Pestaña **🔍 Posibilidades por Cuadro**: Te permite consultar el mapa analítico completo de candidatos en espejo con un solo toque.

---

## 6. La Botonera de Acciones (Estilo FoxPro Clásico)

Debajo del tablero izquierdo se encuentra el panel de mando operativo:

| Botón | Función |
| :--- | :--- |
| **`plantear`** | Activa el modo de diseño para copiar un sudoku desde un periódico, revista o libro. |
| **`grabar`** | Guarda el sudoku actual en tu banco de datos local bajo el nivel y número seleccionados. |
| **`buscar`** | Abre la ventana de búsqueda con filtros (todos, no resueltos, resueltos) y récords de tiempo. |
| **`iniciar`** | Arranca formalmente el cronómetro y prepara el tablero (también se auto-inicia al teclear el primer número). |
| **`posibles`** | Conmuta el cálculo y despliegue del tablero espejo de posibilidades de la derecha. |
| **`resolver`** | La máquina resuelve automáticamente el sudoku completo mediante el algoritmo de Backtracking. |
| **`reiniciar`** | Restaura la partida a su planteamiento inicial limpio y pone el cronómetro a cero. |
| **`cancelar`** | Cancela los cambios o el planteamiento y devuelve la aplicación al estado de reposo inicial. |
| **`cerrar` / `🚪 Salir`** | Solicita confirmación si hay jugadas activas, detiene el cronómetro y cierra la aplicación o despliega la pantalla completa de salida limpia (*exit-screen*). |

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


---

## 8. Generador Universal por Semilla

Además de los sudokus precargados en la colección, puedes **proponer cualquier semilla matemática** (número o palabra) para generar un Sudoku único con solución garantizada:
- **Proponer una semilla**: Escribe tu número o texto en la casilla `🌱 Semilla` y pulsa **Cargar** (o presiona Intro).
- **Botón Aleatorio (🎲)**: Genera una nueva semilla al azar.
- **Compartir el mismo Sudoku**: La URL se sincroniza automáticamente (ej. `?semilla=40837&nivel=facil`). Comparte el enlace con tus amigos para retarse sobre el mismo tablero.

---

### Créditos y Dedicatoria

**Desarrollado por Guillermo Tudela**  
*Director de CONECTIVIDAD Y COMUNICACIONES, S. L.*  
*Esta APP está dedicada a mi familia, amigos y a todos los apasionados por los Rompecabezas y Sudokus.*
