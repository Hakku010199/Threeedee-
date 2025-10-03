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

// Parse Archimedean spiral equation like r = a + b*θ
function parseArchimedeanSpiral(expr) {
  console.log('parseArchimedeanSpiral called with:', expr);
  
  // r = a + b*θ (with explicit multiplication)
  let match = expr.match(/r\s*=\s*([0-9.]+)\s*\+\s*([0-9.]+)\s*\*\s*θ/i);
  if (match) {
    console.log('Matched pattern 1 (θ with *):', match);
    return { type: "spiral", a: parseFloat(match[1]), b: parseFloat(match[2]) };
  }

  // r = a + b*theta (word form with explicit multiplication)
  match = expr.match(/r\s*=\s*([0-9.]+)\s*\+\s*([0-9.]+)\s*\*\s*theta/i);
  if (match) {
    console.log('Matched pattern 2 (theta with *):', match);
    return { type: "spiral", a: parseFloat(match[1]), b: parseFloat(match[2]) };
  }

  // r = a + bθ (without explicit multiplication)
  match = expr.match(/r\s*=\s*([0-9.]+)\s*\+\s*([0-9.]+)\s*θ/i);
  if (match) {
    console.log('Matched pattern 3 (θ without *):', match);
    return { type: "spiral", a: parseFloat(match[1]), b: parseFloat(match[2]) };
  }

  // r = a + b theta (word form without multiplication)
  match = expr.match(/r\s*=\s*([0-9.]+)\s*\+\s*([0-9.]+)\s*theta/i);
  if (match) {
    console.log('Matched pattern 4 (theta without *):', match);
    return { type: "spiral", a: parseFloat(match[1]), b: parseFloat(match[2]) };
  }

  console.log('No spiral patterns matched');
  return null;
}

// Parse Lemniscate equation like r² = a²sin(2θ) or r² = a²cos(2θ)
function parseLemniscate(expr) {
  console.log('parseLemniscate called with:', expr);
  
  // r² = a²sin(2θ) - using ² symbol
  let match = expr.match(/r²\s*=\s*([0-9.]+)²\s*sin\(\s*2θ\s*\)/i);
  if (match) {
    console.log('Matched lemniscate pattern 1 (a²sin(2θ)):', match);
    return { type: "lemniscate", a: parseFloat(match[1]), trig: "sin" };
  }

  // r² = a²cos(2θ) - using ² symbol
  match = expr.match(/r²\s*=\s*([0-9.]+)²\s*cos\(\s*2θ\s*\)/i);
  if (match) {
    console.log('Matched lemniscate pattern 2 (a²cos(2θ)):', match);
    return { type: "lemniscate", a: parseFloat(match[1]), trig: "cos" };
  }

  // r^2 = a^2*sin(2θ) - using ^2 notation
  match = expr.match(/r\^2\s*=\s*([0-9.]+)\^2\s*\*\s*sin\(\s*2θ\s*\)/i);
  if (match) {
    console.log('Matched lemniscate pattern 3 (a^2*sin(2θ)):', match);
    return { type: "lemniscate", a: parseFloat(match[1]), trig: "sin" };
  }

  // r^2 = a^2*cos(2θ) - using ^2 notation
  match = expr.match(/r\^2\s*=\s*([0-9.]+)\^2\s*\*\s*cos\(\s*2θ\s*\)/i);
  if (match) {
    console.log('Matched lemniscate pattern 4 (a^2*cos(2θ)):', match);
    return { type: "lemniscate", a: parseFloat(match[1]), trig: "cos" };
  }

  // Simplified forms: r²=sin(2θ) or r²=cos(2θ) (a=1)
  match = expr.match(/r²\s*=\s*sin\(\s*2θ\s*\)/i);
  if (match) {
    console.log('Matched lemniscate pattern 5 (sin(2θ), a=1):', match);
    return { type: "lemniscate", a: 1, trig: "sin" };
  }

  match = expr.match(/r²\s*=\s*cos\(\s*2θ\s*\)/i);
  if (match) {
    console.log('Matched lemniscate pattern 6 (cos(2θ), a=1):', match);
    return { type: "lemniscate", a: 1, trig: "cos" };
  }

  console.log('No lemniscate patterns matched');
  return null;
}

