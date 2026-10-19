# Top-Sudoku — Escuela y Solucionador Lógico de Sudoku

Aplicación interactiva y pedagógica de Sudoku diseñada para enseñar resolución lógica deductiva mediante visualización de candidatos en tiempo real y descarte sistemático.

> **Origen del proyecto**: Reescritura y modernización completa de una herramienta original desarrollada hace más de 20 años en **Visual FoxPro** por Guillermo Tudela Soler. Esta versión traslada la velocidad operativa y el rigor lógico de escritorio a una arquitectura web y móvil moderna (PWA) de cero dependencias en servidor.

- **Demo en vivo (Web / PWA)**: [https://guitusol.github.io/top-sudoku/](https://guitusol.github.io/top-sudoku/)
- **Política de Privacidad (Tiendas)**: [https://guitusol.github.io/top-sudoku/privacidad.html](https://guitusol.github.io/top-sudoku/privacidad.html)

---

## 🎯 Características y Flujo Funcional

1. **Tablero Dual (9x9 gemelos)**:
   - **Izquierda**: Tablero interactivo de planteamiento y juego.
   - **Derecha**: «POSIBILIDADES POR CUADRO» (reflejo en espejo y asistente de resolución).
2. **Cálculo de Candidatos en Tiempo Real (*Posibles*)**:
   - Calcula al vuelo qué números [1..9] son matemáticamente válidos en cada casilla vacía según las restricciones de fila, columna y submatriz 3x3.
   - **Detección de Candidato Único (*Naked Single*)**: Resalta en color dorado/amarillo las casillas donde solo cabe un número, permitiendo al usuario aprender la técnica de descarte sin tanteo a ciegas.
3. **Validación en Caliente**:
   - Rechaza inmediatamente jugadas ilegales que colisionen con las reglas del tablero, evitando arrastrar errores.
4. **Banco de Planteamientos y Búsqueda**:
   - Clasificación en 4 niveles de dificultad: **Fácil**, **Medio**, **Difícil** y **Endemoniado**.
   - Filtros de búsqueda entre sudokus resueltos y no resueltos con seguimiento de mejores tiempos récord.
5. **Ergonomía Adaptable**:
   - **En PC / Portátil**: Barra táctil oculta; navegación pura por teclado (flechas $\leftarrow \uparrow \downarrow \rightarrow$, números 1-9) y auto-avance inteligente a la siguiente casilla vacía al colocar un número válido.
   - **En Móviles / Tablets**: Teclado táctil en pantalla con flechas de desplazamiento manual y pestañas rápidas (`🎮 Tablero` / `🔍 Posibilidades`).

---

## 🧱 Estructura del Código

El proyecto no tiene dependencias complejas de servidor (no requiere backend PHP/Node ni base de datos externa; todo corre en el cliente):

```text
top-sudoku/
├── index.html              # Vista principal, modales y layouts responsivos
├── manifest.json           # Configuración PWA para instalación web
├── privacidad.html         # Política de privacidad requerida para Google Play y App Store
├── css/
│   └── styles.css          # Estilos del tablero 9x9, reloj analógico y estados visuales
├── js/
│   ├── sudoku-engine.js    # Motor matemático: candidatos, validador y solver MRV Backtracking
│   ├── sudoku-storage.js   # Persistencia en LocalStorage con colección precargada
│   └── app.js              # Controlador principal, cronómetro, auto-avance y eventos
└── icons/
    ├── icon-192.svg        # Icono PWA / App 192px
    └── icon-512.svg        # Icono PWA / App 512px
```

---

## 📱 Guía para Empaquetar y Publicar en App Store y Google Play (Capacitor)

Para el desarrollador que va a compilar y subir la aplicación a las tiendas oficiales (Google Play y Apple App Store), la forma más rápida y estándar es usar **Capacitor**:

### 1. Inicialización en el proyecto local

```bash
# 1. Instalar dependencias de Capacitor
npm init -y
npm install @capacitor/core @capacitor/cli

# 2. Inicializar configuración (apuntando al directorio raíz web)
npx cap init "Top-Sudoku" "com.topsudoku.app" --web-dir "."

# 3. Añadir plataformas nativas
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios

# 4. Sincronizar ficheros web con los proyectos nativos
npx cap sync
```

### 2. Compilar para Android (Google Play)

```bash
# Abre el proyecto en Android Studio
npx cap open android
```
- Desde **Android Studio**: `Build > Generate Signed Bundle / APK` seleccionando **Android App Bundle (.aab)**.
- Subir el archivo `.aab` a **Google Play Console**.

### 3. Compilar para iOS (Apple App Store)

*Nota: Requiere macOS con Xcode instalado.*

```bash
# Abre el proyecto en Xcode
npx cap open ios
```
- En **Xcode**: Seleccionar el equipo de desarrollo (*Signing & Capabilities*), versión y número de compilación.
- Menú: `Product > Archive` y pulsar **Distribute App** para subirlo directamente a **App Store Connect / TestFlight**.

---

## 📋 Datos Requeridos para la Ficha de las Tiendas

- **Nombre sugerido**: Top-Sudoku: Aprende y Resuelve
- **Bundle ID**: `com.topsudoku.app`
- **Categoría**: Juegos / Puzles / Lógica / Mesa
- **Clasificación por edades**: Apta para todos los públicos (PEGI 3 / 4+)
- **Anuncios / Compras integradas**: Ninguna (juego 100% limpio y sin publicidad)
- **URL de Política de Privacidad (Obligatoria)**:
  `https://guitusol.github.io/top-sudoku/privacidad.html`
- **Recopilación de datos**: 0 datos recopilados (todo se almacena localmente en el dispositivo del usuario).
