# Rose Curves — Examples & Notes

A rose curve is a polar curve with general forms:

- `r = a * cos(k * θ)`  
- `r = a * sin(k * θ)`

Where:
- `a` is the amplitude (petal length).
- `k` controls the number of petals:
  - If `k` is odd → the curve has `k` petals.
  - If `k` is even → the curve has `2k` petals.
- Use variable name `theta` (or `θ`) when sending to parsers; many backends normalize `θ` → `theta`.

Below are 10 example rose curves with key features to help generate corresponding 2D graphs.

---

## 1) r = cos(3·theta)
- General form: `r = a * cos(k * theta)` with `a = 1`, `k = 3`.
- Features:
  - Odd `k` → 3 petals.
  - `cos` version symmetric about the x-axis.
  - Complete pattern over `0 → 2π`.

## 2) r = sin(3·theta)
- General form: `r = a * sin(k * theta)` with `a = 1`, `k = 3`.
- Features:
  - 3 petals (odd `k`).
  - `sin` version rotated relative to `cos` (petals shifted by π/(2k)).
  - Useful for verifying orientation differences.

## 3) r = 2 * cos(4·theta)
- General form: `r = a * cos(k * theta)` with `a = 2`, `k = 4`.
- Features:
  - Even `k` → `2k = 8` petals.
  - Amplitude 2 → petals extend to radius 2.
  - Denser petal distribution; requires higher sampling resolution.

## 4) r = 1.5 * sin(5·theta)
- General form: `r = a * sin(k * theta)` with `a = 1.5`, `k = 5`.
- Features:
  - Odd `k` → 5 petals.
  - Slightly larger petals due to `a = 1.5`.
  - Petal axes rotated relative to `cos` examples.

## 5) r = cos(2·theta)
- General form: `r = a * cos(k * theta)` with `a = 1`, `k = 2`.
- Features:
  - Even `k` → `2k = 4` petals.
  - a = 1 (unit petals).
  - `cos(2θ)` symmetric about x-axis; produces a 4-petal rose.
  - Shows even-k behavior: petal count doubles.

## 6) r = 0.8 * sin(6·theta)
- General form: `r = a * sin(k * theta)` with `a = 0.8`, `k = 6`.
- Features:
  - Even `k` → `2k = 12` petals.
  - Amplitude a = 0.8 (smaller petals).
  - High petal count — increase sample resolution when plotting.

## 7) r = 3 * cos(1·theta)
- General form: `r = a * cos(k * theta)` with `a = 3`, `k = 1`.
- Features:
  - k = 1 (odd) → 1 petal (single-loop).
  - Amplitude a = 3 → long single petal reaching radius 3.
  - `cos(θ)` gives symmetry about x-axis; appears as a single-off-centered loop.
  - Useful to test scaling behavior when a is large.

## 8) r = 2 * sin(8·theta)
- General form: `r = a * sin(k * theta)` with `a = 2`, `k = 8`.
- Features:
  - k = 8 (even) → 2k = 16 petals.
  - a = 2 yields many small petals reaching radius 2.
  - High k produces dense, fine structure; plotting needs more samples to render smoothly.

## 9) r = cos(7·theta)
- General form: `r = a * cos(k * theta)` with `a = 1`, `k = 7`.
- Features:
  - k = 7 (odd) → 7 petals.
  - Unit amplitude; distinct 7-petal rose.
  - Odd k → number of petals equals k; petals alternate around circle.
  - Great to test parity rules and visual symmetry.

## 10) r = 1.2 * sin(9·theta)
- General form: `r = a * sin(k * theta)` with `a = 1.2`, `k = 9`.
- Features:
  - k = 9 (odd) → 9 petals.
  - a = 1.2 slightly larger petals.
  - High odd k provides many petals but not doubled (contrast to even k).
  - Use as a stress-test for rendering and sampling resolution.

---

### Plotting Tips
- Sample `theta` densely (e.g., 2000–8000 samples) for high `k` or large `a`.
- Use range `0 → 2π` for typical roses; for some curves longer ranges (multiple revolutions) may be useful.
- Handle negative `r` values: conversion `x = r*cos(theta)`, `y = r*sin(theta)` already covers sign.
- Ensure parser accepts `theta` variable and common functions (`sin`, `cos`, `tan`, `sqrt`, `exp`, `pi`).
- For server-side rendering with SymPy/NumPy/Matplotlib, normalize input:
  - Replace `θ` with `theta`, `^` → `**`, remove spaces, and prepend `r=` if needed.

You can reference these examples when testing the plotting endpoint or rendering client-side.
