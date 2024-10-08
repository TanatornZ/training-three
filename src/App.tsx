import { useEffect, useRef } from "react";
import * as THREE from "three";

function App() {
  const canvas = useRef<HTMLCanvasElement>(null!);
  useEffect(() => {
    if (!canvas.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas.current,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: "#ffffff", // White color
      metalness: 0.2, // Make it less metallic for better lighting
      roughness: 0.7, // Adjust roughness to control reflections });
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Light sources
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft ambient light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 30); // point light
    pointLight.position.set(5, 5, 5); // set light position
    scene.add(pointLight);

    camera.position.z = 5;

    function animate() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      renderer.dispose(); // Dispose of the renderer and context
    };
  }, [canvas.current]);

  return (
    <canvas ref={canvas} style={{ width: "100vw", height: "100vh" }}></canvas>
  );
}

export default App;