export default function ThreeDModel({ expr }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!expr) return;
    
    console.log('ThreeDModel received expression:', expr);

    let curveType = null;
    let params = null;

    // Try rose curve first
    const rose = parseRoseCurve(expr);
    if (rose) {
      console.log('Parsed as rose:', rose);
      curveType = "rose";
      params = rose;
    } else {
      // Try cardioid
      const cardioid = parseCardioid(expr);
      if (cardioid) {
        console.log('Parsed as cardioid:', cardioid);
        curveType = "cardioid";
        params = cardioid;
      } else {
        // Try Archimedean spiral
        console.log('Trying to parse as spiral:', expr);
        const spiral = parseArchimedeanSpiral(expr);
        if (spiral) {
          console.log('Parsed as spiral:', spiral);
          curveType = "spiral";
          params = spiral;
        } else {
          // Try Lemniscate
          console.log('Trying to parse as lemniscate:', expr);
          const lemniscate = parseLemniscate(expr);
          if (lemniscate) {
            console.log('Parsed as lemniscate:', lemniscate);
            curveType = "lemniscate";
            params = lemniscate;
          } else {
            console.log('No lemniscate pattern matched');
          }
        }
      }
    }

    if (!curveType) {
      console.log('No curve type matched for:', expr);
      return;
    }

    console.log('Final curve type:', curveType, 'params:', params);

    // Generate points with 3D variation
    const points = [];
    // For spirals, use more turns to show the spiral effect
    const maxTheta = curveType === "spiral" ? 6 * Math.PI : 2 * Math.PI;
    const numPoints = curveType === "spiral" ? 1500 : 1000;
    
    for (let i = 0; i <= numPoints; i++) {
      const theta = (i / numPoints) * maxTheta;
      let r, x, y, z;
      
      if (curveType === "rose") {
        r = params.a * Math.sin(params.k * theta);
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
        // Add 3D variation: gentle wave in Z-direction for rose curves
        z = Math.sin(theta * 2) * 0.3;
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
        // Add 3D variation: heart-shaped extrusion with oscillation
        z = Math.cos(theta * 3) * 0.2;
      } else if (curveType === "spiral") {
        // r = a + b*θ (Archimedean spiral)
        r = params.a + params.b * theta;
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
        // Add 3D variation: ascending spiral in Z-direction
        z = theta * 0.08;
      } else if (curveType === "lemniscate") {
        // r² = a²*trig(2θ), so r = a*sqrt(|trig(2θ)|)
        const trigValue = params.trig === "sin" ? Math.sin(2 * theta) : Math.cos(2 * theta);
        
        // Only plot when trigValue >= 0 (real values only)
        if (trigValue >= 0) {
          r = params.a * Math.sqrt(trigValue);
          x = r * Math.cos(theta);
          y = r * Math.sin(theta);
          // Add 3D variation: figure-8 with Z-twist
          z = Math.sin(theta * 4) * 0.25;
          points.push(new THREE.Vector3(x, y, z));
          
          // Also add the negative r values to complete the figure-8
          if (r > 0) {
            r = -params.a * Math.sqrt(trigValue);
            x = r * Math.cos(theta);
            y = r * Math.sin(theta);
            // Opposite Z-twist for negative r values
            z = -Math.sin(theta * 4) * 0.25;
            points.push(new THREE.Vector3(x, y, z));
          }
        }
        continue; // Skip the normal point addition below
      }
      
      // Add points for non-lemniscate curves with 3D coordinates
      if (curveType !== "lemniscate") {
        points.push(new THREE.Vector3(x, y, z));
      }
    }

    console.log('Generated points count:', points.length);
    
    // Check if we have enough points to create a curve
    if (points.length < 2) {
      console.error('Not enough points to create curve:', points.length);
      return;
    }

    // Create tube geometry along the curve with enhanced 3D appearance
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 400, 0.12, 20, false); // ✅ Increased radius from 0.05 to 0.12, more segments
    
    // ✅ Cyan-Yellow mixed color for all curves
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x00FFAA,        // ✅ Cyan-green base color
      emissive: 0x332200,     // ✅ Yellow emissive glow
      specular: 0xFFFF44,     // ✅ Bright yellow-green specular highlights
      shininess: 150,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide  // ✅ Render both sides for better visibility
    });
    
    const mesh = new THREE.Mesh(geometry, material);

    // Scene setup with enhanced lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000'); // Set background to black
    scene.add(mesh);
    
    // Add ambient lighting for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // ✅ Increased ambient for better visibility
    scene.add(ambientLight);
    
    // Add directional light for 3D depth and shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // ✅ Increased intensity
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // ✅ Add cyan accent light for color enhancement
    const cyanLight = new THREE.PointLight(0x00FFFF, 0.4, 100);
    cyanLight.position.set(-10, 10, 5);
    scene.add(cyanLight);
    
    // ✅ Add yellow accent light for color mixing
    const yellowLight = new THREE.PointLight(0xFFFF00, 0.4, 100);
    yellowLight.position.set(10, -10, 5);
    scene.add(yellowLight);

    // Enhanced camera setup for better 3D visualization
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
    
    // Position camera to show 3D depth better
    if (curveType === "spiral") {
      camera.position.set(15, 10, 20); // Better angle for spirals
    } else if (curveType === "lemniscate") {
      camera.position.set(3, 2, 4);    // Good angle for figure-8
    } else {
      camera.position.set(3, 2, 4);    // Good angle for roses and cardioids
    }
    
    camera.lookAt(0, 0, 0); // Look at the center of the scene

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