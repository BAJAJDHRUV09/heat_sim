# Boundary Layer & Fluid Flow Visualization Suite

A modern, interactive web application for visualizing key concepts in fluid mechanics and linear algebra. This suite includes:
- Boundary layer development
- Pulsatile flow in pipes
- 2D vector field divergence
- Linear transformation in 2D

---

## Quick Start: How to Run the Main App

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd boundary-layer-viz
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the main app (development mode):**
   ```bash
   npm run dev
   ```
   Then open your browser and go to [http://localhost:5173](http://localhost:5173)

4. **Build for production:**
   ```bash
   npm run build
   ```
   The built files will be in the `dist` directory.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Usage](#setup--usage)
- [Visualization Pages](#visualization-pages)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
This project provides a set of interactive visualizations for students and educators in fluid mechanics and linear algebra. Each page is focused on a core concept, with a clean UI and real data or mathematical models.

## Features
- Interactive, real-time visualizations
- Modern, responsive UI
- Data-driven and analytical models
- Modular codebase (React, Vite, Tailwind CSS)
- Per-page documentation for easy onboarding

## Tech Stack
- React (with Vite)
- Tailwind CSS
- JavaScript/TypeScript
- p5.js (for some visualizations)
- Bootstrap (for some legacy/embedded apps)

## Setup & Usage

### 1. Clone the Repository
```bash
git clone <repo-url>
cd boundary-layer-viz
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
- Open your browser and go to [http://localhost:5173](http://localhost:5173)

### 4. Build for Production
```bash
npm run build
```
- The built files will be in the `dist` directory.

### 5. Using Embedded HTML Apps
- Some visualizations (e.g., Linear Transformation, Vector Field Divergence) are embedded as standalone HTML apps via iframes.
- **Important:** These folders (`Linear-Transformation-main`, `divergence-curl-explorer-main`) must be inside the `public/` directory for the iframes to work.
- If you add new HTML apps, place them in `public/` and reference them with a relative path in the iframe.

### 6. Troubleshooting
- If an embedded app or image does not load, ensure its folder is in `public/` and all asset paths are correct.
- If you see errors about missing files, check your folder structure and restart the dev server after moving files.
- For CSV/data-driven pages, ensure your data files are in the correct location (usually `public/`).

## Visualization Pages

### 1. Boundary Layer Analysis
- **Description:** Visualizes boundary layer thickness and velocity profiles using real or synthetic data.
- **Features:** Interactive sliders for viscosity and velocity, real-time plot updates.
- **Docs:** (see this README)

### 2. Pulsatile Flow
- **Description:** Visualizes velocity profiles for pulsatile flow in a pipe for three fluids (Air, Water, Mercury) at 15 time points.
- **Features:** Fluid selector, time slider, snapshot images.
- **Docs:** [`src/pages/PulsatileFlow.md`](src/pages/PulsatileFlow.md)

### 3. Vector Field Divergence
- **Description:** Interactive 2D vector field explorer. Paint your own field, load samples, and visualize divergence at any point.
- **Features:** Paint mode, divergence mode, colored indicators, tooltips.
- **Docs:** [`src/pages/VectorFieldDivergence.md`](src/pages/VectorFieldDivergence.md)

### 4. Linear Transformation
- **Description:** Minimal tool for visualizing the effect of changing the basis in 2D linear algebra.
- **Features:** Input two basis vectors, see the effect in real time. No matrix/vector input or animation controls.
- **Docs:** [`src/pages/LinearTransformation.md`](src/pages/LinearTransformation.md)

## Folder Structure
- `public/` — Static assets, including all snapshot images and embedded HTML apps
- `src/pages/` — React page components and per-page documentation
- `Linear-Transformation-main/`, `divergence-curl-explorer-main/` — Embedded apps for some visualizations

## Contributing
Contributions are welcome! Please:
- Fork the repo and create a feature branch
- Add or update documentation for any new features/pages
- Submit a pull request with a clear description
