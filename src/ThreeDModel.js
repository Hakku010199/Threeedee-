import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// Parse rose curve equation like r=1*sin(4θ)
function parseRoseCurve(expr) {
  const match = expr.match(/r\s*=\s*([0-9.]+)\s*\*\s*sin\(\s*([0-9]+)θ\s*\)/i);
  if (!match) return { a: 1, k: 1 };
  return { a: parseFloat(match[1]), k: parseInt(match[2]) };
}

export default function ThreeDModel({ expr }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!expr) return;

    const { a, k } = parseRoseCurve(expr);

    // Generate rose curve points
    const points = [];
    for (let i = 0; i <= 1000; i++) {
      const theta = (i / 1000) * 2 * Math.PI;
      const r = a * Math.sin(k * theta);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      points.push(new THREE.Vector3(x, y, 0));
    }

    // Create tube geometry along the curve
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 200, 0.05, 16, false);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    // Scene setup
    const scene = new THREE.Scene();
    scene.add(mesh);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(400, 400);

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

  return <div ref={mountRef} style={{ width: 400, height: 400 }} />;
}
