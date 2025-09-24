
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// Parse rose curve equation like r=1*sin(4θ)
function parseRoseCurve(expr) {
  const match = expr.match(/r\s*=\s*([0-9.]+)\s*\*\s*sin\(\s*([0-9]+)θ\s*\)/i);
  if (!match) return null;
  return { type: "rose", a: parseFloat(match[1]), k: parseInt(match[2]) };
}

// Parse cardioid equation like r=1+sin(θ) or r=2*(1+cos(θ))
function parseCardioid(expr) {
  // r = a*(1+sinθ)
  let match = expr.match(/r\s*=\s*([0-9.]+)\s*\*\s*\(\s*1\s*\+\s*sin\(\s*θ\s*\)\s*\)/i);
  if (match) return { type: "cardioid", a: parseFloat(match[1]), trig: "sin", form: "mul" };

  // r = a*(1+cosθ)
  match = expr.match(/r\s*=\s*([0-9.]+)\s*\*\s*\(\s*1\s*\+\s*cos\(\s*θ\s*\)\s*\)/i);
  if (match) return { type: "cardioid", a: parseFloat(match[1]), trig: "cos", form: "mul" };

  // r = a + b*sinθ
  match = expr.match(/r\s*=\s*([0-9.]+)\s*\+\s*([0-9.]+)\s*\*\s*sin\(\s*θ\s*\)/i);
  if (match) return { type: "cardioid", a: parseFloat(match[1]), b: parseFloat(match[2]), trig: "sin", form: "add" };

  // r = a + b*cosθ
  match = expr.match(/r\s*=\s*([0-9.]+)\s*\+\s*([0-9.]+)\s*\*\s*cos\(\s*θ\s*\)/i);
  if (match) return { type: "cardioid", a: parseFloat(match[1]), b: parseFloat(match[2]), trig: "cos", form: "add" };

  // r=1+sin(θ)
  match = expr.match(/r\s*=\s*([0-9.]+)\s*\+\s*sin\(\s*θ\s*\)/i);
  if (match) return { type: "cardioid", a: parseFloat(match[1]), b: 1, trig: "sin", form: "add" };

  // r=1+cos(θ)
  match = expr.match(/r\s*=\s*([0-9.]+)\s*\+\s*cos\(\s*θ\s*\)/i);
  if (match) return { type: "cardioid", a: parseFloat(match[1]), b: 1, trig: "cos", form: "add" };

  return null;
}

export default function ThreeDModel({ expr }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!expr) return;

    let curveType = null;
    let params = null;

    // Try rose curve first
    const rose = parseRoseCurve(expr);
    if (rose) {
      curveType = "rose";
      params = rose;
    } else {
      // Try cardioid
      const cardioid = parseCardioid(expr);
      if (cardioid) {
        curveType = "cardioid";
        params = cardioid;
      }
    }

    if (!curveType) return;

    // Generate points
    const points = [];
    for (let i = 0; i <= 1000; i++) {
      const theta = (i / 1000) * 2 * Math.PI;
      let r, x, y;
      if (curveType === "rose") {
        r = params.a * Math.sin(params.k * theta);
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
      } else if (curveType === "cardioid") {
        if (params.form === "mul") {
          // r = a(1 + trigθ)
          r = params.a * (1 + (params.trig === "sin" ? Math.sin(theta) : Math.cos(theta)));
        } else {
          // r = a + b*trigθ
          r = params.a + params.b * (params.trig === "sin" ? Math.sin(theta) : Math.cos(theta));
        }
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
      }
      points.push(new THREE.Vector3(x, y, 0));
    }

    // Create tube geometry along the curve
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 400, 0.05, 16, false);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000'); // Set background to black
    scene.add(mesh);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
  camera.position.z = 4;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 800);

    // Mount renderer
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Animation loop
    let frameId;
    const animate = () => {
      mesh.rotation.z += 0.01;
      mesh.rotation.x += 0.005;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [expr]);

  return <div ref={mountRef} style={{ width: 800, height: 800 }} />;
}
