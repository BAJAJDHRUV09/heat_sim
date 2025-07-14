# Vector Field Divergence Explorer

This page provides an interactive 2D vector field divergence explorer.

## Features
- Paint your own vector fields or load sample fields (source, sink, rotation, etc.).
- Visualize divergence at any point with colored indicators and tooltips.
- Responsive, modern UI with clear instructions.
- All features are provided by the embedded divergence-curl-explorer-main app.

## Usage
- Use the controls to select a mode (paint or show divergence).
- Paint vectors or load a sample field.
- Hover to see divergence at any point.

## Implementation
- This page is implemented as a React wrapper that displays the divergence-curl-explorer-main/index.html app in an iframe.
- All logic and UI are handled by the embedded app. 