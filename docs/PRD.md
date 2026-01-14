# Product Requirements Document (PRD): Complex Coordinate Graphing Calculator

## 1. Project Overview
**Project Name:** Complex Coordinate
**Goal:** Create a web-based graphing calculator specialized for complex numbers. The application will allow users to input complex number formulas, visualize them on a 2D plane, and interact with variables dynamically.
**Target Audience:** Students, educators, and mathematics enthusiasts learning or teaching complex analysis.

## 2. Core Features & Functional Requirements

### 2.1. User Interface (UI)
*   **Layout:** A split-screen design similar to Desmos.
    *   **Left Panel (Sidebar):** For inputting mathematical formulas and variable definitions.
    *   **Right Panel (Canvas):** A large, interactive graphing area displaying the complex plane.
*   **Responsive Design:** Usable on desktop and tablet devices.

### 2.2. Formula Input (Left Panel)
*   **Math Input:**
    *   Support for parsing complex number expressions (e.g., `z = x + iy`, `f(z) = z^2 + 1`).
    *   Syntax highlighting or formatted math rendering (e.g., LaTeX style) for readability.
    *   Error handling for invalid syntax (visual feedback).
*   **Variable Management:**
    *   Ability to define constants and variables (e.g., `a = 2`).
    *   **Sliders:** Automatically generate sliders for defined numeric variables to allow real-time adjustment.
    *   **Animation:** Option to auto-play sliders to animate the graph.

### 2.3. Graphing Visualization (Right Panel)
*   **Complex Plane Rendering:**
    *   Standard viewing window showing the Real (horizontal) and Imaginary (vertical) axes.
    *   Grid lines and axis labels.
    *   Pan (drag) and Zoom (scroll/pinch) functionality.
*   **Plotting Capabilities:**
    *   Visualize points, geometric shapes, or loci defined by the input formulas.
    *   Real-time re-rendering when variables change via sliders.
*   **Coordinate System Conversion:**
    *   **Toggle Switch:** A feature to switch the view/labels between:
        *   **Complex Plane:** Axes labeled Real (Re) and Imaginary (Im).
        *   **Cartesian Plane:** Axes labeled X and Y.
    *   Visual representation should adapt to the selected mode (e.g., interpreting input as vectors or standard coordinate pairs if applicable).

### 2.4. Interactivity
*   **Hover Effects:** Display coordinate values or specific complex number properties (modulus, argument) when hovering over points/graphs.
*   **Undo/Redo:** (Nice to have) Basic history navigation for inputs.

## 3. Technical Requirements

### 3.1. Tech Stack
*   **Framework:** Next.js (React)
*   **Language:** TypeScript
*   **Styling:** CSS Modules or Tailwind CSS (adhering to `globals.css`)
*   **Math Parsing:** `mathjs` or similar library for evaluating expressions.
*   **Graphing Engine:** HTML5 Canvas API, SVG (D3.js), or a specialized plotting library (e.g., `function-plot`, `p5.js`, or `mafs`) capable of high-performance rendering.

### 3.2. Performance
*   Graph rendering must be optimized to handle real-time updates from sliders (60fps target for smooth animation).

## 4. User Flow
1.  **Landing:** User opens the website and sees a blank grid on the right and an empty input line on the left.
2.  **Input:** User types a formula, e.g., `z = 1 + 2i`. A point appears on the graph at (1, 2).
3.  **Variable:** User types `k = 1`. A slider appears below the text box.
4.  **Dynamic Graphing:** User modifies the formula to `z = k + 2i`.
5.  **Interaction:** User drags the slider for `k`. The point moves horizontally on the graph in real-time.
6.  **Conversion:** User clicks "XY Mode". The axes labels change to X/Y.

## 5. Design Assets
*   **Reference:** See `docs/image.png` for layout inspiration (Desmos-like style).
