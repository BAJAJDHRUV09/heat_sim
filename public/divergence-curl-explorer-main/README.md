# 2D Vector Field Divergence Explorer

This project is an interactive web-based tool designed to help visualize 2D vector fields and understand the concept of divergence. Users can draw their own vector fields or load pre-defined examples to see how divergence is calculated and represented.

## Features

*   **Interactive Canvas:** Paint vector fields directly onto a grid.
*   **Sample Vector Fields:** Load and explore predefined fields:
    *   Source
    *   Sink
    *   Source & Sink combination
    *   Uniform field
    *   Rotation field (demonstrating zero divergence)
*   **Divergence Visualization:** Switch to "Show Divergence" mode to:
    *   See a color-coded overlay indicating the strength and sign of divergence at each point.
        *   <span style="color: red; font-weight:bold;">Red</span> for positive divergence (source).
        *   <span style="color: blue; font-weight:bold;">Blue</span> for negative divergence (sink).
        *   <span style="color: green; font-weight:bold;">Green</span>/Gray for near-zero divergence.
    *   View the precise calculated divergence value in a tooltip on mouseover.
*   **Clear Canvas:** Easily reset the vector field.
*   **Responsive Design:** The interface adapts to different screen sizes.

## Screenshots

**Source Field Example:**
*(Vectors radiating outwards from a central point)*
![Source Field](source.png)

**Rotational Field Example:**
*(Vectors exhibiting a rotational pattern around the center)*
![Rotational Field](rotation.png)

**Sink Field Example:**
*(Vectors converging inwards to a central point)*
![Sink Field](sink.png)

## How to Use

1.  **Open `index.html` in a web browser.**
2.  **Select a Mode:**
    *   **Paint Vectors:** Click and drag on any cell in the grid to define a vector. The vector starts at the center of the cell and its direction/magnitude are determined by your drag.
    *   **Show Divergence:** Move your mouse cursor over the grid. A colored circle and a tooltip will display the calculated divergence at the cursor's location.
3.  **Explore Samples:** Click the buttons under "Sample Vector Fields" to load predefined patterns (Source, Sink, Rotation, etc.).
4.  **Clear Field:** Click the "Clear Field" button to reset all vectors on the grid to zero.

## Technical Details

The divergence of a 2D vector field F = (P(x,y), Q(x,y)) is a scalar quantity defined as:
div F = ∂P/∂x + ∂Q/∂y
This application calculates an approximation of the divergence at each grid cell by using a central difference method based on the vector components (vx, vy) of its neighboring cells. 