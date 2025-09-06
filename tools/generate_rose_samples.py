#!/usr/bin/env python3
"""
Generate the 10 rose-curve sample PNGs using functions from server.py
Writes PNGs to the project's plots/ directory and prints URLs.
"""
import os
import uuid
from server import normalize_expression, generate_cartesian_plot, PLOTS_DIR

SAMPLES = [
    ("rose-1", "r = cos(3*theta)"),
    ("rose-2", "r = sin(3*theta)"),
    ("rose-3", "r = 2*cos(4*theta)"),
    ("rose-4", "r = 1.5*sin(5*theta)"),
    ("rose-5", "r = cos(2*theta)"),
    ("rose-6", "r = 0.8*sin(6*theta)"),
    ("rose-7", "r = 3*cos(1*theta)"),
    ("rose-8", "r = 2*sin(8*theta)"),
    ("rose-9", "r = cos(7*theta)"),
    ("rose-10", "r = 1.2*sin(9*theta)"),
]

os.makedirs(PLOTS_DIR, exist_ok=True)

results = []
for id_, expr in SAMPLES:
    try:
        expr_norm = normalize_expression(expr)
        buf = generate_cartesian_plot(expr_norm)
        filename = f"{id_}-{uuid.uuid4().hex}.png"
        path = os.path.join(PLOTS_DIR, filename)
        with open(path, "wb") as f:
            f.write(buf.getbuffer())
        url = f"/plots/{filename}"
        results.append({"id": id_, "expr": expr, "file": path, "url": url})
        print(f"OK: {id_} -> {path}")
    except Exception as e:
        results.append({"id": id_, "expr": expr, "error": str(e)})
        print(f"ERR: {id_} -> {e}")

print("\nSummary:")
for r in results:
    if "file" in r:
        print(f"{r['id']}: {r['expr']} -> {r['url']}")
    else:
        print(f"{r['id']}: {r['expr']} -> ERROR: {r['error']}")
